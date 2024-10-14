export const FORMATIONS_AND_SUBSTITUTION = [
  {
    formation: { goalKeeper: 1, defender: 3, midfielder: 4, forward: 3 },
    substitution: {
      goalKeeper: 1,
      defender: 2,
      midfielder: 1,
      forward: 0,
    },
  },
  {
    formation: { goalKeeper: 1, defender: 3, midfielder: 5, forward: 2 },
    substitution: {
      goalKeeper: 1,
      defender: 2,
      midfielder: 0,
      forward: 1,
    },
  },
  {
    formation: { goalKeeper: 1, defender: 4, midfielder: 3, forward: 3 },
    substitution: {
      goalKeeper: 1,
      defender: 1,
      midfielder: 2,
      forward: 0,
    },
  },
  {
    formation: { goalKeeper: 1, defender: 4, midfielder: 4, forward: 2 },
    substitution: {
      goalKeeper: 1,
      defender: 1,
      midfielder: 1,
      forward: 1,
    },
  },
  {
    formation: { goalKeeper: 1, defender: 4, midfielder: 5, forward: 1 },
    substitution: {
      goalKeeper: 1,
      defender: 1,
      midfielder: 0,
      forward: 2,
    },
  },
  {
    formation: { goalKeeper: 1, defender: 5, midfielder: 2, forward: 3 },
    substitution: {
      goalKeeper: 1,
      defender: 0,
      midfielder: 3,
      forward: 0,
    },
  },
  {
    formation: { goalKeeper: 1, defender: 5, midfielder: 3, forward: 2 },
    substitution: {
      goalKeeper: 1,
      defender: 0,
      midfielder: 2,
      forward: 1,
    },
  },
  {
    formation: { goalKeeper: 1, defender: 5, midfielder: 4, forward: 1 },
    substitution: {
      goalKeeper: 1,
      defender: 0,
      midfielder: 1,
      forward: 2,
    },
  },
];

export const initialPlayers = {
  goalKeeper: [],
  defender: [],
  midfielder: [],
  forward: [],
  all: [],
};
export const MAX_PLAYERS = 15;
export const MATCHES_ICON_SIZES = { width: 32, height: 32 };
export const MATCHES_SLIDER_SIZES = { width: 100, height: 100 };
export const MATCHES_RESULT_SIZES = { width: 63, height: 71 };
export const E8S = 100_000_000;
export const GAS_FEE = 10_000;
export const GAS_FEE_ICP = GAS_FEE / E8S;
export const CKBTC_GAS_FEE = 10;
export const CKBTC_GAS_FEE_INTEGER = CKBTC_GAS_FEE / E8S;

export const MATCHES_CLUB_ICON_SIZES = { width: 110, height: 125 };
export enum Positions {
  goalKeeper = 'goalKeeper',
  defender = 'defender',
  midfielder = 'midfielder',
  forward = 'forward',
}
export const appData = {
  name: 'Fantsy Extreme',
  logo: 'https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/logo/logo.png',
  url: 'https://alpha.fantasyextreme.org',
};

export enum LoginEnum {
  InternetIdentity = 0,
  NFID = 1,
}
export enum Directions {
  up = 'up',
  down = 'down',
}
export const ICP_DECIMALS_FE = 3;
export const CKBTC_DECIMALS_FE = 8;
export const START_DATE = 1726358400000;
export const END_DATE = 1728950400000;
