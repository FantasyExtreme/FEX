const { Secp256k1KeyIdentity } = require("@dfinity/identity-secp256k1");

const { ICManagementCanister } = require("@dfinity/ic-management");
const { createAgent } = require("@dfinity/utils");
const { Principal } = require("@dfinity/principal");
const fs = require("fs");
/**
 * Converts an object to a JSON string, with bigint values converted to strings.
 *
 * @param {Object} obj - The object to be converted.
 * @return {string} The JSON string representation of the object, with bigint values converted to strings.
 */
function toObject(obj) {
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}
/**
 * Formats a number into a human-readable string with appropriate suffixes.
 *
 * @param {number} value - The number to format.
 * @return {string} The formatted number with appropriate suffixes.
 */
function formatNumber(value) {
  value = Number(value);
  if (value >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(2) + "T";
  } else if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + "B";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + "K";
  } else {
    return value.toString();
  }
}

/**
 * Formats a given value into a human-readable string representing bytes.
 *
 * @param {number|string} value - The value to format.
 * @return {string} The formatted string with appropriate unit (bytes, KB, MB).
 */
function formatBytes(value) {
  value = Number(value);
  const bytes = parseInt(value, 10);
  if (bytes >= 1_000_000) {
    return (bytes / 1_000_000).toFixed(2) + " MB";
  } else if (bytes >= 1_000) {
    return (bytes / 1_000).toFixed(2) + " KB";
  } else {
    return bytes + " bytes";
  }
}

/**
 * Retrieves the status of a canister on the Internet Computer (IC) network.
 *
 * This function uses the provided identity key seed to create an agent,
 * which is then used to query the canister status. The response is
 * formatted with human-readable values for certain fields and written
 * to a JSON file.
 *
 * @return {void}
 */
async function getCanisterStatus() {
  try {
    // const seed = Buffer.from(process.env.IDENTITY_KEY_SEED, "utf8");
    const identity = Secp256k1KeyIdentity.fromSeedPhrase( process.env.SEED_PRASE );

    const agent = await createAgent({
      identity,
      host: "https://ic0.app",
    });

    const { canisterStatus } = ICManagementCanister.create({
      agent,
    });

    const resp = await canisterStatus(
      Principal.fromText('w2utv-nyaaa-aaaam-ac7iq-cai')
    );
    resp.query_stats.response_payload_bytes_total = formatBytes(
      resp.query_stats.response_payload_bytes_total
    );
    resp.query_stats.request_payload_bytes_total = formatBytes(
      resp.query_stats.request_payload_bytes_total
    );
    resp.query_stats.num_instructions_total = formatNumber(
      resp.query_stats.num_instructions_total
    );
    resp.query_stats.num_calls_total = formatNumber(
      resp.query_stats.num_calls_total
    );
    resp.memory_size = formatBytes(resp.memory_size);
    resp.cycles = formatNumber(resp.cycles);
    resp.idle_cycles_burned_per_day = formatNumber(
      resp.idle_cycles_burned_per_day
    );

    const respJSON = toObject(resp);
    fs.writeFileSync("canister-status.json", respJSON);
  } catch (error) {
    console.error("Error in getCanisterStatus:", error);
  }
}
getCanisterStatus()
module.exports = getCanisterStatus;
