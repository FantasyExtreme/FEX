import { MATCH_STATUS_TYPE } from '@/types/fantasy';
import { E8S } from './fantasticonst';
import oldFEXIcon from '@/assets/images/icons/coin-icon.png';
import newFEXIcon from '@/assets/images/icons/fex-icon.png';
import icpIcon from '@/assets/images/icons/tether-icon.png';
import ckbtcIcon from '@/assets/images/icons/ckbtc-icon.png';

export enum EnvironmentEnum {
  dev = 'local',
  prod = 'ic',
  stagging = 'stagging',
}
export enum MatchStatuses {
  upcoming = '0',
  ongoing = '1',
  finished = '2',
}
export enum MatchStatusNames {
  finished = 'Match Finished',
  upcoming = 'Not Started',
  ongoing = 'Ongoing',
  postpond = 'Match Postponed',
}
export enum PlayerPositions {
  goalKeeper = 'goalKeeper',
  defender = 'defender',
  midfielder = 'midfielder',
  forward = 'forward',
}
export enum PlayerStatuses {
  playing = 'playing',
  substitute = 'substitute',
  notPlaying = 'not-playing',
  waiting = 'waiting',
}
export enum DefaultContestTypes {
  gold = 'Gold',
  bronze = 'Bronze',
  free = 'Free',
}
export enum Packages {
  gold = 'gold',
  bronze = 'bronze',
  free = 'free',
}
export enum PlayerStatusText {
  playing = 'Playing',
  substitute = 'Substitute',
  notPlaying = 'Not Playing',
}
export enum QueryParamType {
  simple = '0',
  grouped = '1',
}
export enum ContestInfoType {
  rules = '0',
  rewardDistribution = '1',
}
export const MatchStatusKeyValue = [
  { key: '3', value: 'All' },
  { key: '0', value: 'Upcoming' },
  { key: '1', value: 'In Progress' },
  { key: '2', value: 'Completed' },
];
export const PositionText: {
  [role: string]: string;
} = {
  goalKeeper: 'Goalkeeper',
  defender: 'Defender',
  midfielder: 'Midfielder',
  forward: 'Forward',
};

export const PlayersMaxCount = {
  goalKeeper: 2,
  defender: 5,
  midfielder: 5,
  forward: 3,
};
export const DEFAULT_MATCH_STATUS: MATCH_STATUS_TYPE = MatchStatuses.upcoming;
export const MATCHES_ITEMSPERPAGE = 10;
export const REWARDS_PER_PAGE = 10;
export const COMMUNITIES_PER_PAGE = 10;
export const COMMUNITYCONTEST_PER_PAGE = 10;

export const MATCHES_ITEMS_LIMIT = 1;
export const TRANSACTIONS_ITEMSPERPAGE = 10;
export const MAX_JOINED_CONTESTS_LIMIT = 6;

export const TOP_FANTASY_PLAYERS_ITEMSPERPAGE = 4;
export const TOP_FANTASY_PLAYERS_PAGE_ITEMSPERPAGE = 10;

export enum QURIES {
  matchTab = 'match_tab',
  squadId = 'squadId',
  matchId = 'matchId',
  tournamentId = 'tournament',
  contestId = 'contestId',
  refferalId = 'refferalId',
  communityId = 'communityId',
}
export const JoinContestText = {
  upcoming: 'Join',
  ongoing: 'Match Live',
  finished: 'Match Finished',
  participated: 'Joined',
};
export const DefaultContest = {
  name: 'FX League',
  slots: 200,
  entryFee: E8S * 100,
  teamsPerUser: 3,
  rewardDistribution: [
    { from: 1, to: 1, amount: 50 },
    { from: 2, to: 2, amount: 20 },
    { from: 3, to: 3, amount: 10 },
    { from: 4, to: 20, amount: 30 },
  ],
  paymentMethod: '0',
  minCap: 1,
  maxCap: 0,
  providerId: '0',
  isDistributed: false,
  rules: `Teams Per User = ${3},
          Entry Fee = ${100}
`,
};
export const DefaultTeam = {
  matchId: null,
  cap: '',
  viceCap: '',
  players: null,
  formation: '3-4-3',
};
export const DEAFULT_PROPS = { status: '0', page: 0, limit: 10, search: '' };
export const Intervals = {
  contest: 20000,
  ranking: 20000,
};
export const DefaultContestType = DefaultContestTypes.gold;
export const DefaultContestParticipants = 1000;
export const carouselDefaultSettings = {
  additionalTransfrom: 0,
  arrows: true,
  autoPlay: true,
  autoPlaySpeed: 5000,
  centerMode: false,
  className: '',
  containerClass: 'container-with-dots',
  dotListClass: '',
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  itemClass: '',
  keyBoardControl: true,
  minimumTouchDrag: 80,
  pauseOnHover: true,
  renderArrowsWhenDisabled: false,
  renderButtonGroupOutside: false,
  renderDotsOutside: false,
  responsive: {
    greater: {
      breakpoint: {
        max: 3000,
        min: 1400,
      },

      items: 4,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: {
        max: 1400,
        min: 991,
      },

      items: 3,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 991,
        min: 464,
      },
      items: 2,
      slidesToSlide: 2,
      partialVisibilityGutter: 30,
    },
  },
  rewind: false,
  rewindWithAnimation: false,
  rtl: false,
  shouldResetAutoplay: true,
  showDots: false,
  sliderClass: '',
  slidesToSlide: 2,
  swipeable: true,
};
export enum NFtsTypes {
  bronze = 'bronze',
  silver = 'silver',
  gold = 'gold',
  platinum = 'platinum',
}
export const PaymentTypes = {
  ICP: '0',
  CKBTC: '1',
};
export const PaymentsArray = [
  {
    id: PaymentTypes.ICP,
    name: 'ICP',
    fexIcon: newFEXIcon,
    tetherIcon: icpIcon,
  },
  {
    id: PaymentTypes.CKBTC,
    name: 'CKBTC',
    fexIcon: newFEXIcon,
    tetherIcon: ckbtcIcon,
  },
];
export const ContestPayment = new Map(PaymentsArray.map((p) => [p.id, p]));
