export const idlFactory = ({ IDL }) => {
  const TransactionType = IDL.Variant({
    receive: IDL.Null,
    pending: IDL.Null,
    send: IDL.Null,
    rejected: IDL.Null,
  });
  const Icrc1Tokens = IDL.Nat;
  const Transaction = IDL.Record({
    to: IDL.Principal,
    title: IDL.Text,
    contestId: IDL.Text,
    transaction_type: TransactionType,
    from: IDL.Principal,
    user: IDL.Principal,
    created_at_time: IDL.Int,
    amount: Icrc1Tokens,
  });
  const Result = IDL.Variant({
    ok: IDL.Text,
    err: IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const GetAllTransactionProps = IDL.Record({
    contestId: IDL.Opt(IDL.Text),
    userId: IDL.Opt(IDL.Principal),
    page: IDL.Nat,
    limit: IDL.Nat,
  });
  const Key = IDL.Text;
  const Transaction__1 = IDL.Record({
    to: IDL.Principal,
    title: IDL.Text,
    contestId: IDL.Text,
    transaction_type: TransactionType,
    from: IDL.Principal,
    user: IDL.Principal,
    created_at_time: IDL.Int,
    amount: Icrc1Tokens,
  });
  const Transactions__1 = IDL.Vec(IDL.Tuple(Key, Transaction__1));
  const ReturnTransactions = IDL.Record({
    total: IDL.Nat,
    transaction: Transactions__1,
  });
  const Transactions = IDL.Vec(IDL.Tuple(Key, Transaction__1));
  const anon_class_13_1 = IDL.Service({
    addTransaction: IDL.Func([Transaction, IDL.Opt(IDL.Text)], [Result], []),
    getAllTransactions: IDL.Func(
      [GetAllTransactionProps],
      [ReturnTransactions],
      ['query'],
    ),
    getMyTransactions: IDL.Func(
      [
        IDL.Record({
          contestId: IDL.Opt(IDL.Text),
          page: IDL.Nat,
          limit: IDL.Nat,
        }),
      ],
      [IDL.Record({ total: IDL.Nat, transaction: Transactions })],
      ['query'],
    ),
    getTransaction: IDL.Func([IDL.Text], [IDL.Opt(Transaction)], ['query']),
  });
  return anon_class_13_1;
};
export const init = ({ IDL }) => {
  return [];
};
