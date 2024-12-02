const { createActor: createFantasyFootballCanister, canisterId: fantasyFootballCanisterId } = require('../declarations/fantasyfootball');

const makeActor = (canisterId, createActor, options) => {
  const HostCanisterId =
    process.env.CANISTER_ID_FANTASYSPORTS ||
    process.env.NEXT_PUBLIC_FANTASYSPORTS_CANISTER_ID;
  const hostOptions = {
    host:
      process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
        ? `https://${HostCanisterId}.ic0.app`
        : 'http://localhost:4943',
  };
  console.log("hiiiissss", canisterId, hostOptions)
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

function makeFantasyFootballActor(options) {
  return makeActor(
    fantasyFootballCanisterId,
    createFantasyFootballCanister,
    options
  );
}

module.exports = {
  makeActor,
  makeFantasyFootballActor
};