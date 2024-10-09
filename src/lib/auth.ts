import { makeFantasyFootballActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { Actor } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { JsonnableDelegationChain } from '@dfinity/identity';
import React from 'react';
import { create } from 'zustand';
import { Principal } from '@dfinity/principal';
import { ConnectPlugWalletSlice } from '@/types/store';
import { fromNullable } from '@dfinity/utils';
import { toast } from 'react-toastify';

interface AuthState {
  state: string;
  actor: Actor | null;
  client: AuthClient | null;
}
interface methodsProps {
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  useAuthStore: ReturnType<typeof create>;
  client?: AuthClient;
  handleClose?: () => void;
}

const authMethods = ({
  setIsLoading,
  useAuthStore,
  handleClose,
  client,
}: methodsProps) => {
  const { auth, setAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    setAuth: (state as ConnectPlugWalletSlice).setAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));

  const initAuth = async () => {
    logger('INIIITINNNNG');
    setAuth({ ...auth, isLoading: true });
    const client = await AuthClient.create({
      idleOptions: {
        // idleTimeout: 1000 * 3, // set to 30 minutes
        idleTimeout: 1000 * 60 * 60 * 2, // set to 2 hours
      },
    });
    if (setIsLoading) {
      setIsLoading(true);
      if (await client.isAuthenticated()) {
        const tempAuth = await authenticate(client);
        setIsLoading(false);
        return { success: false, actor: tempAuth };
      } else {
        setIsLoading(false);
        const tempActor = makeFantasyFootballActor();
        setAuth({
          ...auth,
          state: 'anonymous',
          actor: tempActor,
          client,
          isLoading: false,
        });
        return { success: false, actor: tempActor };
      }
    }
    return { success: false, actor: null };
  };
  const login = async () => {
    let ran = false;
    if (
      auth &&
      auth.state === 'anonymous' &&
      auth.client &&
      handleClose &&
      setIsLoading
    ) {
      setIsLoading(true);
      await auth.client.login({
        // maxTimeToLive: BigInt(1800) * BigInt(1_000_000_000),
        // identityProvider: 'https://identity.ic0.app/#authorize',
        identityProvider:
          process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app/#authorize'
            : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/#authorize`,
        // `http://localhost:4943?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}#authorize`,
        onSuccess: () => {
          authenticate(auth.client as AuthClient);
        },
        onError: () => {
          handleClose();
        },
      });
      const refreshLogin = () => {
        // prompt the user then refresh their authentication
        logger(
          'WE CAUGHT EM LACKINNNNN>>>::>>>::>>>::  >>>:: >>>:: >>>:: >>>:: v v >>>:: >>>::>>>::',
        );
        if (auth.client) {
          auth.client.login({
            onSuccess: async () => {
              authenticate(auth.client as AuthClient).then(() => {
                handleClose();
              });
            },
          });
        }
      };

      auth.client.idleManager?.registerCallback?.(refreshLogin);
    } else if (auth && !ran && auth.state === 'anonymous') {
      initAuth();
      ran = true;
    } else {
      logger('Login did not start');
    }
  };
  const logout = async () => {
    setAuth({ ...auth, isLoading: true });

    if (auth.state === 'initialized' && auth.client) {
      logger('LOGGIN OUT');
      await auth.client.logout();
      const client = await AuthClient.create({
        idleOptions: {
          idleTimeout: (1000 * 60 * 60) / 2, // set to half an hour
        },
      });
      const tempActor = makeFantasyFootballActor();
      setUserAuth({
        name: '',
        role: '',
        userPerms: null,
        rewardPercentage: 0,
        email: '',
      });
      setAuth({
        ...auth,
        state: 'anonymous',
        actor: tempActor,
        client: client,
        isLoading: false,
      });

      // router.push('/');
    } else {
      logger(auth.client, 'cant logout');
    }
  };
  const getPerms = (role: any) => {
    let userPerms = {
      admin: false,
    };
    if (role.hasOwnProperty('user')) {
      userPerms = {
        admin: false,
      };
    } else if (role.hasOwnProperty('admin')) {
      userPerms = {
        admin: true,
      };
    }
    return userPerms;
  };
  const authenticate = async (client: AuthClient) => {
    try {
      setAuth({
        ...auth,
        isLoading: true,
      });
      const myIdentity = client?.getIdentity();
      const actor = makeFantasyFootballActor({
        agentOptions: {
          identity: myIdentity,
        },
      });

      const resp = await actor.getUser([]);
      const user: any = fromNullable(resp);
      logger(user, 'userss');
      if (user) {
        let userPerms = getPerms(user?.role);
        setUserAuth({
          name: user?.name,
          role: user?.role,
          email: user?.email,
          userPerms,
          rewardPercentage:  0,
        });
        if (handleClose) handleClose();
      }
      setAuth({
        ...auth,
        state: 'initialized',
        actor,
        client,
        isLoading: false,
        identity: myIdentity,
      });
      if (handleClose) handleClose();
      return actor;
    } catch (e) {
      setAuth({
        ...auth,
        state: 'error',
      });
      if (handleClose) handleClose();
      setUserAuth({
        name: '',
        role: '',
        userPerms: null,
        rewardPercentage: 0,
        email: '',
      });
      logger(e, 'Error while authenticating');
    }
  };

  return {
    initAuth,
    login,
    logout,
    authenticate,
  };
};
export default authMethods;
// export default { initAuth, login, logout, authenticate };

// export default { initAuth, login, logout, authenticate };
