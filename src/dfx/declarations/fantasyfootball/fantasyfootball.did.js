export const idlFactory = ({ IDL }) => {
  const Key__1 = IDL.Text;
  const MonkeyId = IDL.Text;
  const IContest = IDL.Record({
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'matchId' : Key__1,
    'maxCap' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Tournament__1 = IDL.Record({
    'country' : IDL.Text,
    'endDate' : IDL.Int,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'providerId' : MonkeyId,
    'startDate' : IDL.Int,
  });
  const Season__1 = IDL.Record({
    'endDate' : IDL.Int,
    'tournamentId' : Key__1,
    'providerId' : MonkeyId,
    'seasonName' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const Position = IDL.Variant({
    'goalKeeper' : IDL.Null,
    'midfielder' : IDL.Null,
    'forward' : IDL.Null,
    'defender' : IDL.Null,
  });
  const IPlayer = IDL.Record({
    'id' : Key__1,
    'country' : IDL.Text,
    'name' : IDL.Text,
    'fantasyPrice' : IDL.Nat,
    'number' : IDL.Nat,
    'photo' : IDL.Text,
    'teamId' : Key__1,
    'position' : Position,
    'providerId' : MonkeyId,
  });
  const ITeamWithPlayers = IDL.Record({
    'id' : IDL.Text,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key__1,
    'players' : IDL.Vec(IPlayer),
    'shortName' : IDL.Text,
    'providerId' : MonkeyId,
  });
  const MatchStatus = IDL.Text;
  const InputMatch = IDL.Record({
    'id' : IDL.Text,
    'status' : MatchStatus,
    'awayTeamName' : IDL.Text,
    'time' : IDL.Int,
    'seasonId' : Key__1,
    'homeTeamName' : IDL.Text,
    'homeScore' : IDL.Nat,
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const Match = IDL.Record({
    'status' : MatchStatus,
    'homeTeam' : Key__1,
    'time' : IDL.Int,
    'seasonId' : Key__1,
    'homeScore' : IDL.Nat,
    'awayTeam' : Key__1,
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const Key = IDL.Text;
  const RPoints = IDL.Int;
  const Player__1 = IDL.Record({
    'active' : IDL.Bool,
    'country' : IDL.Text,
    'name' : IDL.Text,
    'fantasyPrice' : IDL.Nat,
    'isPlaying' : IDL.Bool,
    'number' : IDL.Nat,
    'isSub' : IDL.Bool,
    'photo' : IDL.Text,
    'teamId' : Key__1,
    'position' : Position,
    'providerId' : MonkeyId,
    'points' : IDL.Opt(RPoints),
  });
  const IPlayerSquad = IDL.Record({
    'cap' : Key__1,
    'formation' : IDL.Text,
    'name' : IDL.Text,
    'viceCap' : Key__1,
    'matchId' : Key__1,
    'players' : IDL.Vec(IDL.Tuple(Key__1, IDL.Bool)),
  });
  const IUser = IDL.Record({ 'name' : IDL.Text, 'email' : IDL.Text });
  const Role = IDL.Variant({ 'admin' : IDL.Null, 'user' : IDL.Null });
  const User = IDL.Record({
    'name' : IDL.Text,
    'role' : Role,
    'joiningDate' : IDL.Int,
    'email' : IDL.Text,
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Opt(User)),
    'err' : IDL.Text,
  });
  const User__1 = IDL.Record({
    'name' : IDL.Text,
    'role' : Role,
    'joiningDate' : IDL.Int,
    'email' : IDL.Text,
  });
  const Users = IDL.Vec(IDL.Tuple(Key__1, User__1));
  const Contest = IDL.Record({
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'creatorUserId' : Key__1,
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'matchId' : Key__1,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
  });
  const Team__1 = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key__1,
    'shortName' : IDL.Text,
    'providerId' : MonkeyId,
  });
  const RefinedMatch = IDL.Record({
    'status' : MatchStatus,
    'homeTeam' : IDL.Tuple(Key__1, IDL.Opt(Team__1)),
    'time' : IDL.Int,
    'seasonId' : Key__1,
    'homeScore' : IDL.Nat,
    'awayTeam' : IDL.Tuple(Key__1, IDL.Opt(Team__1)),
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const Contest__1 = IDL.Record({
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'creatorUserId' : Key__1,
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'matchId' : Key__1,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
  });
  const Contests = IDL.Vec(IDL.Tuple(Key__1, Contest__1));
  const GetProps = IDL.Record({
    'status' : IDL.Text,
    'page' : IDL.Nat,
    'search' : IDL.Text,
    'limit' : IDL.Nat,
  });
  const MatchContest = IDL.Record({
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'awayTeamName' : IDL.Text,
    'creatorUserId' : Key__1,
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'matchId' : Key__1,
    'homeTeamName' : IDL.Text,
    'homeScore' : IDL.Nat,
    'awayScore' : IDL.Nat,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
    'matchName' : IDL.Text,
  });
  const MatchContests = IDL.Vec(IDL.Tuple(Key__1, MatchContest));
  const ReturnContests = IDL.Record({
    'total' : IDL.Nat,
    'contests' : MatchContests,
  });
  const RawPlayerSquad = IDL.Record({
    'cap' : Key__1,
    'creation_time' : IDL.Int,
    'matchTime' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key__1,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key__1,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key__1,
    'points' : RPoints,
    'matchName' : IDL.Text,
  });
  const RawPlayerSquads = IDL.Vec(IDL.Tuple(Key__1, RawPlayerSquad));
  const ReturnTeams = IDL.Record({
    'teams' : RawPlayerSquads,
    'total' : IDL.Nat,
  });
  const ListPlayerSquad = IDL.Record({
    'cap' : Key__1,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key__1,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key__1,
    'hasParticipated' : IDL.Bool,
    'joinedContestsName' : IDL.Vec(IDL.Text),
    'matchId' : Key__1,
    'points' : RPoints,
  });
  const ListPlayerSquads = IDL.Vec(IDL.Tuple(Key__1, ListPlayerSquad));
  const RTournamentMatch = IDL.Record({
    'id' : Key__1,
    'status' : MatchStatus,
    'tournamentName' : IDL.Text,
    'homeTeam' : Key__1,
    'time' : IDL.Int,
    'seasonId' : Key__1,
    'homeScore' : IDL.Nat,
    'awayTeam' : Key__1,
    'awayScore' : IDL.Nat,
    'tournamentId' : Key__1,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const RTournamentMatches = IDL.Vec(RTournamentMatch);
  const ReturnMatches = IDL.Record({
    'total' : IDL.Nat,
    'matches' : RTournamentMatches,
  });
  const ReturnPagContests = IDL.Record({
    'total' : IDL.Nat,
    'contests' : Contests,
  });
  const PlayerS = IDL.Record({
    'active' : IDL.Bool,
    'country' : IDL.Text,
    'name' : IDL.Text,
    'fantasyPrice' : IDL.Nat,
    'isPlaying' : IDL.Bool,
    'number' : IDL.Nat,
    'isSub' : IDL.Bool,
    'photo' : IDL.Text,
    'teamId' : Key__1,
    'position' : Position,
    'providerId' : MonkeyId,
    'points' : IDL.Opt(RPoints),
  });
  const RankPlayerSquad = IDL.Record({
    'cap' : Key__1,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key__1,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key__1,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key__1,
    'players' : IDL.Vec(IDL.Tuple(Key__1, PlayerS, IDL.Bool)),
    'ranks' : IDL.Vec(IDL.Tuple(Key__1, IDL.Nat)),
    'points' : RPoints,
  });
  const Position__1 = IDL.Variant({
    'goalKeeper' : IDL.Null,
    'midfielder' : IDL.Null,
    'forward' : IDL.Null,
    'defender' : IDL.Null,
  });
  const Player = IDL.Record({
    'active' : IDL.Bool,
    'country' : IDL.Text,
    'name' : IDL.Text,
    'fantasyPrice' : IDL.Nat,
    'isPlaying' : IDL.Bool,
    'number' : IDL.Nat,
    'isSub' : IDL.Bool,
    'photo' : IDL.Text,
    'teamId' : Key__1,
    'position' : Position,
    'providerId' : MonkeyId,
    'points' : IDL.Opt(RPoints),
  });
  const Players = IDL.Vec(IDL.Tuple(Key__1, Player));
  const Result_4 = IDL.Variant({ 'ok' : Players, 'err' : IDL.Text });
  const PlayerCount = IDL.Record({
    'd' : IDL.Int,
    'f' : IDL.Int,
    'g' : IDL.Int,
    'm' : IDL.Int,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Tuple(Players, PlayerCount),
    'err' : IDL.Text,
  });
  const ISeason = IDL.Record({
    'id' : Key__1,
    'endDate' : IDL.Int,
    'tournamentId' : Key__1,
    'providerId' : MonkeyId,
    'seasonName' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const Season = IDL.Record({
    'endDate' : IDL.Int,
    'tournamentId' : Key__1,
    'providerId' : MonkeyId,
    'seasonName' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const Seasons = IDL.Vec(IDL.Tuple(Key__1, Season));
  const Team = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key__1,
    'shortName' : IDL.Text,
    'providerId' : MonkeyId,
  });
  const Tournament = IDL.Record({
    'country' : IDL.Text,
    'endDate' : IDL.Int,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'providerId' : MonkeyId,
    'startDate' : IDL.Int,
  });
  const Tournaments = IDL.Vec(IDL.Tuple(Key__1, Tournament));
  const ReturnTournaments = IDL.Record({
    'total' : IDL.Nat,
    'tournaments' : Tournaments,
  });
  const PlayerSquad = IDL.Record({
    'cap' : Key__1,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key__1,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key__1,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key__1,
    'players' : IDL.Vec(IDL.Tuple(Key__1, IDL.Bool)),
    'points' : RPoints,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Record({ 'squad' : IDL.Opt(PlayerSquad), 'message' : IDL.Text }),
    'err' : IDL.Text,
  });
  const _anon_class_22_1 = IDL.Service({
    'addContest' : IDL.Func([IContest], [Result_2], []),
    'addLeague' : IDL.Func(
        [Tournament__1, Season__1, IDL.Vec(ITeamWithPlayers)],
        [],
        ['oneway'],
      ),
    'addMatches' : IDL.Func(
        [IDL.Vec(InputMatch)],
        [
          IDL.Record({
            'err' : IDL.Vec(IDL.Tuple(IDL.Bool, IDL.Text)),
            'succ' : IDL.Vec(IDL.Tuple(IDL.Bool, Match)),
          }),
        ],
        [],
      ),
    'addNewMatches' : IDL.Func(
        [IDL.Vec(InputMatch), Key],
        [
          IDL.Record({
            'err' : IDL.Vec(IDL.Tuple(IDL.Bool, IDL.Text)),
            'succ' : IDL.Vec(IDL.Tuple(IDL.Bool, Match)),
          }),
        ],
        [],
      ),
    'addPlayer' : IDL.Func([Player__1], [], ['oneway']),
    'addPlayerSquad' : IDL.Func([IPlayerSquad], [Result_2], []),
    'addUser' : IDL.Func([IUser], [Result], []),
    'getAdmins' : IDL.Func([], [Users], ['query']),
    'getBudget' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'getContest' : IDL.Func([Key], [IDL.Opt(Contest)], ['query']),
    'getContestNames' : IDL.Func(
        [IDL.Vec(Key)],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'getContestWithMatch' : IDL.Func(
        [Key],
        [
          IDL.Opt(
            IDL.Record({ 'match' : IDL.Opt(RefinedMatch), 'contest' : Contest })
          ),
        ],
        ['query'],
      ),
    'getContestsByMatchId' : IDL.Func([Key], [Contests], ['query']),
    'getFilterdContests' : IDL.Func([GetProps], [ReturnContests], ['query']),
    'getFilterdRawPlayerSquadsByMatch' : IDL.Func(
        [IDL.Opt(Key), IDL.Opt(Key), GetProps],
        [ReturnTeams],
        ['query'],
      ),
    'getListPlayerSquadsByMatch' : IDL.Func(
        [Key, IDL.Opt(Key)],
        [ListPlayerSquads],
        ['query'],
      ),
    'getMatch' : IDL.Func([Key], [IDL.Opt(RefinedMatch)], ['query']),
    'getMatchesWithTournamentId' : IDL.Func(
        [GetProps, IDL.Opt(IDL.Int), IDL.Int, IDL.Opt(Key)],
        [ReturnMatches],
        ['query'],
      ),
    'getPaginatedContestsByMatchId' : IDL.Func(
        [Key, GetProps],
        [ReturnPagContests],
        ['query'],
      ),
    'getPlayer' : IDL.Func([Key], [IDL.Opt(Player__1)], ['query']),
    'getPlayerSquad' : IDL.Func([Key], [IDL.Opt(RankPlayerSquad)], ['query']),
    'getPlayersByPosition' : IDL.Func([Position__1], [Result_4], ['query']),
    'getPlayersByTeamId' : IDL.Func([Key], [Result_3], ['query']),
    'getPlayersByTeamIds' : IDL.Func([IDL.Vec(Key)], [Result_3], ['query']),
    'getSeasonByProvider' : IDL.Func(
        [MonkeyId, MonkeyId],
        [IDL.Opt(ISeason)],
        ['query'],
      ),
    'getSeasons' : IDL.Func([Key], [Seasons], ['query']),
    'getTeamById' : IDL.Func([Key], [IDL.Opt(Team)], ['query']),
    'getTeamByName' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Tuple(Key, Team))],
        ['query'],
      ),
    'getTournaments' : IDL.Func([], [Tournaments], ['query']),
    'getTournamentsN' : IDL.Func([GetProps], [ReturnTournaments], ['query']),
    'getUser' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Opt(User)], ['query']),
    'makeAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'removeContest' : IDL.Func([Key], [IDL.Opt(Contest)], []),
    'updateContest' : IDL.Func([IContest, Key], [Result_2], []),
    'updatePlayerSquad' : IDL.Func([Key, IPlayerSquad], [Result_1], []),
    'updateUser' : IDL.Func([IUser], [Result], []),
  });
  return _anon_class_22_1;
};
export const init = ({ IDL }) => { return []; };
