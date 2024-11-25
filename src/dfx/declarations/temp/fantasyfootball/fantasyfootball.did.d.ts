import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AdminSetting {
  'last_modified_by' : Key,
  'settingValue' : string,
  'modification_date' : bigint,
  'settingName' : string,
  'settingType' : string,
  'creation_date' : bigint,
}
export interface AdminSetting__1 {
  'last_modified_by' : Key,
  'settingValue' : string,
  'modification_date' : bigint,
  'settingName' : string,
  'settingType' : string,
  'creation_date' : bigint,
}
export type AdminSettings = Array<[Key, AdminSetting]>;
export interface CanisterHttpResponsePayload {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<HttpHeader>,
}
export interface Cards {
  'redcards' : bigint,
  'yellowredcards' : bigint,
  'yellowcards' : bigint,
}
export interface Contest {
  'paymentMethod' : Key,
  'isDistributed' : boolean,
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key,
  'winner' : [] | [Key],
  'minCap' : bigint,
  'slots' : bigint,
  'rewardDistribution' : Array<ContestRewardDistribution>,
  'matchId' : Key,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'entryFee' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export type ContestArray = Array<DetailedContest>;
export interface ContestRewardDistribution {
  'to' : bigint,
  'from' : bigint,
  'amount' : bigint,
}
export interface ContestType {
  'status' : string,
  'name' : string,
  'color' : string,
  'time' : bigint,
  'isActive' : boolean,
  'entryFee' : bigint,
}
export interface ContestWithFirstPrize {
  'firstPrize' : bigint,
  'paymentMethod' : Key,
  'isDistributed' : boolean,
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key,
  'winner' : [] | [Key],
  'minCap' : bigint,
  'slots' : bigint,
  'rewardDistribution' : Array<ContestRewardDistribution>,
  'matchId' : Key,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'entryFee' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export interface Contest__1 {
  'paymentMethod' : Key,
  'isDistributed' : boolean,
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key,
  'winner' : [] | [Key],
  'minCap' : bigint,
  'slots' : bigint,
  'rewardDistribution' : Array<ContestRewardDistribution>,
  'matchId' : Key,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'entryFee' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
}
export type Contests = Array<[Key, Contest__1]>;
export interface DetailedContest {
  'paymentMethod' : Key,
  'isDistributed' : boolean,
  'teamsPerUser' : bigint,
  'name' : string,
  'creatorUserId' : Key,
  'winner' : [] | [Key],
  'minCap' : bigint,
  'slots' : bigint,
  'rewardDistribution' : Array<ContestRewardDistribution>,
  'teamsCreatedOnContest' : bigint,
  'matchId' : Key,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'entryFee' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
  'teamsJoinedContest' : bigint,
}
export interface DetailedMatchContest {
  'id' : Key,
  'status' : MatchStatus,
  'contests' : ContestArray,
  'homeTeam' : Key,
  'time' : bigint,
  'latest' : boolean,
  'seasonId' : Key,
  'homeScore' : bigint,
  'awayTeam' : Key,
  'awayScore' : bigint,
  'providerId' : Key,
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
export interface FantasyFootball {
  '_updatePlayersStats' : ActorMethod<[Array<IPlayerStats>], Array<boolean>>,
  'addAdminSetting' : ActorMethod<[IAdminSetting], boolean>,
  'addContest' : ActorMethod<[IContest], Result_2>,
  'addContestType' : ActorMethod<[ContestType], string>,
  'addLeague' : ActorMethod<
    [Tournament__1, Season__1, Array<ITeamWithPlayers>],
    undefined
  >,
  'addMatch' : ActorMethod<[InputMatch], Result_7>,
  'addMatchToMvpsAdmin' : ActorMethod<[Key__1], undefined>,
  'addMatches' : ActorMethod<
    [Array<InputMatch>],
    { 'err' : Array<[boolean, string]>, 'succ' : Array<[boolean, Match]> }
  >,
  'addNewMatches' : ActorMethod<
    [Array<InputMatch>, Key__1],
    { 'err' : Array<[boolean, string]>, 'succ' : Array<[boolean, Match]> }
  >,
  'addParticipant' : ActorMethod<[Key__1, Key__1], ReturnAddParticipant>,
  'addPlayer' : ActorMethod<[Player], undefined>,
  'addPlayerSquad' : ActorMethod<[IPlayerSquad], Result_2>,
  'addPlayerStats' : ActorMethod<[IPlayerStats], boolean>,
  'addPlayers' : ActorMethod<[Array<IPlayer__1>], undefined>,
  'addSeason' : ActorMethod<[Season__1], boolean>,
  'addSeasons' : ActorMethod<[Array<ISeason>], boolean>,
  'addTeam' : ActorMethod<[Team], Team>,
  'addTeamLogo' : ActorMethod<[Key__1, string], Result_6>,
  'addTeams' : ActorMethod<[Array<ITeam>], boolean>,
  'addTournament' : ActorMethod<[Tournament__1], undefined>,
  'addTournaments' : ActorMethod<[Array<ITournament>], boolean>,
  'addUser' : ActorMethod<[IUser], Result>,
  'adminResetPlayerSquadByTeamIds' : ActorMethod<[Array<Key__1>], undefined>,
  'changeAllContestNames' : ActorMethod<[{ 'name' : string }], undefined>,
  'deleteAdminSetting' : ActorMethod<[string], [] | [AdminSetting__1]>,
  'distributeRewards' : ActorMethod<[Key__1, Key__1], ReturnAddParticipant>,
  'finishMatch' : ActorMethod<[MatchScore], Result_2>,
  'getAdminSetting' : ActorMethod<[string], [] | [AdminSetting__1]>,
  'getAdminSettings' : ActorMethod<[GetProps], ReturnAdminSettings>,
  'getAdmins' : ActorMethod<[], Users>,
  'getAllParticipants' : ActorMethod<[], Participants>,
  'getAssetsOfUser' : ActorMethod<[string], UserAssets__1>,
  'getBudget' : ActorMethod<[], [] | [string]>,
  'getContest' : ActorMethod<[Key__1], [] | [Contest]>,
  'getContestNames' : ActorMethod<[Array<Key__1>], Array<[string, string]>>,
  'getContestTypes' : ActorMethod<[boolean], RContestTypes>,
  'getContestWinnerOfMatch' : ActorMethod<[Key__1], [] | [[Key__1, User]]>,
  'getContestWithMatch' : ActorMethod<
    [Key__1],
    [] | [{ 'match' : [] | [RefinedMatch], 'contest' : Contest }]
  >,
  'getContestsByMatchId' : ActorMethod<[Key__1], Contests>,
  'getContestsWinnerUserByMatchId' : ActorMethod<
    [Key__1],
    [] | [[Key__1, User]]
  >,
  'getDatedUpcomingMatches' : ActorMethod<[bigint, bigint], Array<Match>>,
  'getDetailedMatchesContests' : ActorMethod<
    [GetProps],
    ReturnDetailedMatchContests
  >,
  'getFilterdContests' : ActorMethod<[GetProps], ReturnContests>,
  'getFilterdRawPlayerSquadsByMatch' : ActorMethod<
    [[] | [Key__1], [] | [Key__1], GetProps],
    ReturnTeams
  >,
  'getJoinedContests' : ActorMethod<[], MatchContests>,
  'getJoinedMatches' : ActorMethod<
    [Key__1],
    { 'matchesCount' : bigint, 'joinedMatches' : bigint }
  >,
  'getJoinedTeams' : ActorMethod<
    [GetProps],
    { 'result' : Array<JoinedTeams>, 'total' : bigint }
  >,
  'getListPlayerSquadsByMatch' : ActorMethod<
    [Key__1, [] | [Key__1]],
    ListPlayerSquads
  >,
  'getMVPSMatches' : ActorMethod<[GetProps], RMVPSTournamentMatchsList>,
  'getMVPSOfmatch' : ActorMethod<[Key__1], [] | [[Key__1, MVPSPlayers]]>,
  'getMatch' : ActorMethod<[Key__1], [] | [RefinedMatch]>,
  'getMatches' : ActorMethod<[GetProps, [] | [bigint]], ReturnMatches>,
  'getMatchesByDateLimit' : ActorMethod<[bigint, GetProps], Array<RMatch>>,
  'getMatchesByTeamId' : ActorMethod<[Key__1], Matches>,
  'getMatchesWithTournamentId' : ActorMethod<
    [GetProps, [] | [bigint], bigint, [] | [Key__1]],
    ReturnMatches
  >,
  'getPaginatedContestsByMatchId' : ActorMethod<
    [Key__1, GetProps],
    ReturnPagContests
  >,
  'getParticipants' : ActorMethod<[Key__1], Participants>,
  'getPlayer' : ActorMethod<[Key__1], [] | [Player]>,
  'getPlayerIdsByTeamIds' : ActorMethod<[Array<Key__1>], Array<Key__1>>,
  'getPlayerPoints' : ActorMethod<[Key__1, Key__1], [] | [RPoints__1]>,
  'getPlayerSquad' : ActorMethod<[Key__1], [] | [RankPlayerSquad]>,
  'getPlayerSquadsByMatch' : ActorMethod<[Key__1], RefinedPlayerSquads>,
  'getPlayerStats' : ActorMethod<[Key__1, Key__1], [] | [PlayerStats]>,
  'getPlayerStatsByMatchId' : ActorMethod<
    [Key__1],
    Array<[Key__1, PlayerStatsWithName]>
  >,
  'getPlayersByPosition' : ActorMethod<[Position__1], Result_5>,
  'getPlayersByTeamId' : ActorMethod<[Key__1], Result_4>,
  'getPlayersByTeamIds' : ActorMethod<[Array<Key__1>], Result_4>,
  'getRawMatch' : ActorMethod<[Key__1], [] | [Match]>,
  'getRawPlayerSquadsByMatch' : ActorMethod<
    [[] | [Key__1], [] | [Key__1]],
    PlayerSquads
  >,
  'getRewardPercentage' : ActorMethod<[], bigint>,
  'getRewardsTable' : ActorMethod<
    [{ 'slotsUsed' : bigint, 'entryFee' : bigint, 'props' : GetProps }],
    { 'map' : Array<[bigint, bigint]>, 'total' : bigint }
  >,
  'getSeasonByProvider' : ActorMethod<[MonkeyId, MonkeyId], [] | [ISeason]>,
  'getSeasons' : ActorMethod<[Key__1], Seasons>,
  'getSeasonsN' : ActorMethod<[Key__1, GetProps], ReturnSeasons>,
  'getSquadWithPoints' : ActorMethod<[Key__1], [] | [RefinedPlayerSquad]>,
  'getStatsSystem' : ActorMethod<[], Points>,
  'getTeamById' : ActorMethod<[Key__1], [] | [Team]>,
  'getTeamByName' : ActorMethod<[string], [] | [[Key__1, Team]]>,
  'getTeamsBySeason' : ActorMethod<[Key__1], Result_3>,
  'getTeamsByTournament' : ActorMethod<[Key__1], Result_3>,
  'getTopPlayers' : ActorMethod<
    [{ 'page' : bigint, 'search' : string, 'limit' : bigint }],
    { 'total' : bigint, 'players' : TopPlayers }
  >,
  'getTournamentByProvider' : ActorMethod<[MonkeyId], [] | [ITournament]>,
  'getTournaments' : ActorMethod<[], Tournaments>,
  'getTournamentsN' : ActorMethod<[GetProps], ReturnTournaments>,
  'getUpcomingMatches' : ActorMethod<[GetProps, bigint], ReturnMatches>,
  'getUser' : ActorMethod<[[] | [string]], [] | [User]>,
  'getUserRank' : ActorMethod<[Key__1], [] | [MeAsTopPlayer]>,
  'increaseContestWon' : ActorMethod<
    [{ 'id' : Key__1, 'assetsVal' : [] | [bigint] }],
    boolean
  >,
  'increaseParticipant' : ActorMethod<
    [{ 'id' : Key__1, 'assetsVal' : [] | [bigint] }],
    boolean
  >,
  'increaseRewardsWon' : ActorMethod<
    [{ 'id' : Key__1, 'assetsVal' : [] | [bigint] }],
    boolean
  >,
  'increaseTotalEarning' : ActorMethod<
    [{ 'id' : Key__1, 'assetsVal' : [] | [bigint] }],
    boolean
  >,
  'makeAdmin' : ActorMethod<[Principal], boolean>,
  'nDistributeRewards' : ActorMethod<[Key__1, Key__1], ReturnAddParticipant>,
  'nGetSquadRanking' : ActorMethod<[Key__1, GetProps], ReturnRankings>,
  'postponeMatch' : ActorMethod<[Key__1, MatchStatus__1], boolean>,
  'reScheduleMatch' : ActorMethod<[Key__1, MatchStatus__1], boolean>,
  'removeContest' : ActorMethod<[Key__1], [] | [Contest]>,
  'resetAndPopulateMatchDateIndex' : ActorMethod<[], undefined>,
  'testingGetMatches' : ActorMethod<[], Matches>,
  'testingGetPlayerSquads' : ActorMethod<
    [],
    { 'squads' : PlayerSquads, 'amount' : bigint }
  >,
  'testingGetPlayersByProviderId' : ActorMethod<
    [MonkeyId],
    Array<[Key__1, Player]>
  >,
  'testingGetRewardPercentages' : ActorMethod<
    [],
    { 'platformPercentage' : bigint, 'rewardableUsersPercentage' : bigint }
  >,
  'testingGetSeasons' : ActorMethod<
    [],
    { 'seasons' : Seasons, 'amount' : bigint }
  >,
  'testingGetTeamByProviderId' : ActorMethod<[MonkeyId], [] | [[Key__1, Team]]>,
  'testingIncreaseMatchTime' : ActorMethod<[Key__1], [] | [Match]>,
  'testingRemove' : ActorMethod<[], undefined>,
  'testingStartMatch' : ActorMethod<[Key__1, bigint], [] | [Match]>,
  'toggleRewardableMatch' : ActorMethod<[Key__1, boolean], Result_2>,
  'transferPlayers' : ActorMethod<[Array<Transfer>], Array<string>>,
  'transform' : ActorMethod<[TransformArgs], CanisterHttpResponsePayload>,
  'updateAdminSetting' : ActorMethod<[IAdminSetting], boolean>,
  'updateContest' : ActorMethod<[IContest, Key__1], Result_2>,
  'updateContestType' : ActorMethod<[Key__1, ContestType], [] | [ContestType]>,
  'updateMatchScore' : ActorMethod<[MatchScore], boolean>,
  'updateMatchStatus' : ActorMethod<[MatchStatus__1, Key__1], boolean>,
  'updatePlayerPrices' : ActorMethod<
    [Array<{ 'id' : Key__1, 'fantasyPrice' : bigint }>],
    boolean
  >,
  'updatePlayerSquad' : ActorMethod<[Key__1, IPlayerSquad], Result_1>,
  'updatePlayerStatus' : ActorMethod<[Array<IPlayerStatus>], Array<boolean>>,
  'updatePlayersStats' : ActorMethod<[Array<IPlayerStats>], Array<boolean>>,
  'updateRanking' : ActorMethod<[Key__1], undefined>,
  'updateStatsSysteam' : ActorMethod<[Points], boolean>,
  'updateUpcomingMatches' : ActorMethod<
    [Array<InputMatch>],
    { 'err' : Array<[boolean, string]>, 'succ' : Array<[boolean, string]> }
  >,
  'updateUser' : ActorMethod<[IUser], Result>,
  'whoami' : ActorMethod<[], string>,
}
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
export interface HttpHeader { 'value' : string, 'name' : string }
export interface HttpResponsePayload {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<HttpHeader>,
}
export interface IAdminSetting {
  'settingValue' : string,
  'settingName' : string,
  'settingType' : string,
}
export interface IContest {
  'paymentMethod' : Key,
  'isDistributed' : boolean,
  'teamsPerUser' : bigint,
  'name' : string,
  'minCap' : bigint,
  'slots' : bigint,
  'rewardDistribution' : Array<ContestRewardDistribution>,
  'matchId' : Key,
  'maxCap' : bigint,
  'entryFee' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
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
export interface IPlayerSquad {
  'cap' : Key,
  'formation' : string,
  'name' : string,
  'viceCap' : Key,
  'matchId' : Key,
  'players' : Array<[Key, boolean]>,
}
export interface IPlayerStats {
  'playerId' : Key,
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
  'matchId' : Key,
  'rating' : string,
}
export interface IPlayerStatus {
  'id' : Key,
  'isPlaying' : boolean,
  'isSub' : boolean,
}
export interface IPlayer__1 {
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
export interface ITeam {
  'id' : string,
  'logo' : string,
  'name' : string,
  'seasonId' : Key,
  'shortName' : string,
  'providerId' : MonkeyId,
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
export interface ITournament {
  'id' : Key,
  'country' : string,
  'endDate' : bigint,
  'name' : string,
  'description' : string,
  'providerId' : MonkeyId,
  'startDate' : bigint,
}
export interface IUser { 'name' : string, 'email' : string }
export type Icrc1BlockIndex = bigint;
export type Icrc1Timestamp = bigint;
export type Icrc1Tokens = bigint;
export interface InputMatch {
  'id' : string,
  'status' : MatchStatus,
  'awayTeamName' : string,
  'time' : bigint,
  'seasonId' : Key,
  'homeTeamName' : string,
  'homeScore' : bigint,
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export interface JoinedTeams {
  'matchTime' : bigint,
  'contestId' : Key,
  'contestName' : string,
  'awayTeamLogo' : string,
  'rank' : bigint,
  'awayTeamName' : string,
  'squadId' : Key,
  'matchId' : Key,
  'squadName' : string,
  'homeTeamLogo' : string,
  'homeTeamName' : string,
  'homeScore' : bigint,
  'awayScore' : bigint,
  'leagueName' : string,
}
export type Key = string;
export type Key__1 = string;
export interface ListPlayerSquad {
  'cap' : Key,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key,
  'hasParticipated' : boolean,
  'joinedContestsName' : Array<string>,
  'matchId' : Key,
  'points' : RPoints,
}
export type ListPlayerSquads = Array<[Key, ListPlayerSquad]>;
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
  'status' : MatchStatus,
  'homeTeam' : Key,
  'time' : bigint,
  'seasonId' : Key,
  'homeScore' : bigint,
  'awayTeam' : Key,
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export interface MatchContest {
  'firstPrize' : bigint,
  'paymentMethod' : Key,
  'isDistributed' : boolean,
  'teamsPerUser' : bigint,
  'name' : string,
  'awayTeamName' : string,
  'creatorUserId' : Key,
  'winner' : [] | [Key],
  'minCap' : bigint,
  'slots' : bigint,
  'rewardDistribution' : Array<ContestRewardDistribution>,
  'matchId' : Key,
  'homeTeamName' : string,
  'homeScore' : bigint,
  'awayScore' : bigint,
  'slotsUsed' : bigint,
  'maxCap' : bigint,
  'entryFee' : bigint,
  'providerId' : MonkeyId,
  'rules' : string,
  'matchName' : string,
}
export type MatchContests = Array<[Key, MatchContest]>;
export interface MatchScore {
  'id' : Key,
  'status' : MatchStatus,
  'homeScore' : bigint,
  'awayScore' : bigint,
}
export type MatchStatus = string;
export type MatchStatus__1 = string;
export interface Match__1 {
  'status' : MatchStatus,
  'homeTeam' : Key,
  'time' : bigint,
  'seasonId' : Key,
  'homeScore' : bigint,
  'awayTeam' : Key,
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type Matches = Array<[Key, Match__1]>;
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
  'contestId' : Key,
  'isRewarded' : boolean,
  'userId' : Key,
  'rank' : bigint,
  'squadId' : Key,
  'transactionId' : Key,
}
export type Participants = Array<[Key, Participant]>;
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
export interface PlayerS {
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
export interface PlayerSquad {
  'cap' : Key,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key,
  'hasParticipated' : boolean,
  'matchId' : Key,
  'players' : Array<[Key, boolean]>,
  'points' : RPoints,
}
export interface PlayerSquad__1 {
  'cap' : Key,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key,
  'hasParticipated' : boolean,
  'matchId' : Key,
  'players' : Array<[Key, boolean]>,
  'points' : RPoints,
}
export type PlayerSquads = Array<[Key, PlayerSquad__1]>;
export interface PlayerStats {
  'playerId' : Key,
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
  'matchId' : Key,
  'rating' : string,
}
export interface PlayerStatsWithName {
  'playerId' : Key,
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
  'matchId' : Key,
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
  'teamId' : Key,
  'position' : Position,
  'providerId' : MonkeyId,
  'points' : [] | [RPoints],
}
export type Players = Array<[Key, Player__1]>;
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
export interface RContestType {
  'id' : string,
  'status' : string,
  'name' : string,
  'color' : string,
  'time' : bigint,
  'isActive' : boolean,
  'entryFee' : bigint,
}
export type RContestTypes = Array<RContestType>;
export interface RMVPSTournamentMatch {
  'status' : MatchStatus,
  'homeTeam' : [Key, [] | [Team__1]],
  'contestWinner' : [] | [[Key, User__1]],
  'mvps' : [] | [[Key, MVPSPlayers__1]],
  'time' : bigint,
  'seasonId' : Key,
  'matchId' : Key,
  'homeScore' : bigint,
  'awayTeam' : [Key, [] | [Team__1]],
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type RMVPSTournamentMatchs = Array<RMVPSTournamentMatch>;
export interface RMVPSTournamentMatchsList {
  'total' : bigint,
  'matches' : RMVPSTournamentMatchs,
}
export interface RMatch {
  'id' : Key,
  'status' : MatchStatus,
  'homeTeam' : Key,
  'time' : bigint,
  'seasonId' : Key,
  'homeScore' : bigint,
  'awayTeam' : Key,
  'awayScore' : bigint,
  'providerId' : MonkeyId,
  'location' : string,
}
export type RPoints = bigint;
export type RPoints__1 = bigint;
export interface RTournamentMatch {
  'id' : Key,
  'status' : MatchStatus,
  'tournamentName' : string,
  'homeTeam' : Key,
  'time' : bigint,
  'seasonId' : Key,
  'isRewardable' : boolean,
  'homeScore' : bigint,
  'awayTeam' : Key,
  'awayScore' : bigint,
  'tournamentId' : Key,
  'providerId' : MonkeyId,
  'location' : string,
}
export type RTournamentMatches = Array<RTournamentMatch>;
export interface RankPlayerSquad {
  'cap' : Key,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key,
  'hasParticipated' : boolean,
  'matchId' : Key,
  'players' : Array<[Key, PlayerS, boolean]>,
  'ranks' : Array<[Key, bigint]>,
  'points' : RPoints,
}
export interface RawPlayerSquad {
  'cap' : Key,
  'creation_time' : bigint,
  'matchTime' : bigint,
  'formation' : string,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key,
  'hasParticipated' : boolean,
  'matchId' : Key,
  'points' : RPoints,
  'matchName' : string,
}
export type RawPlayerSquads = Array<[Key, RawPlayerSquad]>;
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
export interface RefinedPlayerSquad {
  'cap' : Key,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key,
  'hasParticipated' : boolean,
  'matchId' : Key,
  'players' : Array<[Key, PlayerS, boolean]>,
  'points' : RPoints,
}
export interface RefinedPlayerSquadRanking {
  'creation_time' : bigint,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'matchId' : Key,
  'points' : RPoints,
}
export interface RefinedPlayerSquadRanking__1 {
  'creation_time' : bigint,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'matchId' : Key,
  'points' : RPoints,
}
export type RefinedPlayerSquadRankings = Array<
  [Key, RefinedPlayerSquadRanking]
>;
export interface RefinedPlayerSquad__1 {
  'cap' : Key,
  'creation_time' : bigint,
  'formation' : string,
  'userId' : Key,
  'name' : string,
  'rank' : bigint,
  'viceCap' : Key,
  'hasParticipated' : boolean,
  'matchId' : Key,
  'players' : Array<[Key, PlayerS, boolean]>,
  'points' : RPoints,
}
export type RefinedPlayerSquads = Array<[Key, RefinedPlayerSquad__1]>;
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
export type Result_6 = { 'ok' : [string, boolean] } |
  { 'err' : [string, boolean] };
export type Result_7 = { 'ok' : [string, Match] } |
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
export interface ReturnPagContests {
  'total' : bigint,
  'contests' : Array<[Key__1, ContestWithFirstPrize]>,
}
export interface ReturnRankings {
  'userRank' : [] | [[Key__1, RefinedPlayerSquadRanking__1]],
  'total' : bigint,
  'rankings' : RefinedPlayerSquadRankings,
}
export interface ReturnSeasons { 'total' : bigint, 'seasons' : Seasons }
export interface ReturnTeams { 'teams' : RawPlayerSquads, 'total' : bigint }
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
export interface Shots { 'shots_on_goal' : bigint, 'shots_total' : bigint }
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
export type Teams = Array<[Key, Team__1]>;
export interface TopPlayer {
  'name' : string,
  'role' : Role,
  'assets' : UserAssets,
  'joiningDate' : bigint,
  'email' : string,
}
export type TopPlayers = Array<[Key, TopPlayer]>;
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
export interface Transfer {
  'player' : IPlayer,
  'playerId' : MonkeyId,
  'isActive' : boolean,
  'teamId' : MonkeyId,
}
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : Icrc1Tokens } } |
  { 'BadBurn' : { 'min_burn_amount' : Icrc1Tokens } } |
  { 'Duplicate' : { 'duplicate_of' : Icrc1BlockIndex } } |
  { 'BadFee' : { 'expected_fee' : Icrc1Tokens } } |
  { 'CreatedInFuture' : { 'ledger_time' : Icrc1Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Icrc1Tokens } };
export interface TransformArgs {
  'context' : Uint8Array | number[],
  'response' : HttpResponsePayload,
}
export interface User {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export interface UserAssets {
  'participated' : bigint,
  'contestWon' : bigint,
  'rewardsWon' : bigint,
  'totalEarning' : bigint,
}
export interface UserAssets__1 {
  'participated' : bigint,
  'contestWon' : bigint,
  'rewardsWon' : bigint,
  'totalEarning' : bigint,
}
export interface User__1 {
  'name' : string,
  'role' : Role,
  'joiningDate' : bigint,
  'email' : string,
}
export type Users = Array<[Key, User__1]>;
export interface _SERVICE extends FantasyFootball {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
