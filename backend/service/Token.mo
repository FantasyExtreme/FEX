import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Error "mo:base/Error";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";

shared ({ caller = initializer }) actor class Ledger(init : { minting_account : { owner : Principal; subaccount : ?Blob; amount : Nat }; token_name : Text; token_symbol : Text; decimals : Nat8; transfer_fee : Nat }) = this {

  public type Account = { owner : Principal; subaccount : ?Subaccount };
  public type Subaccount = Blob;
  public type Tokens = Nat;
  public type Memo = Blob;
  public type Timestamp = Nat64;
  public type Duration = Nat64;
  public type TxIndex = Nat;
  public type TxId = Text;
  public type Id = Principal;
  public type Value = { #Nat : Nat; #Int : Int; #Blob : Blob; #Text : Text };
  public type AccountToken = { subaccount : ?Subaccount; tokens : Tokens };
  public type AccountTokens = [AccountToken];
  public type Operation = {
    #Approve : Approve;
    #Transfer : Transfer;
    #Burn : Transfer;
    #Mint : Transfer;
  };

  public type CommonFields = {
    memo : ?Memo;
    fee : ?Tokens;
    created_at_time : ?Timestamp;
  };

  public type Approve = CommonFields and {
    from : Account;
    spender : Account;
    amount : Nat;
    expires_at : ?Nat64;
  };

  public type TransferSource = {
    #Init;
    #Icrc1Transfer;
    #Icrc2TransferFrom;
  };

  public type Transfer = CommonFields and {
    spender : Account;
    source : TransferSource;
    to : Account;
    from : Account;
    amount : Tokens;
  };

  public type Allowance = { allowance : Nat; expires_at : ?Nat64 };

  public type Transaction = {
    operation : Operation;
    // Effective fee for this transaction.
    fee : Tokens;
    timestamp : Timestamp;
  };
  public type TransactionWithIndex = Transaction and {
    index : Nat;
  };

  public type DeduplicationError = {
    #TooOld;
    #Duplicate : { duplicate_of : TxIndex };
    #CreatedInFuture : { ledger_time : Timestamp };
  };

  public type CommonError = {
    #InsufficientFunds : { balance : Tokens };
    #BadFee : { expected_fee : Tokens };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };

  public type TransferError = DeduplicationError or CommonError or {
    #BadBurn : { min_burn_amount : Tokens };
  };

  public type ApproveError = DeduplicationError or CommonError or {
    #Expired : { ledger_time : Nat64 };
    #AllowanceChanged : { current_allowance : Nat };
  };

  public type TransferFromError = TransferError or {
    #InsufficientAllowance : { allowance : Nat };
  };

  public type Result<T, E> = { #Ok : T; #Err : E };

  let maxMemoSize = 32;
  let permittedDriftNanos : Duration = 60_000_000_000;
  let transactionWindowNanos : Duration = 24 * 60 * 60 * 1_000_000_000;
  let defaultSubaccount : Subaccount = Blob.fromArrayMut(Array.init(32, 0 : Nat8));

  public type AllowanceRecord = {
    allowance : Nat;
    expires_at : ?Nat64;
    to : Principal;
  };

  public type Accounts = [(Id, AccountTokens)];
  public type UserAllownce = [(Id, [AllowanceRecord])];

  stable var total_supply : Tokens = 0;
  stable var transactionIndex : Nat = 0;
  stable var stable_logs : [(TxId, TransactionWithIndex)] = [];
  stable var stable_accounts : Accounts = [];
  stable var stable_allownce : UserAllownce = [];

  var accountStorage = Map.fromIter<Id, AccountTokens>(stable_accounts.vals(), 0, Principal.equal, Principal.hash);
  var allownceStorage = Map.fromIter<Id, [AllowanceRecord]>(stable_allownce.vals(), 0, Principal.equal, Principal.hash);
  var logStorage = Map.fromIter<TxId, TransactionWithIndex>(stable_logs.vals(), 0, Text.equal, Text.hash);

  // utils
  func generateTxId(tx : Transaction and { memo : ?Memo }) : TxId {
    var id = Nat64.toText(tx.timestamp);
    switch (tx.operation) {
      case (#Transfer(transfer)) {
        id := id # Principal.toText(transfer.to.owner);
      };
      case (#Burn(transfer)) {
        id := id # Principal.toText(transfer.to.owner);
      };
      case (#Mint(transfer)) {
        id := id # Principal.toText(transfer.to.owner);
      };
      case (#Approve(approve)) {
        id := id # Principal.toText(approve.spender.owner);
      };
    };
    switch (tx.memo) {
      case (?memo) {
        let n = Blob.hash(memo);
        let string = Nat32.toText(n);
        id := id # string;
      };
      case (null) {};
    };
    return id;
  };
  // Computes the balance of the specified account.
  func balance(account : Account) : Nat {
    let maybeAccountTokens = accountStorage.get(account.owner);
    let inputSubaccount = Option.get(account.subaccount, defaultSubaccount);
    var balance = 0;
    switch (maybeAccountTokens) {
      case (null) {};
      case (?accountTokens) {
        for (accountToken in accountTokens.vals()) {
          let subaccount = Option.get(accountToken.subaccount, defaultSubaccount);
          if (subaccount == inputSubaccount) {
            balance += accountToken.tokens;
          };
        };
      };
    };
    return balance;
  };
  // Updates the balance of the specified account (and the subaccount if specified).
  func updateBalance(fromAccount : ?Account, toAccount : Account, amount : Nat) {
    switch (fromAccount) {
      case (?isFromAccount) {
        let maybeFromAccountTokens = accountStorage.get(isFromAccount.owner);
        let inputFromSubaccount = Option.get(isFromAccount.subaccount, defaultSubaccount);
        switch (maybeFromAccountTokens) {
          case (null) {};
          case (?accountTokens) {
            let accountTokenBuffer = Buffer.fromArray<AccountToken>(accountTokens);
            let newBuffer = Buffer.map<AccountToken, AccountToken>(
              accountTokenBuffer,
              func(accountToken) {
                let subaccount = Option.get(accountToken.subaccount, defaultSubaccount);
                if (subaccount == inputFromSubaccount) {
                  var newBlanace = accountToken.tokens;
                  if ((accountToken.tokens - amount) : Int < 0) {
                    // Underflow of tokens, tried to send more than possible amount of tokens
                    assert false;
                  } else {
                    newBlanace -= amount;
                  };
                  return {
                    subaccount = accountToken.subaccount;
                    tokens = newBlanace;
                  };
                } else {
                  return accountToken;
                };
              },
            );
            let _newAccountTokens = accountStorage.replace(isFromAccount.owner, Buffer.toArray(newBuffer));

          };
        };
      };
      case (null) {};
    };
    let maybeToAccountTokens = accountStorage.get(toAccount.owner);
    let inputToSubaccount = Option.get(toAccount.subaccount, defaultSubaccount);
    switch (maybeToAccountTokens) {
      case (null) {
        let firstAccountToken = {
          subaccount = toAccount.subaccount;
          tokens = amount;
        };
        let _newAccountTokens = accountStorage.put(toAccount.owner, [firstAccountToken]);
      };
      case (?accountTokens) {
        let accountTokenBuffer = Buffer.fromArray<AccountToken>(accountTokens);
        let newBuffer = Buffer.map<AccountToken, AccountToken>(
          accountTokenBuffer,
          func(accountToken) {
            let subaccount = Option.get(accountToken.subaccount, defaultSubaccount);
            if (subaccount == inputToSubaccount) {
              let newBlanace = accountToken.tokens + amount;
              return {
                subaccount = accountToken.subaccount;
                tokens = newBlanace;
              };
            } else {
              return accountToken;
            };
          },
        );
        let _newAccountTokens = accountStorage.replace(toAccount.owner, Buffer.toArray(newBuffer));

      };
    };

  };
  // verification methods
  func validateSubaccount(s : ?Subaccount) {
    let subaccount = Option.get(s, defaultSubaccount);
    assert (subaccount.size() == 32);
  };

  func validateMemo(m : ?Memo) {
    switch (m) {
      case (null) {};
      case (?memo) { assert (memo.size() <= maxMemoSize) };
    };
  };
  // Checks whether two accounts are semantically equal.
  func accountsEqual(lhs : Account, rhs : Account) : Bool {
    let lhsSubaccount = Option.get(lhs.subaccount, defaultSubaccount);
    let rhsSubaccount = Option.get(rhs.subaccount, defaultSubaccount);

    Principal.equal(lhs.owner, rhs.owner) and Blob.equal(
      lhsSubaccount,
      rhsSubaccount,
    );
  };

  func checkTxTime(created_at_time : ?Timestamp, now : Timestamp) : Result<(), DeduplicationError> {
    let txTime : Timestamp = Option.get(created_at_time, now);

    if ((txTime > now) and (txTime - now > permittedDriftNanos)) {
      return #Err(#CreatedInFuture { ledger_time = now });
    };

    if ((txTime < now) and (now - txTime > transactionWindowNanos + permittedDriftNanos)) {
      return #Err(#TooOld);
    };

    #Ok(());
  };
  func checkTransferDeduplication(transfer : Transfer) : ?TxId {
    let operation : Operation = #Transfer(transfer);
    switch (transfer.created_at_time) {
      case (null) {};
      case (?timestamp) {
        let tx = {
          operation = operation;
          timestamp;
          fee = 0;
          memo = transfer.memo;
        };
        let txId = generateTxId(tx);
        let maybeTransaction = logStorage.get(txId);
        switch (maybeTransaction) {
          case (null) {};
          case (?transaction) {
            switch (transaction.operation) {
              case (#Burn(args)) { if (args == transfer) { return ?txId } };
              case (#Mint(args)) { if (args == transfer) { return ?txId } };
              case (#Transfer(args)) { if (args == transfer) { return ?txId } };
              case (_) {};
            };
          };
        };
      };
    };
    return null;
  };
  func classifyTransfer(transfer : Transfer) : Result<(Operation, Tokens), TransferError> {
    let minter = init.minting_account;

    // if (Option.isSome(transfer.created_at_time)) {
    let maybeTxId = checkTransferDeduplication(transfer);
    switch (maybeTxId) {
      case (?txid) {
        return #Err(#Duplicate { duplicate_of = 00 });
      };
      case (null) {};
    };
    // {
    //     case (?txid) { return #Err(#Duplicate { duplicate_of = txid }) };
    //     case null {};
    //   };
    // };

    let result = if (accountsEqual(transfer.from, minter)) {
      if (Option.get(transfer.fee, 0) != 0) {
        return #Err(#BadFee { expected_fee = 0 });
      };
      let tokens = transfer.amount;
      updateBalance(null, transfer.to, tokens);
      total_supply += tokens;
      (#Mint(transfer), 0);
    } else if (accountsEqual(transfer.to, minter)) {
      if (Option.get(transfer.fee, 0) != 0) {
        return #Err(#BadFee { expected_fee = 0 });
      };

      if (transfer.amount < init.transfer_fee) {
        return #Err(#BadBurn { min_burn_amount = init.transfer_fee });
      };

      let debitBalance = balance(transfer.from);
      if (debitBalance < transfer.amount) {
        return #Err(#InsufficientFunds { balance = debitBalance });
      };
      let tokens = transfer.amount;
      updateBalance(?transfer.from, transfer.to, tokens);
      total_supply += tokens;
      (#Burn(transfer), 0);
    } else {
      let effectiveFee = init.transfer_fee;
      if (Option.get(transfer.fee, effectiveFee) != effectiveFee) {
        return #Err(#BadFee { expected_fee = init.transfer_fee });
      };

      let debitBalance = balance(transfer.from);
      if (debitBalance < transfer.amount + effectiveFee) {
        return #Err(#InsufficientFunds { balance = debitBalance });
      };
      let tokens = transfer.amount;
      updateBalance(?transfer.from, transfer.to, tokens);
      (#Transfer(transfer), effectiveFee);
    };
    #Ok(result);
  };
  // apply methods

  func recordTransaction(tx : Transaction and { memo : ?Memo }) : Nat {
    let id = generateTxId(tx);
    let index = transactionIndex;
    transactionIndex += 1;
    logStorage.put(id, { tx with index });
    return index;
  };

  func applyTransfer(args : Transfer) : Result<TxIndex, TransferError> {
    validateSubaccount(args.from.subaccount);
    validateSubaccount(args.to.subaccount);
    validateMemo(args.memo);
    let now = Nat64.fromNat(Int.abs(Time.now()));
    var timeStamp = now;
    switch (args.created_at_time) {
      case (?time) {
        timeStamp := time;
      };
      case (null) {};
    };

    switch (checkTxTime(args.created_at_time, now)) {
      case (#Ok(_)) {};
      case (#Err(e)) { return #Err(e) };
    };
    switch (classifyTransfer(args)) {
      case (#Ok((operation, effectiveFee))) {
        return #Ok(recordTransaction({ operation = operation; fee = effectiveFee; timestamp = timeStamp; memo = args.memo }));
      };
      case (#Err(e)) {
        return #Err(e);
      };
    };
  };

  public shared ({ caller }) func icrc1_transfer({
    from_subaccount : ?Subaccount;
    to : Account;
    amount : Tokens;
    fee : ?Tokens;
    memo : ?Memo;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, TransferError> {

    let from = {
      owner = caller;
      subaccount = from_subaccount;
    };
    return applyTransfer({
      spender = from;
      source = #Icrc1Transfer;
      from = from;
      to = to;
      amount = amount;
      fee = fee;
      memo = memo;
      created_at_time = created_at_time;
    });
  };

  public query func icrc1_balance_of(account : Account) : async Tokens {
    balance(account);
  };

  public query func icrc1_total_supply() : async Tokens {
    total_supply;
  };

  public query func icrc1_minting_account() : async ?Account {
    ?init.minting_account;
  };

  public query func icrc1_name() : async Text {
    init.token_name;
  };

  public query func icrc1_symbol() : async Text {
    init.token_symbol;
  };

  public query func icrc1_decimals() : async Nat8 {
    init.decimals;
  };

  public query func icrc1_fee() : async Nat {
    init.transfer_fee;
  };

  public query func icrc1_metadata() : async [(Text, Value)] {
    [
      ("icrc1:name", #Text(init.token_name)),
      ("icrc1:symbol", #Text(init.token_symbol)),
      ("icrc1:decimals", #Nat(Nat8.toNat(init.decimals))),
      ("icrc1:fee", #Nat(init.transfer_fee)),
    ];
  };

  public query func icrc1_supported_standards() : async [{
    name : Text;
    url : Text;
  }] {
    [
      {
        name = "ICRC-1";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-1";
      },
      {
        name = "ICRC-2";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-2";
      },
    ];
  };

  public shared ({ caller }) func icrc2_approve({
    from_subaccount : ?Subaccount;
    spender : Account;
    amount : Nat;
    expires_at : ?Nat64;
    expected_allowance : ?Nat;
    memo : ?Memo;
    fee : ?Tokens;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, ApproveError> {
    var tempcaller = caller;

    let tempAllownce : AllowanceRecord = {
      to = spender.owner;
      allowance = amount;
      expires_at = expires_at;
    };
    let allownce = allownceStorage.get(tempcaller);
    switch (allownce) {
      case (?isAllownce) {
        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == spender.owner);
        switch (isAlready) {
          case (?isAlready) {

            var filtered = Array.filter<AllowanceRecord>(isAllownce, func x = x.to != spender.owner);
            var newArray = Array.append<AllowanceRecord>(filtered, [tempAllownce]);
            let added = allownceStorage.put(tempcaller, newArray);
            return #Ok(amount);

          };
          case (null) {
            var newArray = Array.append<AllowanceRecord>(isAllownce, [tempAllownce]);
            let added = allownceStorage.put(tempcaller, newArray);
            return #Ok(amount);

          };
        };

      };
      case (null) {
        let tempArray = [tempAllownce];
        let added = allownceStorage.put(tempcaller, tempArray);
        return #Ok(amount);

      };
    };

  };
  func getAllowence(
    from : Id,
    to : Id,
  ) : Tokens {
    let allownce = allownceStorage.get(from);
    switch (allownce) {
      case (?isAllownce) {
        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == to);
        switch (isAlready) {
          case (?isAlready) {
            switch (isAlready.expires_at) {
              case (null) {
                return isAlready.allowance;
              };
              case (?expiryDate) {
                // let currentTime =Int.toNat(Time.now() / 1000000);
                let now = Nat64.fromNat(Int.abs(Time.now()));
                if (expiryDate >= now) {
                  return isAlready.allowance;

                } else {
                  return 0;

                };

              };
            };

          };
          case (null) {

            return 0;

          };
        };

      };
      case (null) {
        return 0;
      };
    };
  };
  func updateAllownce(to : Id, from : Id, tokens : Tokens) : () {
    let allownce = allownceStorage.get(from);
    switch (allownce) {
      case (?isAllownce) {

        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == to);
        switch (isAlready) {
          case (?isAlready) {
            var filtered = Array.filter<AllowanceRecord>(isAllownce, func x = x.to != to);
            let newAllownce = isAlready.allowance -tokens;
            let tempAllownce : AllowanceRecord = {
              to = to;
              allowance = newAllownce;
              expires_at = isAlready.expires_at;
            };
            var newArray = Array.append<AllowanceRecord>(filtered, [tempAllownce]);
            let added = allownceStorage.put(from, newArray);

          };
          case (null) {
            let tempAllownce : AllowanceRecord = {
              to = to;
              allowance = 0;
              expires_at = null;
            };
            var newArray = Array.append<AllowanceRecord>(isAllownce, [tempAllownce]);
            let added = allownceStorage.put(from, newArray);

          };
        };

      };
      case (null) {

      };
    };
  };
  func checkBalance(account : Id) : Tokens {
    let balance = accountStorage.get(account);
    switch (balance) {
      case (?isBalance) {
        return isBalance;

      };
      case (null) {
        return 0;
      };
    };
  };
  public shared ({ caller }) func icrc2_transfer_from({
    spender_subaccount : ?Subaccount;
    from : Account;
    to : Account;
    amount : Tokens;
    fee : ?Tokens;
    memo : ?Memo;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, TransferFromError> {
    let allownce = getAllowence(from.owner, caller);
    if (allownce <= 0) {
      return #Err(#InsufficientAllowance { allowance = allownce });

    } else {
      if (amount <= allownce) {
        let balance = checkBalance(from.owner);
        if (balance >= amount) {
          let tempBalanceOfSender = accountStorage.get(from.owner);
          switch (tempBalanceOfSender) {
            case (?tempBalanceOfSender) {
              if (tempBalanceOfSender < amount) {
                return #Err(#InsufficientFunds { balance = tempBalanceOfSender });
              };
              let newBalanceOfSender = tempBalanceOfSender -amount;
              let sended = accountStorage.replace(from.owner, newBalanceOfSender);
              let receiverBalance = accountStorage.get(to.owner);
              switch (receiverBalance) {
                case (?receiverBalance) {
                  let tempNewReceiverBalance = receiverBalance +amount;
                  let added = accountStorage.replace(to.owner, tempNewReceiverBalance);
                  let ans = updateAllownce(caller, from.owner, amount);
                  return #Ok(amount);
                };
                case (null) {
                  let ans = updateAllownce(caller, from.owner, amount);
                  let receiverBalance = accountStorage.put(to.owner, amount);
                  return #Ok(amount);

                };
              };

            };
            case (null) {
              return #Err(#InsufficientAllowance { allowance = allownce });

            };
          };

        } else {
          return #Err(#InsufficientAllowance { allowance = allownce });
        };

      } else {
        return #Err(#InsufficientAllowance { allowance = allownce });

      };

    };
  };

  public query func icrc2_allowance({ account : Account; spender : Account }) : async Allowance {
    let allownce = allownceStorage.get(account.owner);
    var allowance = 0;
    var expiryDate : ?Nat64 = null;

    switch (allownce) {
      case (?isAllownce) {
        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == spender.owner);
        switch (isAlready) {
          case (?isAlready) {
            allowance := isAlready.allowance;
            expiryDate := isAlready.expires_at;

          };
          case (null) {};
        };

      };
      case (null) {

      };
    };
    return { allowance = allowance; expires_at = expiryDate };
  };
  func initail_mints() : () {
    validateSubaccount(init.minting_account.subaccount);
    accountStorage.put(init.minting_account.owner, [{ subaccount = init.minting_account.subaccount; tokens = init.minting_account.amount }]);
    total_supply := init.minting_account.amount;
  };
  initail_mints();

  system func preupgrade() {
    stable_accounts := Iter.toArray(accountStorage.entries());
    stable_allownce := Iter.toArray(allownceStorage.entries());
    stable_logs := Iter.toArray(logStorage.entries());
  };
  system func postupgrade() {
    accountStorage := Map.fromIter<Id, AccountTokens>(stable_accounts.vals(), stable_accounts.size(), Principal.equal, Principal.hash);
    allownceStorage := Map.fromIter<Id, [AllowanceRecord]>(stable_allownce.vals(), stable_allownce.size(), Principal.equal, Principal.hash);
    logStorage := Map.fromIter<TxId, TransactionWithIndex>(stable_logs.vals(), stable_logs.size(), Text.equal, Text.hash);
    stable_accounts := [];
    stable_allownce := [];
    stable_logs := [];
  };
};
