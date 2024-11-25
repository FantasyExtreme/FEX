import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface GetAllTransactionProps {
  contestId: [] | [string];
  userId: [] | [Principal];
  page: bigint;
  limit: bigint;
}
export type Icrc1Tokens = bigint;
export type Key = string;
export type Result = { ok: string } | { err: [string, boolean] };
export interface ReturnTransactions {
  total: bigint;
  transaction: Transactions__1;
}
export interface Transaction {
  to: Principal;
  title: string;
  contestId: string;
  transaction_type: TransactionType;
  from: Principal;
  user: Principal;
  created_at_time: bigint;
  amount: Icrc1Tokens;
}
export type TransactionType =
  | { receive: null }
  | { pending: null }
  | { send: null }
  | { rejected: null };
export interface Transaction__1 {
  to: Principal;
  title: string;
  contestId: string;
  transaction_type: TransactionType;
  from: Principal;
  user: Principal;
  created_at_time: bigint;
  amount: Icrc1Tokens;
}
export type Transactions = Array<[Key, Transaction__1]>;
export type Transactions__1 = Array<[Key, Transaction__1]>;
export interface anon_class_13_1 {
  addTransaction: ActorMethod<[Transaction, [] | [string]], Result>;
  getAllTransactions: ActorMethod<[GetAllTransactionProps], ReturnTransactions>;
  getMyTransactions: ActorMethod<
    [{ contestId: [] | [string]; page: bigint; limit: bigint }],
    { total: bigint; transaction: Transactions }
  >;
  getTransaction: ActorMethod<[string], [] | [Transaction]>;
}
export interface _SERVICE extends anon_class_13_1 {}
