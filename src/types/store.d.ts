import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { NFID } from '@nfid/embed';

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
  rewardPercentage: number;
  balance: number;
  ckBalance?: number;
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
  icpRate:number,
  setIdentity: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setPrincipal: (input: string) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
  setICPRate: (input: number) => void;
}

export interface ConnectPlugWalletSlice {
  identity: any;
  principal: string;
  auth: Auth;
  userAuth: UserAuth;
  balance: number;
  reward: number;
  emailConnected: boolean;
  icpRate:number,
  setIdentity: (input: any) => void;
  setEmailConnected: (input: boolean) => void;
  setPrincipal: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
  setICPRate: (input: number) => void;

}
