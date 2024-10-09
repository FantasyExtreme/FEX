import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface IUser { 'name' : string, 'email' : string }
export type Key = string;
export type Result = { 'ok' : [string, [] | [User]] } |
  { 'err' : string };
export type Role = { 'admin' : null } |
  { 'user' : null };
export interface User {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export interface User__1 {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export type Users = Array<[Key, User__1]>;
export interface _anon_class_17_1 {
  'addUser' : ActorMethod<[IUser], Result>,
  'getAdmins' : ActorMethod<[], Users>,
  'getUser' : ActorMethod<[[] | [string]], [] | [User]>,
  'makeAdmin' : ActorMethod<[Principal], boolean>,
}
export interface _SERVICE extends _anon_class_17_1 {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
