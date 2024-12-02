import { RefinedPlayerSquad } from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';

type Key = string;
type RPoints = Number;
interface RawPlayer {
  country: string;
  fantasyPrice: bigint;
  name: string;
  position: { [key: string]: null };
  positionString: 'goalKeeper' | 'midfielder' | 'forward' | 'defender';
  teamId: Key;
}
interface Player {
  country: string;
  id: Key;
  fantasyPrice: number;
  name: string;
  position: { [key: string]: null };
  positionString: 'goalKeeper' | 'midfielder' | 'forward' | 'defender';
  teamId: Key;
  points: number;
  isPlaying: boolean;
  isSub: boolean;
  teamName: string;
  number: number;
  photo: string;
}

interface GroupedPlayers {
  [role: string]: Player[];
}

interface PlayerWithPosition {
  player: Player;
  // position: string;
}

interface Team {
  name: string;
  logo: string;
  shortName: string;
  tournamentId: string;
  id: string;
}
interface PlayerS {
  providerId: string;
  name: string;
  country: string;
  position: any;
  teamId: string;
  fantasyPrice: number;
  points: [RPoints];
  isPlaying: boolean;
  isSub: boolean;
}
interface PlayerSquad {
  id: string;
  userId: string;
  name: string;
  matchId: string;
  cap: string;
  viceCap: string;
  points: number;
  formation: string;
  creation_time: number;
  rank: number;
  matchTime?: number;
  hasParticipated?: boolean;
  joinedContestsName?: string;
}
interface GroupedPlayer {
  matchName: string;
  rank: number;
  // the rest extends from PlayerSquad
  id: string;
  userId: string;
  name: string;
  matchId: string;
  cap: string;
  viceCap: string;
  points: number;
  formation: string;
  creation_time: number;
}
interface TopPlayers {
  userId: string;
  name: string;
  image: string;
  participated: number;
  contestWon: number;
  rewardsWon: number;
  totalEarning: number;
}
interface MeAsTopPlayers {
  userId: string;
  name: string;
  image: string;
  participated: number;
  contestWon: number;
  rewardsWon: number;
  totalEarning: number;
  rank: number;
}
type GroupedSquad = [string, GroupedPlayer[]];
type TournamentType = [string, Tournament][];
interface Match {
  homeTeam: Team;
  awayTeam: Team;
  location: string;
  time: string;
  date: string;
  id: string;
  tournamentId: string;
  status: string;
  tournamentName: string;
  homeScore: number;
  awayScore: number;
  matchTime?: number;
  status?: string;
  isPostpond?: boolean;
  isRewardable:boolean;
}
interface matchWithGroupedId extends Match {
  groupId: string;
}
interface DetailedMatchContest extends Contest, Match {
  teamsCreated: number;
  teamsJoined: number;
  latest: boolean;
}
interface Tournament {
  providerId: string;
  country: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
}
interface Formation {
  [goalKeeper: string]: number;
  [defender: string]: number;
  [midfielder: string]: number;
  [forward: string]: number;
}

interface RewardDistribution {
  from: BigInt;
  to: BigInt;
  amount: BigInt;
}
interface RfRewardDistribution {
  from: number;
  to: number;
  amount: number;
  percentage: number;
}
interface Contest {
  name: string;
  matchId: Key;
  entryFee: number;
  creatorUserId: string;
  rewardDistribution: RfRewardDistribution[];
  id: Key;
  slots: number;
  slotsUsed: number;
  slotsLeft: number;
  prizePool: number;
  firstPrize: number;
  rewardableUserPercentage: number;
  minCap: number;
  teamsPerUser: number;
  isDistributed?: boolean;
  rules: string;
  paymentMethod?: string;
  firstPrize?: number;
}
interface GroupedContest {
  contests: any;
  matchName: string;
  homeScore: number;
  awayScore: number;
  awayTeamName: string;
  homeTeamName: string;
  // the rest extends from Contest
  name: string;
  matchId: Key;
  entryFee: number;
  creatorUserId: string;
  rewardDistribution: RfRewardDistribution;
  id: Key;
  slots: number;
  slotsUsed: number;
  slotsLeft: number;
  prizePool: number;
  firstPrize: number;
  rewardableUserPercentage: number;
  minCap: number;
  teamsPerUser: number;
}
type GroupedContests = [string, GroupedContest[]];

interface SquadRanking {
  userId: Key;
  name: string;
  matchId: Key;
  points: BigInt;
  creation_time: BigInt;
}
interface RFSquadRanking extends SquadRanking {
  id: string;
  points: number;
  creation_time: number;
  rank: number;
  mine: boolean;
}
interface RfRefinedPlayerSquad extends RefinedPlayerSquad {
  points: number;
  creation_time: number;
  players: Player[];
}
interface GetProps {
  page: number;
  limit: number;
  search: string;
  status: string | null;
}
interface MatchesType {
  upcoming: null | [string, Match][];
  ongoing: null | [string, Match][];
  finished: null | [string, Match][];
}
interface MvpsPlayer {
  name: string;
  userId: string;
  email: string;
  number: number;
  photo: string;
}
interface WinnerUser {
  name: string;
  photo: string;
  userId: string;
  email: string;
}
interface WinnersAndMvps {
  mvps: MvpsPlayer;
  contestWinner: WinnerUser;
  match: Match;
}

interface TeamsType {
  upcoming: null | [string, GroupedPlayer[]][];
  ongoing: null | [string, GroupedPlayer[]][];
  finished: null | [string, GroupedPlayer[]][];
}
interface ContestType {
  upcoming: null | [string, GroupedContest[]][];
  ongoing: null | [string, GroupedContest[]][];
  finished: null | [string, GroupedContest[]][];
}
interface MatchesCountType {
  upcoming: number;
  ongoing: number;
  finished: number;
}
type MATCH_STATUS_TYPE = '0' | '1' | '2';
interface LoadingState {
  upcoming: boolean;
  ongoing: boolean;
  finished: boolean;
}
type TogglePlayerSelection = (
  player: Player,
  skipFilteer: boolean,
  isInitail: boolean,
) => void;

interface SelectSquadProps {
  iSquadId: string;
  iMatchId: string;
}
interface Shots {
  shots_total: number;
  shots_on_goal: number;
}

interface Goals {
  scored: number;
  assists: number;
  conceded: number;
  owngoals: number;
  team_conceded: number;
}

interface Fouls {
  drawn: number;
  committed: number;
}

interface Cards {
  yellowcards: number;
  redcards: number;
  yellowredcards: number;
}

interface Passing {
  total_crosses: number;
  crosses_accuracy: number;
  passes: number;
  accurate_passes: number;
  passes_accuracy: number;
  key_passes: number;
}

interface Dribbles {
  attempts: number;
  success: number;
  dribbled_past: number;
}

interface Duels {
  total: number;
  won: number;
}

interface Other {
  aerials_won: number;
  punches: number;
  offsides: number;
  saves: number;
  inside_box_saves: number;
  pen_scored: number;
  pen_missed: number;
  pen_saved: number;
  pen_committed: number;
  pen_won: number;
  hit_woodwork: number;
  tackles: number;
  blocks: number;
  interceptions: number;
  clearances: number;
  dispossesed: number;
  minutes_played: number;
}

interface PlayerStats {
  playerId: Key;
  matchId: Key;
  stats: {
    shots: Shots;
    goals: Goals;
    fouls: Fouls;
    cards: Cards;
    passing: Passing;
    dribbles: Dribbles;
    duels: Duels;
    other: Other;
  };
  rating: string;
}

interface Stats {
  shots: Shots;
  goals: Goals;
  fouls: Fouls;
  cards: Cards;
  passing: Passing;
  dribbles: Dribbles;
  duels: Duels;
  other: Other;
}
type LoginType = 0 | 1;
interface CommunityContest {
  communityId: string;
  name: string;
  contestId: string;
  usersJoinedThisContest:number ;
  joined_at:number ;
}
interface CommunityContestPagination {
  total:number ;
  offset:number ;
}