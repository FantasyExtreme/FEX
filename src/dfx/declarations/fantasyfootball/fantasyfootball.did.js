export const idlFactory = ({ IDL }) => {
  const Key = IDL.Text;
  const Position = IDL.Variant({
    'goalKeeper' : IDL.Null,
    'midfielder' : IDL.Null,
    'forward' : IDL.Null,
    'defender' : IDL.Null,
  });
  const MonkeyId = IDL.Text;
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
    'teamId' : Key,
    'position' : Position,
    'providerId' : MonkeyId,
    'points' : IDL.Opt(RPoints),
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
  const Users = IDL.Vec(IDL.Tuple(Key, User__1));
  const Key__1 = IDL.Text;
  const MatchStatus = IDL.Text;
  const Team__1 = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key,
    'shortName' : IDL.Text,
    'providerId' : MonkeyId,
  });
  const RefinedMatch = IDL.Record({
    'status' : MatchStatus,
    'homeTeam' : IDL.Tuple(Key, IDL.Opt(Team__1)),
    'time' : IDL.Int,
    'seasonId' : Key,
    'homeScore' : IDL.Nat,
    'awayTeam' : IDL.Tuple(Key, IDL.Opt(Team__1)),
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const GetProps = IDL.Record({
    'status' : IDL.Text,
    'page' : IDL.Nat,
    'search' : IDL.Text,
    'limit' : IDL.Nat,
  });
  const RTournamentMatch = IDL.Record({
    'id' : Key,
    'status' : MatchStatus,
    'tournamentName' : IDL.Text,
    'homeTeam' : Key,
    'time' : IDL.Int,
    'seasonId' : Key,
    'homeScore' : IDL.Nat,
    'awayTeam' : Key,
    'awayScore' : IDL.Nat,
    'tournamentId' : Key,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const RTournamentMatches = IDL.Vec(RTournamentMatch);
  const ReturnMatches = IDL.Record({
    'total' : IDL.Nat,
    'matches' : RTournamentMatches,
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
    'teamId' : Key,
    'position' : Position,
    'providerId' : MonkeyId,
    'points' : IDL.Opt(RPoints),
  });
  const Players = IDL.Vec(IDL.Tuple(Key, Player));
  const Result_2 = IDL.Variant({ 'ok' : Players, 'err' : IDL.Text });
  const PlayerCount = IDL.Record({
    'd' : IDL.Int,
    'f' : IDL.Int,
    'g' : IDL.Int,
    'm' : IDL.Int,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(Players, PlayerCount),
    'err' : IDL.Text,
  });
  const Team = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key,
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
  const Tournaments = IDL.Vec(IDL.Tuple(Key, Tournament));
  const ReturnTournaments = IDL.Record({
    'total' : IDL.Nat,
    'tournaments' : Tournaments,
  });
  const _anon_class_19_1 = IDL.Service({
    'addPlayer' : IDL.Func([Player__1], [], ['oneway']),
    'addUser' : IDL.Func([IUser], [Result], []),
    'getAdmins' : IDL.Func([], [Users], ['query']),
    'getBudget' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'getMatch' : IDL.Func([Key__1], [IDL.Opt(RefinedMatch)], ['query']),
    'getMatchesWithTournamentId' : IDL.Func(
        [GetProps, IDL.Opt(IDL.Int), IDL.Opt(Key__1)],
        [ReturnMatches],
        ['query'],
      ),
    'getPlayer' : IDL.Func([Key__1], [IDL.Opt(Player__1)], ['query']),
    'getPlayersByPosition' : IDL.Func([Position__1], [Result_2], ['query']),
    'getPlayersByTeamId' : IDL.Func([Key__1], [Result_1], ['query']),
    'getPlayersByTeamIds' : IDL.Func([IDL.Vec(Key__1)], [Result_1], ['query']),
    'getTeamById' : IDL.Func([Key__1], [IDL.Opt(Team)], ['query']),
    'getTournamentsN' : IDL.Func([GetProps], [ReturnTournaments], ['query']),
    'getUser' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Opt(User)], ['query']),
    'makeAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'savePlayers_mg' : IDL.Func([Players], [IDL.Bool], []),
    'updateUser' : IDL.Func([IUser], [Result], []),
  });
  return _anon_class_19_1;
};
export const init = ({ IDL }) => { return []; };
