import { ConnectPlugWalletSlice } from '@/types/store';

const authSlice = (
  set: (fn: (state: ConnectPlugWalletSlice) => ConnectPlugWalletSlice) => void,
  get: () => ConnectPlugWalletSlice,
) => ({
  auth: {
    state: 'initializing-auth',
    connectedWithWeb2: false,
    actor: null,
    client: null,
    isLoading: true,
    identity: null,
  },
  userAuth: {
    name: '',
    role: '',
    userPerms: null,
    email: '',
  },

  setAuth: (input: any): void =>
    set((state) => ({
      ...state,
      auth: input,
    })),

  setUserAuth: (input: any): void =>
    set((state) => ({
      ...state,
      userAuth: input,
    })),
});

export default authSlice;
