import { makeFantasyFootballActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { Actor, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import React, { useState, useCallback, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { ConnectPlugWalletSlice } from '@/types/store';
import { createAgent, fromNullable } from '@dfinity/utils';
import { toast } from 'react-toastify';
import { generateRandomName } from '@/components/utils/fantasy';
import { DASHBOARD_ROUTE } from '@/constant/routes';
import { getBalance } from './ledger';
import { NFID } from '@nfid/embed';
import { LoginEnum, appData } from '@/constant/fantasticonst';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const { auth, setAuth, userAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    setAuth: (state as ConnectPlugWalletSlice).setAuth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));
  const router = useRouter();

  const initAuth = useCallback(async () => {
    logger('INIIITINNNNG');
    setAuth({ ...auth, isLoading: true });
    const nfid = await NFID.init({
      application: {
        name: appData.name,
        logo: appData.logo,
      },
      idleOptions: {
        // idleTimeout: 45 * 60 * 1000,
        // captureScroll: true,
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });
    const client = await AuthClient.create({
      idleOptions: {
        // idleTimeout: 1000 * 60 * 60 * 2, // set to 2 hours
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });

    if (await client.isAuthenticated()) {
      const tempAuth = await authenticate(client);
      return { success: false, actor: tempAuth };
    } else if (nfid.isAuthenticated) {
      const tempAuth = await authenticate(undefined, nfid.getIdentity());
      return { success: false, actor: tempAuth };
    } else {
      const tempActor = makeFantasyFootballActor();
      const newReward = await tempActor.getRewardPercentage();

      setAuth({
        ...auth,
        state: 'anonymous',
        actor: tempActor,
        client,
        isLoading: false,
      });
      setUserAuth({
        ...userAuth,
        rewardPercentage: Number(newReward),
      });
      return { success: false, actor: tempActor };
    }
  }, [setAuth]);

  const login = useCallback(
    async (type: LoginEnum, navigation: any, callBackfn: () => void) => {
      if (auth.state === 'anonymous') {
        setAuth({ ...auth, isLoading: true });
        if (type === LoginEnum.InternetIdentity) {
          if (!auth.client) {
            initAuth();
            console.error('AuthClient not initialized');
            return;
          }
          await auth.client.login({
            maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000),
            ...(process.env.NEXT_PUBLIC_ENVIRONMENT_TYPE === 'alpha' && {
              derivationOrigin: 'https://w2utv-nyaaa-aaaam-ac7iq-cai.icp0.io',
            }),

            identityProvider:
              process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
                ? 'https://identity.ic0.app/#authorize'
                : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/#authorize`,
            onSuccess: () => {
              authenticate(auth.client as AuthClient).then(() => {
                const path = window?.location;
                if (path?.pathname == '/') router.push(DASHBOARD_ROUTE);
                if (callBackfn) {
                  callBackfn();
                }
              });
            },
            onError: () => {
              setAuth({ ...auth, isLoading: false });
            },
          });
          const refreshLogin = () => {
            // prompt the user then refresh their authentication
            if (auth.client) {
              auth.client.login({
                onSuccess: async () => {
                  authenticate(auth.client as AuthClient);
                },
              });
            }
          };

          auth.client.idleManager?.registerCallback?.(refreshLogin);
        } else if (type === LoginEnum.NFID) {
          try {
            const nfid = await NFID.init({
              application: {
                name: appData.name,
                logo: appData.logo,
              },
              idleOptions: {
                // idleTimeout: 45 * 60 * 1000,
                // captureScroll: true,
                disableIdle: true,
                disableDefaultIdleCallback: true,
              },
            });
            const delegationIdentity: Identity = await nfid.getDelegation({
              maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000),
              ...(process.env.NEXT_PUBLIC_ENVIRONMENT_TYPE === 'alpha' && {
                derivationOrigin: 'https://w2utv-nyaaa-aaaam-ac7iq-cai.icp0.io',
              }),
            });
            authenticate(undefined, delegationIdentity).then(() => {
              const path = window?.location;
              if (path?.pathname == '/') router.push(DASHBOARD_ROUTE);
            });
          } catch (error) {
            setAuth({
              ...auth,
              isLoading: false,
            });
          }
        }
      }
    },
    [auth.state, auth.client, setAuth],
  );

  const logout = useCallback(async () => {
    setAuth({
      ...auth,
      isLoading: true,
    });

    if (auth.state === 'initialized') {
      logger('LOGGIN OUT');
      if (auth.client instanceof AuthClient) {
        await auth.client.logout();
      } else if (NFID._authClient.isAuthenticated) {
        await NFID._authClient.logout();
      }

      const tempActor = makeFantasyFootballActor();
      setUserAuth({
        name: '',
        role: '',
        userPerms: null,
        rewardPercentage: 0,
        email: '',
        balance: 0,
      });
      setAuth({
        ...auth,
        state: 'anonymous',
        actor: tempActor,
        isLoading: false,
      });
    } else {
      logger(auth.client, 'cant logout');
    }
  }, [auth.state, auth.client, setAuth, setUserAuth]);

  const getPerms = useCallback((role: any) => {
    if (role.hasOwnProperty('admin')) {
      return { admin: true };
    }
    return { admin: false };
  }, []);
  const updateBalance = useCallback(async () => {
    let balance = await getBalance(auth.identity);
    setUserAuth({ ...userAuth, balance });
    return balance;
  }, [setAuth, setUserAuth, userAuth]);
  const authenticate = useCallback(
    async (client?: AuthClient, identity?: Identity) => {
      try {
        if (!client && !identity) {
          return logger('Unexpected error while authenticating');
        }
        const development = process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic';
        // setAuth({ ...auth, isLoading: true });

        let myIdentity = client ? client.getIdentity() : identity;
        const agent = await createAgent({
          identity: myIdentity as Identity,
          host: development ? 'http://localhost:4943' : 'https:icp0.io',
        });
        if (development) {
          try {
            await agent.fetchRootKey();
          } catch (error) {
            logger(error, 'unable to fetch root key');
          }
        }
        // setAgent(agent);
        if (!myIdentity) return logger('Unexpected error while authenticating');

        const actor = makeFantasyFootballActor({
          agentOptions: {
            identity: myIdentity,
          },
        });

        const resp = await actor.getUser([]);
        const reward = await actor.getRewardPercentage();
        const user: any = fromNullable(resp);
        let balance = await getBalance(myIdentity);

        if (user) {
          let userPerms = getPerms(user?.role);
          setUserAuth({
            name: user?.name,
            role: user?.role,
            email: user?.email,
            userPerms,
            rewardPercentage: reward ? Number(reward) : 0,
            balance,
          });
        } else {
          let newUser = {
            name: generateRandomName(),
            email: '',
          };



          const resp = await actor.addUser(
            newUser
          );

          if (resp?.ok) {
        
       
          
            resp.ok[1] = fromNullable(resp?.ok?.[1]);
            let userPerms = getPerms(resp?.ok?.[1]?.role);
            const newReward = await actor.getRewardPercentage();

            setUserAuth({
              name: resp?.ok?.[1]?.name,
              role: resp?.ok?.[1]?.role,
              email: resp?.ok?.[1]?.email,
              userPerms,
              rewardPercentage: newReward ? Number(newReward) : 0,
              balance,
            });
          }
          logger(resp, 'created user');
        }

        setAuth({
          ...auth,
          state: 'initialized',
          actor,
          client: client ?? auth.client,
          isLoading: false,
          identity: myIdentity,
          agent,
        });

        return actor;
      } catch (e) {
        setAuth({ ...auth, state: 'error' });
        setUserAuth({
          name: '',
          role: '',
          userPerms: null,
          rewardPercentage: 0,
          email: '',
          balance: 0,
        });
        logger(e, 'Error while authenticating');
        throw new Error('encountered an error while authenticating');
      }
    },
    [getPerms, setAuth, setUserAuth, auth],
  );

  // useEffect(() => {
  //   initAuth();
  // }, [initAuth]);

  return {
    auth,
    userAuth,
    initAuth,
    login,
    logout,
    authenticate,
    updateBalance,
  };
};

export default useAuth;
