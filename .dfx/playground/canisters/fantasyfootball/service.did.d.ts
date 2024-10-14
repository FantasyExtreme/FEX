import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GetProps {
  'status' : string,
  'page' : bigint,
  'search' : string,
  'limit' : bigint,
}
export interface IPlayer {
  'id' : Key,
  'country' : string,
  'name' : string,
  'fantasyPrice' : bigint,
  'number' : bigint,
  'photo' : string,
  'teamId' : Key,
  'position' : Position,
  'providerId' : MonkeyId,
}
export interface ISeason {
  'id' : Key,
  'endDate' : bigint,
  'tournamentId' : Key,
  'providerId' : MonkeyId,
  'seasonName' : string,
  'startDate' : bigint,
}
export interface ITeamWithPlayers {
  'id' : string,
  'logo' : string,
  'name' : string,
  'seasonId' : Key,
  'players' : Array<IPlayer>,
  'shortName' : string,
  'providerId' : MonkeyId,
}
export interface IUser { 'name' : string, 'email' : string }
export type Key = string;
export type Key__1 = string;
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
  'teamId' : Key,
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
export interface Player__1 {
  'active' : boolean,
  'country' : string,
  'name' : string,
  'fantasyPrice' : bigint,
  'isPlaying' : boolean,
  'number' : bigint,
  'isSub' : boolean,
  'photo' : string,
  'teamId' : Key,
  'position' : Position,
  'providerId' : MonkeyId,
  'points' : [] | [RPoints],
}
export type Players = Array<[Key, Player]>;
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
  'id' : Key,
  'status' : MatchStatus,
  'tournamentName' : string,
  'homeTeam' : Key,
  'time' : bigint,
  'seasonId' : Key,
  'homeScore' : bigint,
  'awayTeam' : Key,
  'awayScore' : bigint,
  'tournamentId' : Key,
  'providerId' : MonkeyId,
  'location' : string,
}
export type RTournamentMatches = Array<RTournamentMatch>;
export interface RefinedMatch {
  'status' : MatchStatus,
  'homeTeam' : [Key, [] | [Team__1]],
  'time' : bigint,
  'seasonId' : Key,
  'homeScore' : bigint,
  'awayTeam' : [Key, [] | [Team__1]],
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type Result = { 'ok' : [string, [] | [User]] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [Players, PlayerCount] } |
  { 'err' : string };
export type Result_2 = { 'ok' : Players } |
  { 'err' : string };
export interface ReturnMatches {
  'total' : bigint,
  'matches' : RTournamentMatches,
}
export interface ReturnTournaments {
  'total' : bigint,
  'tournaments' : Tournaments,
}
export type Role = { 'admin' : null } |
  { 'user' : null };
export interface Season {
  'endDate' : bigint,
  'tournamentId' : Key,
  'providerId' : MonkeyId,
  'seasonName' : string,
  'startDate' : bigint,
}
export interface Season__1 {
  'endDate' : bigint,
  'tournamentId' : Key,
  'providerId' : MonkeyId,
  'seasonName' : string,
  'startDate' : bigint,
}
export type Seasons = Array<[Key, Season]>;
export interface Team {
  'logo' : string,
  'name' : string,
  'seasonId' : Key,
  'shortName' : string,
  'providerId' : MonkeyId,
}
export interface Team__1 {
  'logo' : string,
  'name' : string,
  'seasonId' : Key,
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
export type Tournaments = Array<[Key, Tournament]>;
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
export type Users = Array<[Key, User__1]>;
export interface _anon_class_19_1 {
  'addLeague' : ActorMethod<
    [Tournament__1, Season__1, Array<ITeamWithPlayers>],
    undefined
  >,
  'addPlayer' : ActorMethod<[Player__1], undefined>,
  'addUser' : ActorMethod<[IUser], Result>,
  'getAdmins' : ActorMethod<[], Users>,
  'getBudget' : ActorMethod<[], [] | [string]>,
  'getMatch' : ActorMethod<[Key__1], [] | [RefinedMatch]>,
  'getMatchesWithTournamentId' : ActorMethod<
    [GetProps, [] | [bigint], [] | [Key__1]],
    ReturnMatches
  >,
  'getPlayer' : ActorMethod<[Key__1], [] | [Player__1]>,
  'getPlayersByPosition' : ActorMethod<[Position__1], Result_2>,
  'getPlayersByTeamId' : ActorMethod<[Key__1], Result_1>,
  'getPlayersByTeamIds' : ActorMethod<[Array<Key__1>], Result_1>,
  'getSeasonByProvider' : ActorMethod<[MonkeyId, MonkeyId], [] | [ISeason]>,
  'getSeasons' : ActorMethod<[Key__1], Seasons>,
  'getTeamById' : ActorMethod<[Key__1], [] | [Team]>,
  'getTournaments' : ActorMethod<[], Tournaments>,
  'getTournamentsN' : ActorMethod<[GetProps], ReturnTournaments>,
  'getUser' : ActorMethod<[[] | [string]], [] | [User]>,
  'makeAdmin' : ActorMethod<[Principal], boolean>,
  'updateUser' : ActorMethod<[IUser], Result>,
}
export interface _SERVICE extends _anon_class_19_1 {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
