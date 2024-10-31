import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Contest {
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key__1,
  'minCap' : bigint,
  'slots' : bigint,
  'matchId' : Key__1,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export interface Contest__1 {
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key__1,
  'minCap' : bigint,
  'slots' : bigint,
  'matchId' : Key__1,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export type Contests = Array<[Key__1, Contest__1]>;
export interface GetProps {
  'status' : string,
  'page' : bigint,
  'search' : string,
  'limit' : bigint,
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
  'status' : MatchStatus,
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
export interface Match {
  'status' : MatchStatus,
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
export type MatchStatus = string;
export type MonkeyId = string;
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
export type Position = { 'goalKeeper' : null } |
  { 'midfielder' : null } |
  { 'forward' : null } |
  { 'defender' : null };
export type Position__1 = { 'goalKeeper' : null } |
  { 'midfielder' : null } |
  { 'forward' : null } |
  { 'defender' : null };
export type RPoints = bigint;
export interface RTournamentMatch {
  'id' : Key__1,
  'status' : MatchStatus,
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
  'status' : MatchStatus,
  'homeTeam' : [Key__1, [] | [Team__1]],
  'time' : bigint,
  'seasonId' : Key__1,
  'homeScore' : bigint,
  'awayTeam' : [Key__1, [] | [Team__1]],
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type Result = { 'ok' : [string, [] | [User]] } |
  { 'err' : string };
export type Result_1 = {
    'ok' : { 'squad' : [] | [PlayerSquad], 'message' : string }
  } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Result_3 = { 'ok' : [Players, PlayerCount] } |
  { 'err' : string };
export type Result_4 = { 'ok' : Players } |
  { 'err' : string };
export interface ReturnContests { 'total' : bigint, 'contests' : MatchContests }
export interface ReturnMatches {
  'total' : bigint,
  'matches' : RTournamentMatches,
}
export interface ReturnPagContests { 'total' : bigint, 'contests' : Contests }
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
export interface User {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export interface User__1 {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export type Users = Array<[Key__1, User__1]>;
export interface _anon_class_22_1 {
  'addContest' : ActorMethod<[IContest], Result_2>,
  'addLeague' : ActorMethod<
    [Tournament__1, Season__1, Array<ITeamWithPlayers>],
    undefined
  >,
  'addMatches' : ActorMethod<
    [Array<InputMatch>],
    { 'err' : Array<[boolean, string]>, 'succ' : Array<[boolean, Match]> }
  >,
  'addNewMatches' : ActorMethod<
    [Array<InputMatch>, Key],
    { 'err' : Array<[boolean, string]>, 'succ' : Array<[boolean, Match]> }
  >,
  'addPlayer' : ActorMethod<[Player__1], undefined>,
  'addPlayerSquad' : ActorMethod<[IPlayerSquad], Result_2>,
  'addUser' : ActorMethod<[IUser], Result>,
  'getAdmins' : ActorMethod<[], Users>,
  'getBudget' : ActorMethod<[], [] | [string]>,
  'getContest' : ActorMethod<[Key], [] | [Contest]>,
  'getContestNames' : ActorMethod<[Array<Key>], Array<[string, string]>>,
  'getContestWithMatch' : ActorMethod<
    [Key],
    [] | [{ 'match' : [] | [RefinedMatch], 'contest' : Contest }]
  >,
  'getContestsByMatchId' : ActorMethod<[Key], Contests>,
  'getFilterdContests' : ActorMethod<[GetProps], ReturnContests>,
  'getFilterdRawPlayerSquadsByMatch' : ActorMethod<
    [[] | [Key], [] | [Key], GetProps],
    ReturnTeams
  >,
  'getListPlayerSquadsByMatch' : ActorMethod<
    [Key, [] | [Key]],
    ListPlayerSquads
  >,
  'getMatch' : ActorMethod<[Key], [] | [RefinedMatch]>,
  'getMatchesWithTournamentId' : ActorMethod<
    [GetProps, [] | [bigint], bigint, [] | [Key]],
    ReturnMatches
  >,
  'getPaginatedContestsByMatchId' : ActorMethod<
    [Key, GetProps],
    ReturnPagContests
  >,
  'getPlayer' : ActorMethod<[Key], [] | [Player__1]>,
  'getPlayerSquad' : ActorMethod<[Key], [] | [RankPlayerSquad]>,
  'getPlayersByPosition' : ActorMethod<[Position__1], Result_4>,
  'getPlayersByTeamId' : ActorMethod<[Key], Result_3>,
  'getPlayersByTeamIds' : ActorMethod<[Array<Key>], Result_3>,
  'getSeasonByProvider' : ActorMethod<[MonkeyId, MonkeyId], [] | [ISeason]>,
  'getSeasons' : ActorMethod<[Key], Seasons>,
  'getTeamById' : ActorMethod<[Key], [] | [Team]>,
  'getTeamByName' : ActorMethod<[string], [] | [[Key, Team]]>,
  'getTournaments' : ActorMethod<[], Tournaments>,
  'getTournamentsN' : ActorMethod<[GetProps], ReturnTournaments>,
  'getUser' : ActorMethod<[[] | [string]], [] | [User]>,
  'makeAdmin' : ActorMethod<[Principal], boolean>,
  'removeContest' : ActorMethod<[Key], [] | [Contest]>,
  'updateContest' : ActorMethod<[IContest, Key], Result_2>,
  'updatePlayerSquad' : ActorMethod<[Key, IPlayerSquad], Result_1>,
  'updateUser' : ActorMethod<[IUser], Result>,
}
export interface _SERVICE extends _anon_class_22_1 {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
