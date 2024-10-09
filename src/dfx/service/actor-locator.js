
import {
  createActor as createFantasyFootballCanister,
  canisterId as fantasyFootballCanisterId,
} from '../declarations/fantasyfootball';
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
