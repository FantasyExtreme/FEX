import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

interface Auth {
  state: 'initializing-auth' | 'anonymous' | 'initialized' | 'error';
  actor: Actor | null;
  client: AuthClient | null;
  isLoading: boolean;
  connectedWithWeb2: boolean;
  identity: Identity;
  agent: HttpAgent | null;
}
export interface UserPermissions {
  admin: boolean;
}

interface UserAuth {
  name: string;
  role: string;
  email: string;
  userPerms: null | UserPermissions;
}
export interface Wallet {
  balance: number;
  reward: number;
}
export interface ConnectStore {
  identity: any;
  principal: string;
  auth: Auth;
  userAuth: UserAuth;
  balance: number;
  reward: number;
  setIdentity: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setPrincipal: (input: string) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
}

export interface ConnectPlugWalletSlice {
  identity: any;
  principal: string;
  auth: Auth;
  userAuth: UserAuth;
  balance: number;
  reward: number;
  emailConnected: boolean;
  setIdentity: (input: any) => void;
  setEmailConnected: (input: boolean) => void;
  setPrincipal: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
}
