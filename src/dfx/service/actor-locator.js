import {
  createActor as createIcpLedgerCanister,
  canisterId as icpLedgerCanisterCanisterId,
} from '@/dfx/declarations/icp_ledger_canister';
import {
  createActor as createFantasyFootballCanister,
  canisterId as fantasyFootballCanisterId,
} from '../declarations/fantasyfootball';
import {
  createActor as createFantasyTransactionsCanister,
  canisterId as fantasyTransactionsCanisterId,
} from '../declarations/fantasytransactions';
import {
  createActor as createCKBTCKLedger,
  canisterId as ckBTCLedgerCanisterId,
} from '../declarations/ckbtc_ledger';
import { IcrcLedgerCanister } from '@dfinity/ledger';
export const makeActor = (canisterId, createActor, options) => {
  const HostCanisterId =
    process.env.CANISTER_ID_FANTASYSPORTS ||
    process.env.NEXT_PUBLIC_FANTASYSPORTS_CANISTER_ID;
  const hostOptions = {
    // host: `https://${HostCanisterId}.ic0.app`,
    host:
      process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
        ? `https://${HostCanisterId}.ic0.app`
        : 'http://localhost:4943',
  };
  if (!options) {
    options = {
      agentOptions: hostOptions,
    };
  } else if (!options.agentOptions) {
    options.agentOptions = hostOptions;
  } else {
    options.agentOptions.host = hostOptions.host;
  }
  return createActor(canisterId, options);
};

// export function makeEntryActor(options) {
//   return makeActor(entryCanisterId, createEntryActor, options);
// }

export function makeFantasyFootballActor(options) {
  return makeActor(
    fantasyFootballCanisterId,
    createFantasyFootballCanister,
    options,
  );
}
export function makeFantasyTransactionsActor(options) {
  return makeActor(
    fantasyTransactionsCanisterId,
    createFantasyTransactionsCanister,
    options,
  );
}
export function makeLedgerCanister(options) {
  return makeActor(
    icpLedgerCanisterCanisterId,
    createIcpLedgerCanister,
    options,
  );
}
export function makeICPLedgerCanister(options) {
  return makeActor(
    process.env.NEXT_PUBLIC_ICP_LEDGER_CANISTER_ID,
    createIcpLedgerCanister,
    options,
  );
}

/**
 * Creates a CKBTCLedgerCanister actor.
 *
 * @param {Object} options - The options for creating the actor.
 * @return {IcrcLedgerCanister} The created CKBTCLedgerCanister actor.
 */
export function makeCKBTCLedgerCanister(options) {
  return makeActor(ckBTCLedgerCanisterId, createCKBTCKLedger, options);
}
