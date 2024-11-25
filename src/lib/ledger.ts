import {
  makeCKBTCLedgerCanister,
  makeICPLedgerCanister,
  makeLedgerCanister,
} from '@/dfx/service/actor-locator';
import { Identity } from '@dfinity/agent';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { toast } from 'react-toastify';
import logger from './logger';
import {
  CKBTC_DECIMALS_FE,
  E8S,
  ICP_DECIMALS_FE,
} from '@/constant/fantasticonst';
import { canisterId as fantasyCanisterId } from '@/dfx/declarations/fantasyfootball';
import { Principal } from '@dfinity/principal';

/**
 * Function to retrieve the balance of the account associated with the provided identity.
 *
 * @param identity - The identity for which the balance is being retrieved.
 * @return The balance of the account in ICP.
 */
export async function getBalance(identity: Identity) {
  let ledgerActor = await makeLedgerCanister({
    agentOptions: {
      identity: identity,
    },
  });
  let acc: any = AccountIdentifier.fromPrincipal({
    principal: identity.getPrincipal(),
    // subAccount: identity.getPrincipal(),
  });

  let res = await ledgerActor.account_balance({
    account: acc.bytes,
  });

  let balance = parseInt(res.e8s) / E8S;
  logger(balance, 'blance');
  return balance;
}

/**
 * Function to retrieve the balance of the account associated with the provided identity for CKBTC.
 *
 * @param identity - The identity for which the balance is being retrieved.
 * @return The balance of the account in ICP.
 */
export async function getCKBTCBalance(identity: Identity) {
  try {
    let ledgerActor = makeCKBTCLedgerCanister({
      agentOptions: {
        identity: identity,
      },
    });
    let acc: any = AccountIdentifier.fromPrincipal({
      principal: identity.getPrincipal(),
      // subAccount: identity.getPrincipal(),
    });
    let res = await ledgerActor.balance({
      owner: identity.getPrincipal(),
      certified: false,
    });
    let balance = fromE8S(res, true);
    return balance;
  } catch (error) {
    logger(error, 'ckbtc balance error');
    return 0;
  }
}

/**
 * Approves tokens for a specific amount and identity.
 *
 * @param amount The amount of tokens to approve.
 * @param identity The identity for which the tokens are being approved.
 * @return true if approval is successful, false otherwise.
 */
export async function approveTokens(amount: number, identity: Identity) {
  let ledgerActor = await makeLedgerCanister({
    agentOptions: {
      identity: identity,
    },
  });
  if (!fantasyCanisterId) {
    logger('no canister id');
    return false;
  }
  let fantasyPrincipal = Principal.fromText(fantasyCanisterId);
  let approval = await ledgerActor.icrc2_approve({
    amount: amount,
    spender: {
      owner: fantasyPrincipal,
      subaccount: [],
    },
    fee: [],
    memo: [],
    from_subaccount: [],
    created_at_time: [],
    expected_allowance: [],
    expires_at: [],
  });
  logger(approval);
  if (approval.Ok) {
    // toast.success('Approved Successfully');
    return true;
    // return true;
  } else {
    logger(approval, 'errrr in approveal');
    return false;
    // toast.warning('Error');
  }
}

/**
 * Approves tokens for a specific amount and identity.
 *
 * @param amount The amount of tokens to approve.
 * @param identity The identity for which the tokens are being approved.
 * @return true if approval is successful, false otherwise.
 */
export async function approveCKBTCTokens(amount: number, identity: Identity) {
  let ledgerActor = makeCKBTCLedgerCanister({
    agentOptions: {
      identity: identity,
    },
  });
  if (!fantasyCanisterId) {
    logger('no canister id');
    return false;
  }
  let fantasyPrincipal = Principal.fromText(fantasyCanisterId);
  try {
    let approval = await ledgerActor.approve({
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
}
/**
 * Converts a value from E8S to ICP.
 *
 * @param e8s - The value in E8S to convert.
 * @return The converted value in the ICP.
 */
export function fromE8S(
  e8s: bigint | number | undefined | null,
  isFE?: boolean,
): number {
  if (isFE)
    return Number((e8s ? Number(e8s) / E8S : 0).toFixed(ICP_DECIMALS_FE));
  return e8s ? Number(e8s) / E8S : 0;
}

/**
 * Converts a value from E8S to ICP.
 *
 * @param e8s - The value in E8S to convert.
 * @return The converted value in the ICP.
 */
export function fromCKE8S(
  e8s: bigint | number | undefined | null,
  isFE?: boolean,
): number {
  if (isFE)
    return Number((e8s ? Number(e8s) / E8S : 0).toFixed(CKBTC_DECIMALS_FE));
  return e8s ? Number(e8s) / E8S : 0;
}

/**
 * Converts a value from ICP to E8S .
 *
 * @param icp - The value in ICP to convert.
 * @return The converted value in the E8S.
 */
export function toE8S(icp: number) {
  return Math.ceil(icp * E8S);
}
