const path = require('path');

const network =
  process.env.DFX_NETWORK ||
  (process.env.NODE_ENV === 'production' ? 'ic' : 'local');
function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(
      path.resolve('.dfx', 'local', 'canister_ids.json'),
    );
  } catch (error) {
    if (network == 'local') return [];
    console.log('No local canister_ids.json found. Continuing production');
  }
  try {
    prodCanisters = require(path.resolve('canister_ids.json'));
  } catch (error) {
    console.log('No production canister_ids.json found. Continuing with local');
  }

  const canisterConfig = network === 'local' ? localCanisters : prodCanisters;

  return Object?.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev['CANISTER_ID_' + canisterName.toUpperCase()] =
      canisterDetails[network];
    return prev;
  }, {});
}
const canisterEnvVariables = initCanisterEnv();
const isDevelopment = process.env.NODE_ENV !== 'production';

const internetIdentityUrl =
  network === 'local'
    ? `http://${canisterEnvVariables['INTERNET_IDENTITY_CANISTER_ID']}.localhost:4943/`
    : `https://identity.ic0.app`;
console.log(network, 'prodd', isDevelopment);

const frontendDirectory = __dirname;

const frontend_entry = path.join('src', frontendDirectory, 'src', 'index.html');
module.exports = {
  canisterEnvVariables,
  network,
  frontendDirectory,
  frontend_entry,
  internetIdentityUrl,
  isDevelopment,
};
