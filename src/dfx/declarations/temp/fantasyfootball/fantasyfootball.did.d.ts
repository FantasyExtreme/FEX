import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AdminSetting {
  'last_modified_by' : Key__1,
  'settingValue' : string,
  'modification_date' : bigint,
  'settingName' : string,
  'settingType' : string,
  'creation_date' : bigint,
}
export interface AdminSetting__1 {
  'last_modified_by' : Key__1,
  'settingValue' : string,
  'modification_date' : bigint,
  'settingName' : string,
  'settingType' : string,
  'creation_date' : bigint,
}
export type AdminSettings = Array<[Key__1, AdminSetting]>;
export interface Cards {
  'redcards' : bigint,
  'yellowredcards' : bigint,
  'yellowcards' : bigint,
}
export interface Contest {
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key__1,
  'winner' : [] | [Key__1],
  'minCap' : bigint,
  'slots' : bigint,
  'matchId' : Key__1,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export type ContestArray = Array<DetailedContest>;
export interface Contest__1 {
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key__1,
  'winner' : [] | [Key__1],
  'minCap' : bigint,
  'slots' : bigint,
  'matchId' : Key__1,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export type Contests = Array<[Key__1, Contest__1]>;
export interface DetailedContest {
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key__1,
  'winner' : [] | [Key__1],
  'minCap' : bigint,
  'slots' : bigint,
  'teamsCreatedOnContest' : bigint,
  'matchId' : Key__1,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
  'teamsJoinedContest' : bigint,
}
export interface DetailedMatchContest {
  'id' : Key__1,
  'status' : MatchStatus__1,
  'contests' : ContestArray,
  'homeTeam' : Key__1,
  'time' : bigint,
  'latest' : boolean,
  'seasonId' : Key__1,
  'homeScore' : bigint,
  'awayTeam' : Key__1,
  'awayScore' : bigint,
  'providerId' : Key__1,
  'teamsCreated' : bigint,
  'location' : string,
  'teamsJoined' : bigint,
}
export type DetailedMatchContests = Array<DetailedMatchContest>;
export interface Dribbles {
  'dribbled_past' : bigint,
  'attempts' : bigint,
  'success' : bigint,
}
export interface Duels { 'won' : bigint, 'total' : bigint }
export interface Fouls { 'committed' : bigint, 'drawn' : bigint }
export interface GetProps {
  'status' : string,
  'page' : bigint,
  'search' : string,
  'limit' : bigint,
}
export interface Goals {
  'assists' : bigint,
  'scored' : bigint,
  'conceded' : bigint,
  'owngoals' : bigint,
  'team_conceded' : bigint,
}
export interface IAdminSetting {
  'settingValue' : string,
  'settingName' : string,
  'settingType' : string,
}
export interface IContest {
  'teamsPerUser' : bigint,
  'name' : string,
  'minCap' : bigint,
  'slots' : bigint,
  'matchId' : Key__1,
  'maxCap' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export interface IPlayer {
  'id' : Key__1,
  'country' : string,
  'name' : string,
  'fantasyPrice' : bigint,
  'number' : bigint,
  'photo' : string,
  'teamId' : Key__1,
  'position' : Position,
  'providerId' : MonkeyId,
}
export interface IPlayerSquad {
  'cap' : Key__1,
  'formation' : string,
  'name' : string,
  'viceCap' : Key__1,
  'matchId' : Key__1,
  'players' : Array<[Key__1, boolean]>,
}
export interface IPlayerStats {
  'playerId' : Key__1,
  'stats' : {
    'fouls' : Fouls,
    'other' : Other,
    'cards' : Cards,
    'shots' : Shots,
    'passing' : Passing,
    'dribbles' : Dribbles,
    'goals' : Goals,
    'duels' : Duels,
  },
  'matchId' : Key__1,
  'rating' : string,
}
export interface ISeason {
  'id' : Key__1,
  'endDate' : bigint,
  'tournamentId' : Key__1,
  'providerId' : MonkeyId,
  'seasonName' : string,
  'startDate' : bigint,
}
export interface ITeamWithPlayers {
  'id' : string,
  'logo' : string,
  'name' : string,
  'seasonId' : Key__1,
  'players' : Array<IPlayer>,
  'shortName' : string,
  'providerId' : MonkeyId,
}
export interface IUser { 'name' : string, 'email' : string }
export interface InputMatch {
  'id' : string,
  'status' : MatchStatus__1,
  'awayTeamName' : string,
  'time' : bigint,
  'seasonId' : Key__1,
  'homeTeamName' : string,
  'homeScore' : bigint,
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type Key = string;
export type Key__1 = string;
export interface ListPlayerSquad {
  'cap' : Key__1,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key__1,
  'hasParticipated' : boolean,
  'joinedContestsName' : Array<string>,
  'matchId' : Key__1,
  'points' : RPoints,
}
export type ListPlayerSquads = Array<[Key__1, ListPlayerSquad]>;
export interface MVPSPlayers {
  'name' : string,
  'number' : bigint,
  'photo' : string,
}
export interface MVPSPlayers__1 {
  'name' : string,
  'number' : bigint,
  'photo' : string,
}
export interface Match {
  'status' : MatchStatus__1,
  'homeTeam' : Key__1,
  'time' : bigint,
  'seasonId' : Key__1,
  'homeScore' : bigint,
  'awayTeam' : Key__1,
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export interface MatchContest {
  'teamsPerUser' : bigint,
  'name' : string,
  'awayTeamName' : string,
  'creatorUserId' : Key__1,
  'winner' : [] | [Key__1],
  'minCap' : bigint,
  'slots' : bigint,
  'matchId' : Key__1,
  'homeTeamName' : string,
  'homeScore' : bigint,
  'awayScore' : bigint,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
  'matchName' : string,
}
export type MatchContests = Array<[Key__1, MatchContest]>;
export interface MatchScore {
  'id' : Key__1,
  'status' : MatchStatus__1,
  'homeScore' : bigint,
  'awayScore' : bigint,
}
export type MatchStatus = string;
export type MatchStatus__1 = string;
export interface Match__1 {
  'status' : MatchStatus__1,
  'homeTeam' : Key__1,
  'time' : bigint,
  'seasonId' : Key__1,
  'homeScore' : bigint,
  'awayTeam' : Key__1,
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type Matches = Array<[Key__1, Match__1]>;
export interface MeAsTopPlayer {
  'name' : string,
  'rank' : bigint,
  'role' : Role,
  'assets' : UserAssets,
  'joiningDate' : bigint,
  'email' : string,
}
export type MonkeyId = string;
export interface Other {
  'inside_box_saves' : bigint,
  'pen_won' : bigint,
  'pen_saved' : bigint,
  'minutes_played' : bigint,
  'clearances' : bigint,
  'interceptions' : bigint,
  'saves' : bigint,
  'dispossesed' : bigint,
  'aerials_won' : bigint,
  'punches' : bigint,
  'pen_committed' : bigint,
  'pen_scored' : bigint,
  'offsides' : bigint,
  'blocks' : bigint,
  'pen_missed' : bigint,
  'hit_woodwork' : bigint,
  'tackles' : bigint,
}
export interface Participant {
  'contestId' : Key__1,
  'userId' : Key__1,
  'rank' : bigint,
  'squadId' : Key__1,
}
export type Participants = Array<[Key__1, Participant]>;
export interface Passing {
  'crosses_accuracy' : bigint,
  'passes_accuracy' : bigint,
  'total_crosses' : bigint,
  'accurate_passes' : bigint,
  'passes' : bigint,
  'key_passes' : bigint,
}
export interface Player {
  'active' : boolean,
  'country' : string,
  'name' : string,
  'fantasyPrice' : bigint,
  'isPlaying' : boolean,
  'number' : bigint,
  'isSub' : boolean,
  'photo' : string,
  'teamId' : Key__1,
  'position' : Position,
  'providerId' : MonkeyId,
  'points' : [] | [RPoints],
}
export interface PlayerCount {
  'd' : bigint,
  'f' : bigint,
  'g' : bigint,
  'm' : bigint,
}
export interface PlayerS {
  'active' : boolean,
  'country' : string,
  'name' : string,
  'fantasyPrice' : bigint,
  'isPlaying' : boolean,
  'number' : bigint,
  'isSub' : boolean,
  'photo' : string,
  'teamId' : Key__1,
  'position' : Position,
  'providerId' : MonkeyId,
  'points' : [] | [RPoints],
}
export interface PlayerSquad {
  'cap' : Key__1,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key__1,
  'hasParticipated' : boolean,
  'matchId' : Key__1,
  'players' : Array<[Key__1, boolean]>,
  'points' : RPoints,
}
export interface PlayerSquad__1 {
  'cap' : Key__1,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key__1,
  'hasParticipated' : boolean,
  'matchId' : Key__1,
  'players' : Array<[Key__1, boolean]>,
  'points' : RPoints,
}
export type PlayerSquads = Array<[Key__1, PlayerSquad__1]>;
export interface PlayerStats {
  'playerId' : Key__1,
  'stats' : {
    'fouls' : Fouls,
    'other' : Other,
    'cards' : Cards,
    'shots' : Shots,
    'passing' : Passing,
    'dribbles' : Dribbles,
    'goals' : Goals,
    'duels' : Duels,
  },
  'matchId' : Key__1,
  'rating' : string,
}
export interface PlayerStatsWithName {
  'playerId' : Key__1,
  'name' : string,
  'stats' : {
    'fouls' : Fouls,
    'other' : Other,
    'cards' : Cards,
    'shots' : Shots,
    'passing' : Passing,
    'dribbles' : Dribbles,
    'goals' : Goals,
    'duels' : Duels,
  },
  'matchId' : Key__1,
  'rating' : string,
}
export interface Player__1 {
  'active' : boolean,
  'country' : string,
  'name' : string,
  'fantasyPrice' : bigint,
  'isPlaying' : boolean,
  'number' : bigint,
  'isSub' : boolean,
  'photo' : string,
  'teamId' : Key__1,
  'position' : Position,
  'providerId' : MonkeyId,
  'points' : [] | [RPoints],
}
export type Players = Array<[Key__1, Player]>;
export interface Points {
  'fouls' : Fouls,
  'other' : Other,
  'cards' : Cards,
  'shots' : Shots,
  'passing' : Passing,
  'dribbles' : Dribbles,
  'goals' : Goals,
  'duels' : Duels,
}
export type Position = { 'goalKeeper' : null } |
  { 'midfielder' : null } |
  { 'forward' : null } |
  { 'defender' : null };
export type Position__1 = { 'goalKeeper' : null } |
  { 'midfielder' : null } |
  { 'forward' : null } |
  { 'defender' : null };
export interface RMVPSTournamentMatch {
  'status' : MatchStatus__1,
  'homeTeam' : [Key__1, [] | [Team]],
  'contestWinner' : [] | [[Key__1, User__1]],
  'mvps' : [] | [[Key__1, MVPSPlayers__1]],
  'time' : bigint,
  'seasonId' : Key__1,
  'matchId' : Key__1,
  'homeScore' : bigint,
  'awayTeam' : [Key__1, [] | [Team]],
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type RMVPSTournamentMatchs = Array<RMVPSTournamentMatch>;
export interface RMVPSTournamentMatchsList {
  'total' : bigint,
  'matches' : RMVPSTournamentMatchs,
}
export type RPoints = bigint;
export type RPoints__1 = bigint;
export interface RTournamentMatch {
  'id' : Key__1,
  'status' : MatchStatus__1,
  'tournamentName' : string,
  'homeTeam' : Key__1,
  'time' : bigint,
  'seasonId' : Key__1,
  'homeScore' : bigint,
  'awayTeam' : Key__1,
  'awayScore' : bigint,
  'tournamentId' : Key__1,
  'providerId' : MonkeyId,
  'location' : string,
}
export type RTournamentMatches = Array<RTournamentMatch>;
export interface RankPlayerSquad {
  'cap' : Key__1,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key__1,
  'hasParticipated' : boolean,
  'matchId' : Key__1,
  'players' : Array<[Key__1, PlayerS, boolean]>,
  'ranks' : Array<[Key__1, bigint]>,
  'points' : RPoints,
}
export interface RawPlayerSquad {
  'cap' : Key__1,
  'creation_time' : bigint,
  'matchTime' : bigint,
  'formation' : string,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key__1,
  'hasParticipated' : boolean,
  'matchId' : Key__1,
  'points' : RPoints,
  'matchName' : string,
}
export type RawPlayerSquads = Array<[Key__1, RawPlayerSquad]>;
export interface RefinedMatch {
  'status' : MatchStatus__1,
  'homeTeam' : [Key__1, [] | [Team]],
  'time' : bigint,
  'seasonId' : Key__1,
  'homeScore' : bigint,
  'awayTeam' : [Key__1, [] | [Team]],
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export interface RefinedPlayerSquad {
  'cap' : Key__1,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key__1,
  'hasParticipated' : boolean,
  'matchId' : Key__1,
  'players' : Array<[Key__1, PlayerS, boolean]>,
  'points' : RPoints,
}
export interface RefinedPlayerSquadRanking {
  'creation_time' : bigint,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'matchId' : Key__1,
  'points' : RPoints,
}
export interface RefinedPlayerSquadRanking__1 {
  'creation_time' : bigint,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'matchId' : Key__1,
  'points' : RPoints,
}
export type RefinedPlayerSquadRankings = Array<
  [Key__1, RefinedPlayerSquadRanking]
>;
export interface RefinedPlayerSquad__1 {
  'cap' : Key__1,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key__1,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key__1,
  'hasParticipated' : boolean,
  'matchId' : Key__1,
  'players' : Array<[Key__1, PlayerS, boolean]>,
  'points' : RPoints,
}
export type RefinedPlayerSquads = Array<[Key__1, RefinedPlayerSquad__1]>;
export type Result = { 'ok' : [string, [] | [User]] } |
  { 'err' : string };
export type Result_1 = {
    'ok' : { 'squad' : [] | [PlayerSquad], 'message' : string }
  } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Result_3 = { 'ok' : [Teams, bigint] } |
  { 'err' : string };
export type Result_4 = { 'ok' : [Players, PlayerCount] } |
  { 'err' : string };
export type Result_5 = { 'ok' : Players } |
  { 'err' : string };
export type Result_6 = { 'ok' : [string, Match] } |
  { 'err' : [string, boolean] };
export type ReturnAddParticipant = { 'ok' : string } |
  { 'err' : TransferFromError };
export interface ReturnAdminSettings {
  'total' : bigint,
  'settings' : AdminSettings,
}
export interface ReturnContests { 'total' : bigint, 'contests' : MatchContests }
export interface ReturnDetailedMatchContests {
  'total' : bigint,
  'matches' : DetailedMatchContests,
}
export interface ReturnMatches {
  'total' : bigint,
  'matches' : RTournamentMatches,
}
export interface ReturnPagContests { 'total' : bigint, 'contests' : Contests }
export interface ReturnRankings {
  'userRank' : [] | [[Key, RefinedPlayerSquadRanking__1]],
  'total' : bigint,
  'rankings' : RefinedPlayerSquadRankings,
}
export interface ReturnTeams { 'teams' : RawPlayerSquads, 'total' : bigint }
export interface ReturnTournaments {
  'total' : bigint,
  'tournaments' : Tournaments,
}
export type Role = { 'admin' : null } |
  { 'user' : null };
export interface Season {
  'endDate' : bigint,
  'tournamentId' : Key__1,
  'providerId' : MonkeyId,
  'seasonName' : string,
  'startDate' : bigint,
}
export interface Season__1 {
  'endDate' : bigint,
  'tournamentId' : Key__1,
  'providerId' : MonkeyId,
  'seasonName' : string,
  'startDate' : bigint,
}
export type Seasons = Array<[Key__1, Season]>;
export interface Shots { 'shots_on_goal' : bigint, 'shots_total' : bigint }
export interface Team {
  'logo' : string,
  'name' : string,
  'seasonId' : Key__1,
  'shortName' : string,
  'providerId' : MonkeyId,
}
export interface Team__1 {
  'logo' : string,
  'name' : string,
  'seasonId' : Key__1,
  'shortName' : string,
  'providerId' : MonkeyId,
}
export type Teams = Array<[Key__1, Team]>;
export interface TopPlayer {
  'name' : string,
  'role' : Role,
  'assets' : UserAssets,
  'joiningDate' : bigint,
  'email' : string,
}
export type TopPlayers = Array<[Key__1, TopPlayer]>;
export interface Tournament {
  'country' : string,
  'endDate' : bigint,
  'name' : string,
  'description' : string,
  'providerId' : MonkeyId,
  'startDate' : bigint,
}
export interface Tournament__1 {
  'country' : string,
  'endDate' : bigint,
  'name' : string,
  'description' : string,
  'providerId' : MonkeyId,
  'startDate' : bigint,
}
export type Tournaments = Array<[Key__1, Tournament]>;
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  };
export interface User {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export interface UserAssets { 'participated' : bigint, 'contestWon' : bigint }
export interface User__1 {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export type Users = Array<[Key__1, User__1]>;
export interface _anon_class_22_1 {
  '_updatePlayersStats' : ActorMethod<[Array<IPlayerStats>], Array<boolean>>,
  'addAdminSetting' : ActorMethod<[IAdminSetting], boolean>,
  'addContest' : ActorMethod<[IContest], Result_2>,
  'addDefaultContestsOnMatches' : ActorMethod<[], Result_2>,
  'addLeague' : ActorMethod<
    [Tournament__1, Season__1, Array<ITeamWithPlayers>],
    undefined
  >,
  'addMatch' : ActorMethod<[InputMatch], Result_6>,
  'addMatchToMvpsAdmin' : ActorMethod<[Key], undefined>,
  'addMatches' : ActorMethod<
    [Array<InputMatch>],
    { 'err' : Array<[boolean, string]>, 'succ' : Array<[boolean, Match]> }
  >,
  'addNewMatches' : ActorMethod<
    [Array<InputMatch>, Key],
    { 'err' : Array<[boolean, string]>, 'succ' : Array<[boolean, Match]> }
  >,
  'addParticipant' : ActorMethod<[Key, Key, bigint], ReturnAddParticipant>,
  'addPlayer' : ActorMethod<[Player__1], undefined>,
  'addPlayerSquad' : ActorMethod<[IPlayerSquad], Result_2>,
  'addPlayerStats' : ActorMethod<[IPlayerStats], boolean>,
  'addUser' : ActorMethod<[IUser], Result>,
  'deleteAdminSetting' : ActorMethod<[string], [] | [AdminSetting__1]>,
  'finishMatch' : ActorMethod<[MatchScore], Result_2>,
  'getAdminSettings' : ActorMethod<[GetProps], ReturnAdminSettings>,
  'getAdmins' : ActorMethod<[], Users>,
  'getAllParticipants' : ActorMethod<[], Participants>,
  'getBudget' : ActorMethod<[], [] | [string]>,
  'getContest' : ActorMethod<[Key], [] | [Contest]>,
  'getContestNames' : ActorMethod<[Array<Key>], Array<[string, string]>>,
  'getContestWinnerOfMatch' : ActorMethod<[Key], [] | [[Key, User]]>,
  'getContestWithMatch' : ActorMethod<
    [Key],
    [] | [{ 'match' : [] | [RefinedMatch], 'contest' : Contest }]
  >,
  'getContestsByMatchId' : ActorMethod<[Key], Contests>,
  'getContestsWinnerUserByMatchId' : ActorMethod<[Key], [] | [[Key, User]]>,
  'getDetailedMatchesContests' : ActorMethod<
    [GetProps],
    ReturnDetailedMatchContests
  >,
  'getFilterdContests' : ActorMethod<[GetProps], ReturnContests>,
  'getFilterdRawPlayerSquadsByMatch' : ActorMethod<
    [[] | [Key], [] | [Key], GetProps],
    ReturnTeams
  >,
  'getListPlayerSquadsByMatch' : ActorMethod<
    [Key, [] | [Key]],
    ListPlayerSquads
  >,
  'getMVPSMatches' : ActorMethod<[GetProps], RMVPSTournamentMatchsList>,
  'getMVPSOfmatch' : ActorMethod<[Key], [] | [[Key, MVPSPlayers]]>,
  'getMatch' : ActorMethod<[Key], [] | [RefinedMatch]>,
  'getMatches' : ActorMethod<[GetProps, [] | [bigint]], ReturnMatches>,
  'getMatchesByTeamId' : ActorMethod<[Key], Matches>,
  'getMatchesWithTournamentId' : ActorMethod<
    [GetProps, [] | [bigint], bigint, [] | [Key]],
    ReturnMatches
  >,
  'getPaginatedContestsByMatchId' : ActorMethod<
    [Key, GetProps],
    ReturnPagContests
  >,
  'getParticipants' : ActorMethod<[Key], Participants>,
  'getPlayer' : ActorMethod<[Key], [] | [Player__1]>,
  'getPlayerPoints' : ActorMethod<[Key, Key], [] | [RPoints__1]>,
  'getPlayerSquad' : ActorMethod<[Key], [] | [RankPlayerSquad]>,
  'getPlayerSquadsByMatch' : ActorMethod<[Key], RefinedPlayerSquads>,
  'getPlayerStats' : ActorMethod<[Key, Key], [] | [PlayerStats]>,
  'getPlayerStatsByMatchId' : ActorMethod<
    [Key],
    Array<[Key, PlayerStatsWithName]>
  >,
  'getPlayersByPosition' : ActorMethod<[Position__1], Result_5>,
  'getPlayersByTeamId' : ActorMethod<[Key], Result_4>,
  'getPlayersByTeamIds' : ActorMethod<[Array<Key>], Result_4>,
  'getRawPlayerSquadsByMatch' : ActorMethod<
    [[] | [Key], [] | [Key]],
    PlayerSquads
  >,
  'getSeasonByProvider' : ActorMethod<[MonkeyId, MonkeyId], [] | [ISeason]>,
  'getSeasons' : ActorMethod<[Key], Seasons>,
  'getSquadWithPoints' : ActorMethod<[Key], [] | [RefinedPlayerSquad]>,
  'getStatsSystem' : ActorMethod<[], Points>,
  'getTeamById' : ActorMethod<[Key], [] | [Team__1]>,
  'getTeamByName' : ActorMethod<[string], [] | [[Key, Team__1]]>,
  'getTeamsByTournament' : ActorMethod<[Key], Result_3>,
  'getTopPlayers' : ActorMethod<
    [{ 'page' : bigint, 'search' : string, 'limit' : bigint }],
    { 'total' : bigint, 'players' : TopPlayers }
  >,
  'getTournaments' : ActorMethod<[], Tournaments>,
  'getTournamentsN' : ActorMethod<[GetProps], ReturnTournaments>,
  'getUpcomingMatches' : ActorMethod<[GetProps, bigint], ReturnMatches>,
  'getUser' : ActorMethod<[[] | [string]], [] | [User]>,
  'getUserRank' : ActorMethod<[Key], [] | [MeAsTopPlayer]>,
  'increaseContestWon' : ActorMethod<
    [{ 'id' : Key, 'assetsVal' : [] | [bigint] }],
    boolean
  >,
  'increaseParticipant' : ActorMethod<
    [{ 'id' : Key, 'assetsVal' : [] | [bigint] }],
    boolean
  >,
  'makeAdmin' : ActorMethod<[Principal], boolean>,
  'nGetSquadRanking' : ActorMethod<[Key, GetProps], ReturnRankings>,
  'postponeMatch' : ActorMethod<[Key, MatchStatus], boolean>,
  'reScheduleMatch' : ActorMethod<[Key, MatchStatus], boolean>,
  'removeContest' : ActorMethod<[Key], [] | [Contest]>,
  'testingStartMatch' : ActorMethod<[Key, bigint], [] | [Match]>,
  'updateAdminSetting' : ActorMethod<[IAdminSetting], boolean>,
  'updateContest' : ActorMethod<[IContest, Key], Result_2>,
  'updateMatchScore' : ActorMethod<[MatchScore], boolean>,
  'updateMatchStatus' : ActorMethod<[MatchStatus, Key], boolean>,
  'updatePlayerPrices' : ActorMethod<
    [Array<{ 'id' : Key, 'fantasyPrice' : bigint }>],
    boolean
  >,
  'updatePlayerSquad' : ActorMethod<[Key, IPlayerSquad], Result_1>,
  'updatePlayersStats' : ActorMethod<[Array<IPlayerStats>], Array<boolean>>,
  'updateRanking' : ActorMethod<[Key], undefined>,
  'updateStatsSysteam' : ActorMethod<[Points], boolean>,
  'updateUser' : ActorMethod<[IUser], Result>,
}
export interface _SERVICE extends _anon_class_22_1 {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
