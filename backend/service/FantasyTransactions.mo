import Int "mo:base/Int";
import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Order "mo:base/Order";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Types "../model/Types";
shared ({ caller = initializer }) actor class () {

  type Transactions = Types.Transactions;
  type Transaction = Types.Transaction;
  type Key = Types.Key;
  var MAX_TRANS_LIMIT = Types.MAX_TRANS_LIMIT;

  stable var stable_transactions : Transactions = [];
  var transactionsStorage = Map.fromIter<Key, Transaction>(stable_transactions.vals(), 0, Text.equal, Text.hash);
  /*
getLimit use to  check limit provided by caller is must to be greater then max limit
@perms limit
@return boolean
  */
  func getLimit(limit : Nat) : Nat {
    var tempLimit = MAX_TRANS_LIMIT;
    if (limit < MAX_TRANS_LIMIT) tempLimit := limit;
    return tempLimit;
  };
  /*
compareFunc use to sort array by creation date used as a callback
@perms (_ka : Key, a : Transaction), (_kb : Key, b : Transaction)
@return order.Order

  */
  let compareFunc = func((_ka : Key, a : Transaction), (_kb : Key, b : Transaction)) : Order.Order {
    if (a.created_at_time > b.created_at_time) {
      return #less;
    } else if (a.created_at_time < b.created_at_time) {
      return #greater;
    } else {
      return #equal;
    };
  };
  /*
addTransaction use to add a new transaction
@perms {Transaction}
@return id of transaction

  */
  public shared ({ caller }) func addTransaction(transactionArg : Transaction, id : ?Text) : async Result.Result<(Text), (Text, Bool)> {
    assert Principal.isController(caller);
    try {

      var transactionId = Types.generateNewRemoteObjectId();
      switch (id) {
        case (null) {};
        case (?isId) {
          transactionId := transactionId # isId;
        };
      };
      transactionsStorage.put(transactionId, transactionArg);
      return #ok(transactionId);
    } catch (err) {
      return #err("Errer while saving transaction", false);
    };

  };
  /*
getTransaction use to get a transaction
@perms id of transaction
@return ?Transaction

  */

  public query func getTransaction(transaction_Id : Text) : async ?Transaction {
    return transactionsStorage.get(transaction_Id);
  };
  /*
getAllTransactions use to get all transactions only controller can call
@perms {
      userId : ?Principal;
      contestId : ?Text;
      page : Nat;
      limit : Nat;

    }
@return { total : Nat; transaction : Transactions }

  */
  public query ({ caller }) func getAllTransactions(
    props : Types.GetAllTransactionProps
  ) : async Types.ReturnTransactions {

    assert Principal.isController(caller);

    var limit = getLimit(props.limit);

    var temptransactionsStorage = Map.HashMap<Key, Transaction>(0, Text.equal, Text.hash);

    for ((key, trans) in transactionsStorage.entries()) {

      switch (props.userId, props.contestId) {

        case (null, null) {
          temptransactionsStorage.put(key, trans)

        };
        case (?isuserId, null) {
          if (trans.user == isuserId) {
            temptransactionsStorage.put(key, trans);
          };
        };
        case (null, ?isContestId) {
          if (trans.contestId == isContestId) {
            temptransactionsStorage.put(key, trans);
          };
        };
        case (?isuserId, ?isContestId) {
          if (trans.contestId == isContestId and trans.user == isuserId) {
            temptransactionsStorage.put(key, trans);
          };
        };

      };

    };
    let tempTransactions : Transactions = Iter.toArray(temptransactionsStorage.entries());
    let sortedTrans = Array.sort(tempTransactions, compareFunc);
    let totalTrans = Array.size(sortedTrans);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalTrans) {
      return { total = totalTrans; transaction = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalTrans) {
      endIndex := totalTrans;
    };

    let slicedTrans = Iter.toArray(Array.slice<(Key, Transaction)>(sortedTrans, startIndex, endIndex));
    return {
      total = totalTrans;
      transaction = slicedTrans;
    };

  };
  /*
getMyTransactions use to get user transactions onyone can get own tranactions
@perms {
      userId : ?Principal;
      contestId : ?Text;
      page : Nat;
      limit : Nat;

    }
@return { total : Nat; transaction : Transactions }

  */
  public query ({ caller }) func getMyTransactions(
    props : {
      contestId : ?Text;
      page : Nat;
      limit : Nat;

    }
  ) : async { total : Nat; transaction : Transactions } {
    let userId = caller;
    var limit = getLimit(props.limit);
    var temptransactionsStorage = Map.HashMap<Key, Transaction>(0, Text.equal, Text.hash);
    for ((key, trans) in transactionsStorage.entries()) {
      switch (props.contestId) {
        case (null) {
          if (trans.user == userId) {
            temptransactionsStorage.put(key, trans);
          };
        };
        case (?isContestId) {
          if (trans.contestId == isContestId and trans.user == userId) {
            temptransactionsStorage.put(key, trans);
          };
        };
      };

    };
    let tempTransactions : Transactions = Iter.toArray(temptransactionsStorage.entries());

    let sortedTrans = Array.sort(tempTransactions, compareFunc);
    let totalTrans = Array.size(sortedTrans);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalTrans) {
      return { total = totalTrans; transaction = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalTrans) {
      endIndex := totalTrans;
    };
    let slicedTrans = Iter.toArray(Array.slice<(Key, Transaction)>(sortedTrans, startIndex, endIndex));
    return {
      total = totalTrans;
      transaction = slicedTrans;
    };
  };
  public shared ({ caller }) func testingRemove() {
    assert Principal.isController(caller);
    stable_transactions := [];
    transactionsStorage := Map.fromIter<Key, Transaction>(stable_transactions.vals(), stable_transactions.size(), Text.equal, Text.hash);
  };
  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_transactions := Iter.toArray(transactionsStorage.entries());

    Debug.print("pre-upgrade finished.");
  };
  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    transactionsStorage := Map.fromIter<Key, Transaction>(stable_transactions.vals(), stable_transactions.size(), Text.equal, Text.hash);
    stable_transactions := [];

    Debug.print("post-upgrade finished.");
  };
};
