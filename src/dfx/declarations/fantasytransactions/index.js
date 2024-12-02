import { Actor, HttpAgent } from '@dfinity/agent';

// Imports and re-exports candid interface
import { idlFactory } from './fantasytransactions.did.js';
export { idlFactory } from './fantasytransactions.did.js';

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */

const alphaCanisterId = process.env.CANISTER_ID_FANTASYTRANSACTIONS_PD;
const stagginCanisterId = process.env.CANISTER_ID_FANTASYTRANSACTIONS;
const demoCanisterId = process.env.CANISTER_ID_FANTASYTRANSACTIONS_DM;
let tempCanisterId = stagginCanisterId;
if (process.env.NEXT_PUBLIC_ENVIRONMENT_TYPE == 'alpha') {
  tempCanisterId = alphaCanisterId;
} else if (process.env.NEXT_PUBLIC_ENVIRONMENT_TYPE == 'stagging') {
  tempCanisterId = stagginCanisterId;
} else if (process.env.NEXT_PUBLIC_ENVIRONMENT_TYPE == 'demo') {
  tempCanisterId = demoCanisterId;
}
export const canisterId = tempCanisterId;
// export const canisterId =
//   process.env.CANISTER_ID_FANTASYTRANSACTIONS || 'b77ix-eeaaa-aaaaa-qaada-cai';

export const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      'Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.',
    );
  }

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        'Unable to fetch root key. Check to ensure that your local replica is running',
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const fantasytransactions = canisterId
  ? createActor(canisterId)
  : undefined;
