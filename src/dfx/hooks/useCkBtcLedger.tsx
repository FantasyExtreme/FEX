import { IcrcLedgerCanister, IcrcTokenMetadataResponse } from '@dfinity/ledger';
import { useCallback, useEffect, useState } from 'react';

import { Principal } from '@dfinity/principal';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import logger from '@/lib/logger';
import { isConnected } from '@/components/utils/fantasy';
import { canisterId as fantasyCanisterId } from '@/dfx/declarations/fantasyfootball';
import { fromCKE8S, fromE8S } from '@/lib/ledger';
import { usePathname } from 'next/navigation';

export default function useCkBtcLedger() {
  const { auth, userAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));
  const path = usePathname();
  const [ledgerCanister, setLedgerCanister] = useState<
    IcrcLedgerCanister | undefined
  >();
  const [metadata, setMetadata] = useState<IcrcTokenMetadataResponse>();
  // const [balance, setBalance] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  /**
   * mthod to get balance of user
   *
   */
  const getBalance = useCallback(async () => {
    if (!ledgerCanister || !auth.identity) {
      logger('ckbtc getBalance returned because of no ledger or identity');
      return null;
    }
    try {
      let res = await ledgerCanister.balance({
        owner: auth.identity.getPrincipal(),
        certified: false,
      });
      logger(res, 'my log of balance ckbtc');
      const newBalance = fromCKE8S(res, true);
      setUserAuth({ ...userAuth, ckBalance: newBalance });
      // setBalance(newBalance);
      setLastUpdateTime(Date.now());
      return newBalance;
    } catch (error) {
      logger(error, 'Error fetching balance');
      return null;
    }
  }, [ledgerCanister, auth.identity]);
  /**
   * method to approve canister to user's balance in ckbtc
   * @param amount number of tokens in e8s to be approved
   */
  const approve = useCallback(
    async (amount: number) => {
      if (!fantasyCanisterId || !ledgerCanister) {
        logger('no canister id or ledger canister');
        return false;
      }
      let fantasyPrincipal = Principal.fromText(fantasyCanisterId);
      try {
        let approval = await ledgerCanister.approve({
          amount: BigInt(amount),
          spender: {
            owner: fantasyPrincipal,
            subaccount: [],
          },
        });
        logger(Number(approval), 'approved ckbtc');
        return true;
      } catch (error) {
        logger(error, 'errrr in ckbtc approveal');
        return false;
      }
    },
    [ledgerCanister, fantasyCanisterId],
  );
  /**
   * transfer ckbtc form user's account to destination account
   * @param amount number of tokens in e8s to be transfered
   * @param destination address of the destination wallet
   */
  const transfer = useCallback(
    async (amount: number, destination: string) => {
      if (!fantasyCanisterId || !ledgerCanister) {
        logger('no canister id or ledger canister');
        return false;
      }
      try {
        let sendingAmount = BigInt(Math.ceil(amount));
        logger(sendingAmount, 'transferring this');
        let transferedAt = await ledgerCanister.transfer({
          amount: sendingAmount,
          to: {
            owner: Principal.fromText(destination),
            subaccount: [],
          },
        });
        logger(Number(transferedAt), 'transferred ckbtc');

        // Wait for a short time before fetching the new balance
        // await new Promise(resolve => setTimeout(resolve, 1000));

        const newBalance = await getBalance();
        logger(newBalance, 'new balance after transfer');

        return true;
      } catch (error) {
        logger(error, 'errrr in ckbtc transfer');
        return false;
      }
    },
    [ledgerCanister, fantasyCanisterId, getBalance],
  );

  const init = useCallback(async () => {
    if (isInitialized) return;
    logger(auth.agent, 'ckbtc initing',);
    logger(process.env.NEXT_PUBLIC_CANISTER_ID_CKBTC_LEDGER, 'ckck')
    try {
      const ledgerCanister = IcrcLedgerCanister.create({
        agent: auth.agent,
        canisterId: Principal.fromText(process.env.NEXT_PUBLIC_CANISTER_ID_CKBTC_LEDGER!),
      });
      logger(ledgerCanister, 'ckbtc');
      setLedgerCanister(ledgerCanister);
      await getBalance();
      setIsInitialized(true);
    } catch (error) {
      logger(error, 'ckbtc error');
    }
  }, [auth, getBalance, isInitialized]);

  useEffect(() => {
    if (auth.isLoading || !isConnected(auth.state)) return;
    init();
  }, [auth]);

  useEffect(() => {
    if (isInitialized) {
      getBalance();
    }
  }, [path, isInitialized]);

  return {
    ledgerCanister,
    metadata,
    approve,
    transfer,
    getBalance,
    lastUpdateTime,
  };
}
