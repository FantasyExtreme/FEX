export const idlFactory = ({ IDL }) => {
  const Key = IDL.Text;
  const Fouls = IDL.Record({ 'committed' : IDL.Int, 'drawn' : IDL.Int });
  const Other = IDL.Record({
    'inside_box_saves' : IDL.Int,
    'pen_won' : IDL.Int,
    'pen_saved' : IDL.Int,
    'minutes_played' : IDL.Int,
    'clearances' : IDL.Int,
    'interceptions' : IDL.Int,
    'saves' : IDL.Int,
    'dispossesed' : IDL.Int,
    'aerials_won' : IDL.Int,
    'punches' : IDL.Int,
    'pen_committed' : IDL.Int,
    'pen_scored' : IDL.Int,
    'offsides' : IDL.Int,
    'blocks' : IDL.Int,
    'pen_missed' : IDL.Int,
    'hit_woodwork' : IDL.Int,
    'tackles' : IDL.Int,
  });
  const Cards = IDL.Record({
    'redcards' : IDL.Int,
    'yellowredcards' : IDL.Int,
    'yellowcards' : IDL.Int,
  });
  const Shots = IDL.Record({
    'shots_on_goal' : IDL.Int,
    'shots_total' : IDL.Int,
  });
  const Passing = IDL.Record({
    'crosses_accuracy' : IDL.Int,
    'passes_accuracy' : IDL.Int,
    'total_crosses' : IDL.Int,
    'accurate_passes' : IDL.Int,
    'passes' : IDL.Int,
    'key_passes' : IDL.Int,
  });
  const Dribbles = IDL.Record({
    'dribbled_past' : IDL.Int,
    'attempts' : IDL.Int,
    'success' : IDL.Int,
  });
  const Goals = IDL.Record({
    'assists' : IDL.Int,
    'scored' : IDL.Int,
    'conceded' : IDL.Int,
    'owngoals' : IDL.Int,
    'team_conceded' : IDL.Int,
  });
  const Duels = IDL.Record({ 'won' : IDL.Int, 'total' : IDL.Int });
  const IPlayerStats = IDL.Record({
    'playerId' : Key,
    'stats' : IDL.Record({
      'fouls' : Fouls,
      'other' : Other,
      'cards' : Cards,
      'shots' : Shots,
      'passing' : Passing,
      'dribbles' : Dribbles,
      'goals' : Goals,
      'duels' : Duels,
    }),
    'matchId' : Key,
    'rating' : IDL.Text,
  });
  const IAdminSetting = IDL.Record({
    'settingValue' : IDL.Text,
    'settingName' : IDL.Text,
    'settingType' : IDL.Text,
  });
  const ContestRewardDistribution = IDL.Record({
    'to' : IDL.Nat,
    'from' : IDL.Nat,
    'amount' : IDL.Int,
  });
  const MonkeyId = IDL.Text;
  const IContest = IDL.Record({
    'paymentMethod' : Key,
    'isDistributed' : IDL.Bool,
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'rewardDistribution' : IDL.Vec(ContestRewardDistribution),
    'matchId' : Key,
    'maxCap' : IDL.Nat,
    'entryFee' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const ContestType = IDL.Record({
    'status' : IDL.Text,
    'name' : IDL.Text,
    'color' : IDL.Text,
    'time' : IDL.Int,
    'isActive' : IDL.Bool,
    'entryFee' : IDL.Nat,
  });
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
    'tournamentId' : Key,
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
    'id' : Key,
    'country' : IDL.Text,
    'name' : IDL.Text,
    'fantasyPrice' : IDL.Nat,
    'number' : IDL.Nat,
    'photo' : IDL.Text,
    'teamId' : Key,
    'position' : Position,
    'providerId' : MonkeyId,
  });
  const ITeamWithPlayers = IDL.Record({
    'id' : IDL.Text,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key,
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
    'seasonId' : Key,
    'homeTeamName' : IDL.Text,
    'homeScore' : IDL.Nat,
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const Match = IDL.Record({
    'status' : MatchStatus,
    'homeTeam' : Key,
    'time' : IDL.Int,
    'seasonId' : Key,
    'homeScore' : IDL.Nat,
    'awayTeam' : Key,
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const Result_7 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, Match),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const Key__1 = IDL.Text;
  const Icrc1Tokens = IDL.Nat;
  const Icrc1BlockIndex = IDL.Nat;
  const Icrc1Timestamp = IDL.Nat64;
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : Icrc1Tokens }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Icrc1Tokens }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : Icrc1BlockIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Icrc1Tokens }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Icrc1Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Icrc1Tokens }),
  });
  const ReturnAddParticipant = IDL.Variant({
    'ok' : IDL.Text,
    'err' : TransferFromError,
  });
  const RPoints = IDL.Int;
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
  const IPlayerSquad = IDL.Record({
    'cap' : Key,
    'formation' : IDL.Text,
    'name' : IDL.Text,
    'viceCap' : Key,
    'matchId' : Key,
    'players' : IDL.Vec(IDL.Tuple(Key, IDL.Bool)),
  });
  const IPlayer__1 = IDL.Record({
    'id' : Key,
    'country' : IDL.Text,
    'name' : IDL.Text,
    'fantasyPrice' : IDL.Nat,
    'number' : IDL.Nat,
    'photo' : IDL.Text,
    'teamId' : Key,
    'position' : Position,
    'providerId' : MonkeyId,
  });
  const ISeason = IDL.Record({
    'id' : Key,
    'endDate' : IDL.Int,
    'tournamentId' : Key,
    'providerId' : MonkeyId,
    'seasonName' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const Team = IDL.Record({
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key,
    'shortName' : IDL.Text,
    'providerId' : MonkeyId,
  });
  const Result_6 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Bool),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const ITeam = IDL.Record({
    'id' : IDL.Text,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'seasonId' : Key,
    'shortName' : IDL.Text,
    'providerId' : MonkeyId,
  });
  const ITournament = IDL.Record({
    'id' : Key,
    'country' : IDL.Text,
    'endDate' : IDL.Int,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'providerId' : MonkeyId,
    'startDate' : IDL.Int,
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
  const AdminSetting = IDL.Record({
    'last_modified_by' : Key,
    'settingValue' : IDL.Text,
    'modification_date' : IDL.Int,
    'settingName' : IDL.Text,
    'settingType' : IDL.Text,
    'creation_date' : IDL.Int,
  });
  const MatchScore = IDL.Record({
    'id' : Key,
    'status' : MatchStatus,
    'homeScore' : IDL.Nat,
    'awayScore' : IDL.Nat,
  });
  const GetProps = IDL.Record({
    'status' : IDL.Text,
    'page' : IDL.Nat,
    'search' : IDL.Text,
    'limit' : IDL.Nat,
  });
  const AdminSetting__1 = IDL.Record({
    'last_modified_by' : Key,
    'settingValue' : IDL.Text,
    'modification_date' : IDL.Int,
    'settingName' : IDL.Text,
    'settingType' : IDL.Text,
    'creation_date' : IDL.Int,
  });
  const AdminSettings = IDL.Vec(IDL.Tuple(Key, AdminSetting__1));
  const ReturnAdminSettings = IDL.Record({
    'total' : IDL.Nat,
    'settings' : AdminSettings,
  });
  const User__1 = IDL.Record({
    'name' : IDL.Text,
    'role' : Role,
    'joiningDate' : IDL.Int,
    'email' : IDL.Text,
  });
  const Users = IDL.Vec(IDL.Tuple(Key, User__1));
  const Participant = IDL.Record({
    'contestId' : Key,
    'isRewarded' : IDL.Bool,
    'userId' : Key,
    'rank' : IDL.Nat,
    'squadId' : Key,
    'transactionId' : Key,
  });
  const Participants = IDL.Vec(IDL.Tuple(Key, Participant));
  const UserAssets__1 = IDL.Record({
    'participated' : IDL.Nat,
    'contestWon' : IDL.Nat,
    'rewardsWon' : IDL.Nat,
    'totalEarning' : IDL.Nat,
  });
  const Contest = IDL.Record({
    'paymentMethod' : Key,
    'isDistributed' : IDL.Bool,
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'creatorUserId' : Key,
    'winner' : IDL.Opt(Key),
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'rewardDistribution' : IDL.Vec(ContestRewardDistribution),
    'matchId' : Key,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'entryFee' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
  });
  const RContestType = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'name' : IDL.Text,
    'color' : IDL.Text,
    'time' : IDL.Int,
    'isActive' : IDL.Bool,
    'entryFee' : IDL.Nat,
  });
  const RContestTypes = IDL.Vec(RContestType);
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
  const Contest__1 = IDL.Record({
    'paymentMethod' : Key,
    'isDistributed' : IDL.Bool,
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'creatorUserId' : Key,
    'winner' : IDL.Opt(Key),
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'rewardDistribution' : IDL.Vec(ContestRewardDistribution),
    'matchId' : Key,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'entryFee' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
  });
  const Contests = IDL.Vec(IDL.Tuple(Key, Contest__1));
  const DetailedContest = IDL.Record({
    'paymentMethod' : Key,
    'isDistributed' : IDL.Bool,
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'creatorUserId' : Key,
    'winner' : IDL.Opt(Key),
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'rewardDistribution' : IDL.Vec(ContestRewardDistribution),
    'teamsCreatedOnContest' : IDL.Nat,
    'matchId' : Key,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'entryFee' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
    'teamsJoinedContest' : IDL.Nat,
  });
  const ContestArray = IDL.Vec(DetailedContest);
  const DetailedMatchContest = IDL.Record({
    'id' : Key,
    'status' : MatchStatus,
    'contests' : ContestArray,
    'homeTeam' : Key,
    'time' : IDL.Int,
    'latest' : IDL.Bool,
    'seasonId' : Key,
    'homeScore' : IDL.Nat,
    'awayTeam' : Key,
    'awayScore' : IDL.Nat,
    'providerId' : Key,
    'teamsCreated' : IDL.Nat,
    'location' : IDL.Text,
    'teamsJoined' : IDL.Nat,
  });
  const DetailedMatchContests = IDL.Vec(DetailedMatchContest);
  const ReturnDetailedMatchContests = IDL.Record({
    'total' : IDL.Nat,
    'matches' : DetailedMatchContests,
  });
  const MatchContest = IDL.Record({
    'firstPrize' : IDL.Nat,
    'paymentMethod' : Key,
    'isDistributed' : IDL.Bool,
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'awayTeamName' : IDL.Text,
    'creatorUserId' : Key,
    'winner' : IDL.Opt(Key),
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'rewardDistribution' : IDL.Vec(ContestRewardDistribution),
    'matchId' : Key,
    'homeTeamName' : IDL.Text,
    'homeScore' : IDL.Nat,
    'awayScore' : IDL.Nat,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'entryFee' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
    'matchName' : IDL.Text,
  });
  const MatchContests = IDL.Vec(IDL.Tuple(Key, MatchContest));
  const ReturnContests = IDL.Record({
    'total' : IDL.Nat,
    'contests' : MatchContests,
  });
  const RawPlayerSquad = IDL.Record({
    'cap' : Key,
    'creation_time' : IDL.Int,
    'matchTime' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key,
    'points' : RPoints,
    'matchName' : IDL.Text,
  });
  const RawPlayerSquads = IDL.Vec(IDL.Tuple(Key, RawPlayerSquad));
  const ReturnTeams = IDL.Record({
    'teams' : RawPlayerSquads,
    'total' : IDL.Nat,
  });
  const JoinedTeams = IDL.Record({
    'matchTime' : IDL.Int,
    'contestId' : Key,
    'contestName' : IDL.Text,
    'awayTeamLogo' : IDL.Text,
    'rank' : IDL.Nat,
    'awayTeamName' : IDL.Text,
    'squadId' : Key,
    'matchId' : Key,
    'squadName' : IDL.Text,
    'homeTeamLogo' : IDL.Text,
    'homeTeamName' : IDL.Text,
    'homeScore' : IDL.Nat,
    'awayScore' : IDL.Nat,
    'leagueName' : IDL.Text,
  });
  const ListPlayerSquad = IDL.Record({
    'cap' : Key,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key,
    'hasParticipated' : IDL.Bool,
    'joinedContestsName' : IDL.Vec(IDL.Text),
    'matchId' : Key,
    'points' : RPoints,
  });
  const ListPlayerSquads = IDL.Vec(IDL.Tuple(Key, ListPlayerSquad));
  const MVPSPlayers__1 = IDL.Record({
    'name' : IDL.Text,
    'number' : IDL.Int,
    'photo' : IDL.Text,
  });
  const RMVPSTournamentMatch = IDL.Record({
    'status' : MatchStatus,
    'homeTeam' : IDL.Tuple(Key, IDL.Opt(Team__1)),
    'contestWinner' : IDL.Opt(IDL.Tuple(Key, User__1)),
    'mvps' : IDL.Opt(IDL.Tuple(Key, MVPSPlayers__1)),
    'time' : IDL.Int,
    'seasonId' : Key,
    'matchId' : Key,
    'homeScore' : IDL.Nat,
    'awayTeam' : IDL.Tuple(Key, IDL.Opt(Team__1)),
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const RMVPSTournamentMatchs = IDL.Vec(RMVPSTournamentMatch);
  const RMVPSTournamentMatchsList = IDL.Record({
    'total' : IDL.Nat,
    'matches' : RMVPSTournamentMatchs,
  });
  const MVPSPlayers = IDL.Record({
    'name' : IDL.Text,
    'number' : IDL.Int,
    'photo' : IDL.Text,
  });
  const RTournamentMatch = IDL.Record({
    'id' : Key,
    'status' : MatchStatus,
    'tournamentName' : IDL.Text,
    'homeTeam' : Key,
    'time' : IDL.Int,
    'seasonId' : Key,
    'isRewardable' : IDL.Bool,
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
  const RMatch = IDL.Record({
    'id' : Key,
    'status' : MatchStatus,
    'homeTeam' : Key,
    'time' : IDL.Int,
    'seasonId' : Key,
    'homeScore' : IDL.Nat,
    'awayTeam' : Key,
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const Match__1 = IDL.Record({
    'status' : MatchStatus,
    'homeTeam' : Key,
    'time' : IDL.Int,
    'seasonId' : Key,
    'homeScore' : IDL.Nat,
    'awayTeam' : Key,
    'awayScore' : IDL.Nat,
    'providerId' : MonkeyId,
    'location' : IDL.Text,
  });
  const Matches = IDL.Vec(IDL.Tuple(Key, Match__1));
  const ContestWithFirstPrize = IDL.Record({
    'firstPrize' : IDL.Nat,
    'paymentMethod' : Key,
    'isDistributed' : IDL.Bool,
    'teamsPerUser' : IDL.Nat,
    'name' : IDL.Text,
    'creatorUserId' : Key,
    'winner' : IDL.Opt(Key),
    'minCap' : IDL.Nat,
    'slots' : IDL.Nat,
    'rewardDistribution' : IDL.Vec(ContestRewardDistribution),
    'matchId' : Key,
    'slotsUsed' : IDL.Nat,
    'maxCap' : IDL.Nat,
    'entryFee' : IDL.Nat,
    'providerId' : MonkeyId,
    'rules' : IDL.Text,
  });
  const ReturnPagContests = IDL.Record({
    'total' : IDL.Nat,
    'contests' : IDL.Vec(IDL.Tuple(Key__1, ContestWithFirstPrize)),
  });
  const RPoints__1 = IDL.Int;
  const PlayerS = IDL.Record({
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
  const RankPlayerSquad = IDL.Record({
    'cap' : Key,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key,
    'players' : IDL.Vec(IDL.Tuple(Key, PlayerS, IDL.Bool)),
    'ranks' : IDL.Vec(IDL.Tuple(Key, IDL.Nat)),
    'points' : RPoints,
  });
  const RefinedPlayerSquad__1 = IDL.Record({
    'cap' : Key,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key,
    'players' : IDL.Vec(IDL.Tuple(Key, PlayerS, IDL.Bool)),
    'points' : RPoints,
  });
  const RefinedPlayerSquads = IDL.Vec(IDL.Tuple(Key, RefinedPlayerSquad__1));
  const PlayerStats = IDL.Record({
    'playerId' : Key,
    'stats' : IDL.Record({
      'fouls' : Fouls,
      'other' : Other,
      'cards' : Cards,
      'shots' : Shots,
      'passing' : Passing,
      'dribbles' : Dribbles,
      'goals' : Goals,
      'duels' : Duels,
    }),
    'matchId' : Key,
    'rating' : IDL.Text,
  });
  const PlayerStatsWithName = IDL.Record({
    'playerId' : Key,
    'name' : IDL.Text,
    'stats' : IDL.Record({
      'fouls' : Fouls,
      'other' : Other,
      'cards' : Cards,
      'shots' : Shots,
      'passing' : Passing,
      'dribbles' : Dribbles,
      'goals' : Goals,
      'duels' : Duels,
    }),
    'matchId' : Key,
    'rating' : IDL.Text,
  });
  const Position__1 = IDL.Variant({
    'goalKeeper' : IDL.Null,
    'midfielder' : IDL.Null,
    'forward' : IDL.Null,
    'defender' : IDL.Null,
  });
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
  const Players = IDL.Vec(IDL.Tuple(Key, Player__1));
  const Result_5 = IDL.Variant({ 'ok' : Players, 'err' : IDL.Text });
  const PlayerCount = IDL.Record({
    'd' : IDL.Int,
    'f' : IDL.Int,
    'g' : IDL.Int,
    'm' : IDL.Int,
  });
  const Result_4 = IDL.Variant({
    'ok' : IDL.Tuple(Players, PlayerCount),
    'err' : IDL.Text,
  });
  const PlayerSquad__1 = IDL.Record({
    'cap' : Key,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key,
    'players' : IDL.Vec(IDL.Tuple(Key, IDL.Bool)),
    'points' : RPoints,
  });
  const PlayerSquads = IDL.Vec(IDL.Tuple(Key, PlayerSquad__1));
  const Season = IDL.Record({
    'endDate' : IDL.Int,
    'tournamentId' : Key,
    'providerId' : MonkeyId,
    'seasonName' : IDL.Text,
    'startDate' : IDL.Int,
  });
  const Seasons = IDL.Vec(IDL.Tuple(Key, Season));
  const ReturnSeasons = IDL.Record({ 'total' : IDL.Nat, 'seasons' : Seasons });
  const RefinedPlayerSquad = IDL.Record({
    'cap' : Key,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key,
    'players' : IDL.Vec(IDL.Tuple(Key, PlayerS, IDL.Bool)),
    'points' : RPoints,
  });
  const Points = IDL.Record({
    'fouls' : Fouls,
    'other' : Other,
    'cards' : Cards,
    'shots' : Shots,
    'passing' : Passing,
    'dribbles' : Dribbles,
    'goals' : Goals,
    'duels' : Duels,
  });
  const Teams = IDL.Vec(IDL.Tuple(Key, Team__1));
  const Result_3 = IDL.Variant({
    'ok' : IDL.Tuple(Teams, IDL.Nat),
    'err' : IDL.Text,
  });
  const UserAssets = IDL.Record({
    'participated' : IDL.Nat,
    'contestWon' : IDL.Nat,
    'rewardsWon' : IDL.Nat,
    'totalEarning' : IDL.Nat,
  });
  const TopPlayer = IDL.Record({
    'name' : IDL.Text,
    'role' : Role,
    'assets' : UserAssets,
    'joiningDate' : IDL.Int,
    'email' : IDL.Text,
  });
  const TopPlayers = IDL.Vec(IDL.Tuple(Key, TopPlayer));
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
  const MeAsTopPlayer = IDL.Record({
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'role' : Role,
    'assets' : UserAssets,
    'joiningDate' : IDL.Int,
    'email' : IDL.Text,
  });
  const RefinedPlayerSquadRanking__1 = IDL.Record({
    'creation_time' : IDL.Int,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'matchId' : Key,
    'points' : RPoints,
  });
  const RefinedPlayerSquadRanking = IDL.Record({
    'creation_time' : IDL.Int,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'matchId' : Key,
    'points' : RPoints,
  });
  const RefinedPlayerSquadRankings = IDL.Vec(
    IDL.Tuple(Key, RefinedPlayerSquadRanking)
  );
  const ReturnRankings = IDL.Record({
    'userRank' : IDL.Opt(IDL.Tuple(Key__1, RefinedPlayerSquadRanking__1)),
    'total' : IDL.Nat,
    'rankings' : RefinedPlayerSquadRankings,
  });
  const MatchStatus__1 = IDL.Text;
  const Transfer = IDL.Record({
    'player' : IPlayer,
    'playerId' : MonkeyId,
    'isActive' : IDL.Bool,
    'teamId' : MonkeyId,
  });
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const HttpResponsePayload = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  const TransformArgs = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : HttpResponsePayload,
  });
  const CanisterHttpResponsePayload = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  const PlayerSquad = IDL.Record({
    'cap' : Key,
    'creation_time' : IDL.Int,
    'formation' : IDL.Text,
    'userId' : Key,
    'name' : IDL.Text,
    'rank' : IDL.Nat,
    'viceCap' : Key,
    'hasParticipated' : IDL.Bool,
    'matchId' : Key,
    'players' : IDL.Vec(IDL.Tuple(Key, IDL.Bool)),
    'points' : RPoints,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Record({ 'squad' : IDL.Opt(PlayerSquad), 'message' : IDL.Text }),
    'err' : IDL.Text,
  });
  const IPlayerStatus = IDL.Record({
    'id' : Key,
    'isPlaying' : IDL.Bool,
    'isSub' : IDL.Bool,
  });
  const FantasyFootball = IDL.Service({
    '_updatePlayersStats' : IDL.Func(
        [IDL.Vec(IPlayerStats)],
        [IDL.Vec(IDL.Bool)],
        [],
      ),
    'addAdminSetting' : IDL.Func([IAdminSetting], [IDL.Bool], []),
    'addContest' : IDL.Func([IContest], [Result_2], []),
    'addContestType' : IDL.Func([ContestType], [IDL.Text], []),
    'addDefaultContestsOnMatches' : IDL.Func([], [Result_2], []),
    'addLeague' : IDL.Func(
        [Tournament__1, Season__1, IDL.Vec(ITeamWithPlayers)],
        [],
        ['oneway'],
      ),
    'addMatch' : IDL.Func([InputMatch], [Result_7], []),
    'addMatchToMvpsAdmin' : IDL.Func([Key__1], [], ['oneway']),
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
        [IDL.Vec(InputMatch), Key__1],
        [
          IDL.Record({
            'err' : IDL.Vec(IDL.Tuple(IDL.Bool, IDL.Text)),
            'succ' : IDL.Vec(IDL.Tuple(IDL.Bool, Match)),
          }),
        ],
        [],
      ),
    'addParticipant' : IDL.Func(
        [Key__1, Key__1, IDL.Int],
        [ReturnAddParticipant],
        [],
      ),
    'addPlayer' : IDL.Func([Player], [], ['oneway']),
    'addPlayerSquad' : IDL.Func([IPlayerSquad], [Result_2], []),
    'addPlayerStats' : IDL.Func([IPlayerStats], [IDL.Bool], []),
    'addPlayers' : IDL.Func([IDL.Vec(IPlayer__1)], [], ['oneway']),
    'addSeason' : IDL.Func([Season__1], [IDL.Bool], []),
    'addSeasons' : IDL.Func([IDL.Vec(ISeason)], [IDL.Bool], []),
    'addTeam' : IDL.Func([Team], [Team], []),
    'addTeamLogo' : IDL.Func([Key__1, IDL.Text], [Result_6], []),
    'addTeams' : IDL.Func([IDL.Vec(ITeam)], [IDL.Bool], []),
    'addTournament' : IDL.Func([Tournament__1], [], ['oneway']),
    'addTournaments' : IDL.Func([IDL.Vec(ITournament)], [IDL.Bool], []),
    'addUser' : IDL.Func([IUser], [Result], []),
    'adminResetPlayerSquadByTeamIds' : IDL.Func(
        [IDL.Vec(Key__1)],
        [],
        ['oneway'],
      ),
    'changeAllContestNames' : IDL.Func(
        [IDL.Record({ 'name' : IDL.Text })],
        [],
        ['oneway'],
      ),
    'changePaymentMethod' : IDL.Func([], [], []),
    'deleteAdminSetting' : IDL.Func([IDL.Text], [IDL.Opt(AdminSetting)], []),
    'finishMatch' : IDL.Func([MatchScore], [Result_2], []),
    'getAdminSetting' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(AdminSetting)],
        ['query'],
      ),
    'getAdminSettings' : IDL.Func([GetProps], [ReturnAdminSettings], ['query']),
    'getAdmins' : IDL.Func([], [Users], ['query']),
    'getAllParticipants' : IDL.Func([], [Participants], ['query']),
    'getAssetsOfUser' : IDL.Func([IDL.Text], [UserAssets__1], ['query']),
    'getBudget' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'getContest' : IDL.Func([Key__1], [IDL.Opt(Contest)], ['query']),
    'getContestNames' : IDL.Func(
        [IDL.Vec(Key__1)],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'getContestReward' : IDL.Func([], [IDL.Opt(AdminSetting)], ['query']),
    'getContestTypes' : IDL.Func([IDL.Bool], [RContestTypes], ['query']),
    'getContestWinnerOfMatch' : IDL.Func(
        [Key__1],
        [IDL.Opt(IDL.Tuple(Key__1, User))],
        ['query'],
      ),
    'getContestWithMatch' : IDL.Func(
        [Key__1],
        [
          IDL.Opt(
            IDL.Record({ 'match' : IDL.Opt(RefinedMatch), 'contest' : Contest })
          ),
        ],
        ['query'],
      ),
    'getContestsByIds' : IDL.Func(
        [IDL.Vec(Key__1)],
        [
          IDL.Vec(
            IDL.Record({
              'id' : Key__1,
              'paymentMethod' : Key,
              'isDistributed' : IDL.Bool,
              'teamsPerUser' : IDL.Nat,
              'name' : IDL.Text,
              'creatorUserId' : Key,
              'winner' : IDL.Opt(Key),
              'minCap' : IDL.Nat,
              'slots' : IDL.Nat,
              'rewardDistribution' : IDL.Vec(ContestRewardDistribution),
              'matchId' : Key,
              'slotsUsed' : IDL.Nat,
              'maxCap' : IDL.Nat,
              'entryFee' : IDL.Nat,
              'providerId' : MonkeyId,
              'rules' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getContestsByMatchId' : IDL.Func([Key__1], [Contests], ['query']),
    'getContestsWinnerUserByMatchId' : IDL.Func(
        [Key__1],
        [IDL.Opt(IDL.Tuple(Key__1, User))],
        ['query'],
      ),
    'getDatedUpcomingMatches' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(Match)],
        ['query'],
      ),
    'getDetailedMatchesContests' : IDL.Func(
        [GetProps],
        [ReturnDetailedMatchContests],
        ['query'],
      ),
    'getFilterdContests' : IDL.Func([GetProps], [ReturnContests], ['query']),
    'getFilterdRawPlayerSquadsByMatch' : IDL.Func(
        [IDL.Opt(Key__1), IDL.Opt(Key__1), GetProps],
        [ReturnTeams],
        ['query'],
      ),
    'getJoinedContests' : IDL.Func([], [MatchContests], ['query']),
    'getJoinedMatches' : IDL.Func(
        [Key__1],
        [IDL.Record({ 'matchesCount' : IDL.Int, 'joinedMatches' : IDL.Int })],
        ['query'],
      ),
    'getJoinedTeams' : IDL.Func(
        [GetProps],
        [IDL.Record({ 'result' : IDL.Vec(JoinedTeams), 'total' : IDL.Nat })],
        ['query'],
      ),
    'getListPlayerSquadsByMatch' : IDL.Func(
        [Key__1, IDL.Opt(Key__1)],
        [ListPlayerSquads],
        ['query'],
      ),
    'getMVPSMatches' : IDL.Func(
        [GetProps],
        [RMVPSTournamentMatchsList],
        ['query'],
      ),
    'getMVPSOfmatch' : IDL.Func(
        [Key__1],
        [IDL.Opt(IDL.Tuple(Key__1, MVPSPlayers))],
        ['query'],
      ),
    'getMatch' : IDL.Func([Key__1], [IDL.Opt(RefinedMatch)], ['query']),
    'getMatches' : IDL.Func(
        [GetProps, IDL.Opt(IDL.Int)],
        [ReturnMatches],
        ['query'],
      ),
    'getMatchesByDateLimit' : IDL.Func(
        [IDL.Nat, GetProps],
        [IDL.Vec(RMatch)],
        ['query'],
      ),
    'getMatchesByTeamId' : IDL.Func([Key__1], [Matches], ['query']),
    'getMatchesWithTournamentId' : IDL.Func(
        [GetProps, IDL.Opt(IDL.Int), IDL.Int, IDL.Opt(Key__1)],
        [ReturnMatches],
        ['query'],
      ),
    'getPaginatedContestsByMatchId' : IDL.Func(
        [Key__1, GetProps],
        [ReturnPagContests],
        ['query'],
      ),
    'getParticipants' : IDL.Func([Key__1], [Participants], ['query']),
    'getPlayer' : IDL.Func([Key__1], [IDL.Opt(Player)], ['query']),
    'getPlayerIdsByTeamIds' : IDL.Func(
        [IDL.Vec(Key__1)],
        [IDL.Vec(Key__1)],
        ['query'],
      ),
    'getPlayerPoints' : IDL.Func(
        [Key__1, Key__1],
        [IDL.Opt(RPoints__1)],
        ['query'],
      ),
    'getPlayerSquad' : IDL.Func(
        [Key__1],
        [IDL.Opt(RankPlayerSquad)],
        ['query'],
      ),
    'getPlayerSquadsByMatch' : IDL.Func(
        [Key__1],
        [RefinedPlayerSquads],
        ['query'],
      ),
    'getPlayerStats' : IDL.Func(
        [Key__1, Key__1],
        [IDL.Opt(PlayerStats)],
        ['query'],
      ),
    'getPlayerStatsByMatchId' : IDL.Func(
        [Key__1],
        [IDL.Vec(IDL.Tuple(Key__1, PlayerStatsWithName))],
        ['query'],
      ),
    'getPlayersByPosition' : IDL.Func([Position__1], [Result_5], ['query']),
    'getPlayersByTeamId' : IDL.Func([Key__1], [Result_4], ['query']),
    'getPlayersByTeamIds' : IDL.Func([IDL.Vec(Key__1)], [Result_4], ['query']),
    'getRawMatch' : IDL.Func([Key__1], [IDL.Opt(Match)], ['query']),
    'getRawPlayerSquadsByMatch' : IDL.Func(
        [IDL.Opt(Key__1), IDL.Opt(Key__1)],
        [PlayerSquads],
        ['query'],
      ),
    'getRewardPercentage' : IDL.Func([], [IDL.Nat], ['query']),
    'getRewardsTable' : IDL.Func(
        [
          IDL.Record({
            'slotsUsed' : IDL.Nat,
            'entryFee' : IDL.Nat,
            'props' : GetProps,
          }),
        ],
        [
          IDL.Record({
            'map' : IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat)),
            'total' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getSeasonByProvider' : IDL.Func(
        [MonkeyId, MonkeyId],
        [IDL.Opt(ISeason)],
        ['query'],
      ),
    'getSeasons' : IDL.Func([Key__1], [Seasons], ['query']),
    'getSeasonsN' : IDL.Func([Key__1, GetProps], [ReturnSeasons], ['query']),
    'getSquadWithPoints' : IDL.Func(
        [Key__1],
        [IDL.Opt(RefinedPlayerSquad)],
        ['query'],
      ),
    'getStatsSystem' : IDL.Func([], [Points], []),
    'getTeamById' : IDL.Func([Key__1], [IDL.Opt(Team)], ['query']),
    'getTeamByName' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Tuple(Key__1, Team))],
        ['query'],
      ),
    'getTeamsBySeason' : IDL.Func([Key__1], [Result_3], ['query']),
    'getTeamsByTournament' : IDL.Func([Key__1], [Result_3], ['query']),
    'getTopPlayers' : IDL.Func(
        [
          IDL.Record({
            'page' : IDL.Nat,
            'search' : IDL.Text,
            'limit' : IDL.Nat,
          }),
        ],
        [IDL.Record({ 'total' : IDL.Nat, 'players' : TopPlayers })],
        ['query'],
      ),
    'getTournamentByProvider' : IDL.Func(
        [MonkeyId],
        [IDL.Opt(ITournament)],
        ['query'],
      ),
    'getTournaments' : IDL.Func([], [Tournaments], ['query']),
    'getTournamentsN' : IDL.Func([GetProps], [ReturnTournaments], ['query']),
    'getUpcomingMatches' : IDL.Func(
        [GetProps, IDL.Nat],
        [ReturnMatches],
        ['query'],
      ),
    'getUser' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Opt(User)], ['query']),
    'getUserRank' : IDL.Func([Key__1], [IDL.Opt(MeAsTopPlayer)], ['query']),
    'increaseContestWon' : IDL.Func(
        [IDL.Record({ 'id' : Key__1, 'assetsVal' : IDL.Opt(IDL.Nat) })],
        [IDL.Bool],
        [],
      ),
    'increaseParticipant' : IDL.Func(
        [IDL.Record({ 'id' : Key__1, 'assetsVal' : IDL.Opt(IDL.Nat) })],
        [IDL.Bool],
        [],
      ),
    'increaseRewardsWon' : IDL.Func(
        [IDL.Record({ 'id' : Key__1, 'assetsVal' : IDL.Opt(IDL.Nat) })],
        [IDL.Bool],
        [],
      ),
    'increaseTotalEarning' : IDL.Func(
        [IDL.Record({ 'id' : Key__1, 'assetsVal' : IDL.Opt(IDL.Nat) })],
        [IDL.Bool],
        [],
      ),
    'makeAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'nDistributeRewards' : IDL.Func(
        [Key__1, Key__1],
        [ReturnAddParticipant],
        [],
      ),
    'nGetSquadRanking' : IDL.Func(
        [Key__1, GetProps],
        [ReturnRankings],
        ['query'],
      ),
    'postponeMatch' : IDL.Func([Key__1, MatchStatus__1], [IDL.Bool], []),
    'reScheduleMatch' : IDL.Func([Key__1, MatchStatus__1], [IDL.Bool], []),
    'removeContest' : IDL.Func([Key__1], [IDL.Opt(Contest)], []),
    'resetAndPopulateMatchDateIndex' : IDL.Func([], [], []),
    'testingGetMatches' : IDL.Func([], [Matches], ['query']),
    'testingGetPlayerSquads' : IDL.Func(
        [],
        [IDL.Record({ 'squads' : PlayerSquads, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'testingGetPlayersByProviderId' : IDL.Func(
        [MonkeyId],
        [IDL.Vec(IDL.Tuple(Key__1, Player))],
        [],
      ),
    'testingGetRewardPercentages' : IDL.Func(
        [],
        [
          IDL.Record({
            'platformPercentage' : IDL.Nat,
            'rewardableUsersPercentage' : IDL.Nat,
          }),
        ],
        [],
      ),
    'testingGetSeasons' : IDL.Func(
        [],
        [IDL.Record({ 'seasons' : Seasons, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'testingGetTeamByProviderId' : IDL.Func(
        [MonkeyId],
        [IDL.Opt(IDL.Tuple(Key__1, Team))],
        [],
      ),
    'testingIncreaseMatchTime' : IDL.Func([Key__1], [IDL.Opt(Match)], []),
    'testingRemove' : IDL.Func([], [], ['oneway']),
    'testingStartMatch' : IDL.Func([Key__1, IDL.Nat], [IDL.Opt(Match)], []),
    'transferPlayers' : IDL.Func([IDL.Vec(Transfer)], [IDL.Vec(IDL.Text)], []),
    'transform' : IDL.Func(
        [TransformArgs],
        [CanisterHttpResponsePayload],
        ['query'],
      ),
    'updateAdminSetting' : IDL.Func([IAdminSetting], [IDL.Bool], []),
    'updateContest' : IDL.Func([IContest, Key__1], [Result_2], []),
    'updateContestType' : IDL.Func(
        [Key__1, ContestType],
        [IDL.Opt(ContestType)],
        [],
      ),
    'updateMatchScore' : IDL.Func([MatchScore], [IDL.Bool], []),
    'updateMatchStatus' : IDL.Func([MatchStatus__1, Key__1], [IDL.Bool], []),
    'updatePlayerPrices' : IDL.Func(
        [IDL.Vec(IDL.Record({ 'id' : Key__1, 'fantasyPrice' : IDL.Nat }))],
        [IDL.Bool],
        [],
      ),
    'updatePlayerSquad' : IDL.Func([Key__1, IPlayerSquad], [Result_1], []),
    'updatePlayerStatus' : IDL.Func(
        [IDL.Vec(IPlayerStatus)],
        [IDL.Vec(IDL.Bool)],
        [],
      ),
    'updatePlayersStats' : IDL.Func(
        [IDL.Vec(IPlayerStats)],
        [IDL.Vec(IDL.Bool)],
        [],
      ),
    'updateRanking' : IDL.Func([Key__1], [], ['oneway']),
    'updateStatsSysteam' : IDL.Func([Points], [IDL.Bool], []),
    'updateUpcomingMatches' : IDL.Func(
        [IDL.Vec(InputMatch)],
        [
          IDL.Record({
            'err' : IDL.Vec(IDL.Tuple(IDL.Bool, IDL.Text)),
            'succ' : IDL.Vec(IDL.Tuple(IDL.Bool, IDL.Text)),
          }),
        ],
        [],
      ),
    'updateUser' : IDL.Func([IUser], [Result], []),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
  return FantasyFootball;
};
export const init = ({ IDL }) => {
  return [
    IDL.Record({
      'ledgerCanisterId' : IDL.Text,
      'ckbtcCanisterID' : IDL.Text,
      'transactionCanisterId' : IDL.Text,
    }),
  ];
};
