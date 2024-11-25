import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import List "mo:base/List";

module Types {
  public let TIME_DEVISOR = 1_000_000;
  public let MAX_LIMIT = 10;
  public let MAX_TRANS_LIMIT = 10;

  public type Key = Text;
  public type MonkeyId = Text;
  public type RPoints = Int;
  public type MatchStatus = Text;
  public type GetProps = {
    search : Text;
    page : Nat;
    limit : Nat;
    status : Text;
  };
  public type Role = {
    #user;
    #admin;
  };
  public type User = {
    name : Text;
    joiningDate : Int;
    role : Role;
    email : Text;
  };
  public type ISeason = {
    id : Key;
    seasonName : Text;
    startDate : Int;
    endDate : Int;
    tournamentId : Key;
    providerId : MonkeyId;
  };
  public type Season = {
    seasonName : Text;
    startDate : Int;
    endDate : Int;
    tournamentId : Key;
    providerId : MonkeyId;
  };
  public type IUser = {
    name : Text;
    email : Text;
  };
  public type Position = {
    #goalKeeper;
    #defender;
    #midfielder;
    #forward;
  };
  public type Team = {
    providerId : MonkeyId;
    name : Text;
    shortName : Text;
    logo : Text;
    seasonId : Key;
  };
  public type ITeam = {
    providerId : MonkeyId;
    name : Text;
    shortName : Text;
    logo : Text;
    seasonId : Key;
    id : Text;
  };
  public type ITeamWithPlayers = {
    providerId : MonkeyId;
    name : Text;
    shortName : Text;
    logo : Text;
    seasonId : Key;
    id : Text;
    players : [IPlayer];
  };
  public type Match = {
    providerId : MonkeyId;
    homeTeam : Key;
    awayTeam : Key;
    time : Int;
    location : Text;
    seasonId : Key;
    status : MatchStatus;
    homeScore : Nat;
    awayScore : Nat;
  };
  public type ContestType = {
    name : Text;
    entryFee : Nat;
    color : Text;
    isActive : Bool;
    time : Int;
    status : Text;
  };
  public type RContestType = ContestType and {
    id : Text;
  };
  public type RMatch = {
    providerId : MonkeyId;
    homeTeam : Key;
    awayTeam : Key;
    time : Int;
    location : Text;
    seasonId : Key;
    status : MatchStatus;
    id : Key;
    homeScore : Nat;
    awayScore : Nat;
  };
  public type TempTournamentMatch = {
    providerId : MonkeyId;
    homeTeam : Key;
    awayTeam : Key;
    time : Int;
    location : Text;
    seasonId : Key;
    status : MatchStatus;
    id : Key;
    homeScore : Nat;
    awayScore : Nat;
  };
  public type RTournamentMatch = TempTournamentMatch and {
    tournamentId : Key;
    tournamentName : Text;
      isRewardable  : Bool;
  };

  public type RefinedMatch = {
    providerId : MonkeyId;
    homeTeam : (Key, ?Team);
    awayTeam : (Key, ?Team);
    time : Int;
    location : Text;
    seasonId : Key;
    status : MatchStatus;
    homeScore : Nat;
    awayScore : Nat;
  };
  public type RMVPSTournamentMatch = { matchId : Key } and RefinedMatch and {
    mvps : ?(Key, MVPSPlayers);
    contestWinner : ?(Key, User);
  };
  public type InputMatch = {
    providerId : MonkeyId;
    homeTeamName : Text;
    awayTeamName : Text;
    time : Int;
    location : Text;
    id : Text;
    seasonId : Key;
    status : MatchStatus;
    homeScore : Nat;
    awayScore : Nat;
  };
  public type PlayerCount = {
    g : Int;
    m : Int;
    f : Int;
    d : Int;
  };
  public type Player = {
    providerId : MonkeyId;
    active : Bool;
    name : Text;
    country : Text;
    position : Position;
    teamId : Key;
    fantasyPrice : Nat;
    isPlaying : Bool;
    isSub : Bool;
    number : Nat;
    photo : Text;
    points : ?RPoints;
  };
  public type PlayerS = {
    providerId : MonkeyId;
    active : Bool;
    name : Text;
    country : Text;
    position : Position;
    teamId : Key;
    fantasyPrice : Nat;
    points : ?RPoints;
    isPlaying : Bool;
    isSub : Bool;
    number : Nat;
    photo : Text;
  };
  public type IPlayer = {
    providerId : MonkeyId;
    id : Key;
    name : Text;
    country : Text;
    position : Position;
    teamId : Key;
    fantasyPrice : Nat;
    number : Nat;
    photo : Text;
  };
  public type IPlayerStatus = {
    id : Key;
    isPlaying : Bool;
    isSub : Bool;
  };

  public type ITournament = {
    id : Key;
    providerId : MonkeyId;
    country : Text;
    name : Text;
    description : Text;
    startDate : Int;
    endDate : Int;
  };
  public type Tournament = {
    providerId : MonkeyId;
    country : Text;
    name : Text;
    description : Text;
    startDate : Int;
    endDate : Int;
  };
  public type PlayerSquadCommon = {
    userId : Key;
    name : Text;
    matchId : Key;
    cap : Key;
    viceCap : Key;
    formation : Text;
    creation_time : Int;
    rank : Nat;
    points : RPoints;
    hasParticipated : Bool;
  };
  public type MatchScore = {
    id : Key;
    homeScore : Nat;
    awayScore : Nat;
    status : MatchStatus;
  };

  public type PlayerSquad = PlayerSquadCommon and {
    players : [(Key, Bool)];
  };
  public type PointsPlayerSquad = PlayerSquadCommon and {
    // providerId : MonkeyId;
    players : [(Key, Bool)];
  };
  public type ListPlayerSquad = PlayerSquadCommon and {
    points : RPoints;
    joinedContestsName : [Text];
  };
  public type RefinedPlayerSquad = PlayerSquadCommon and {
    // providerId : MonkeyId;
    players : [(Key, PlayerS, Bool)];
  };
  public type RankPlayerSquad = RefinedPlayerSquad and {
    // providerId : MonkeyId;
    ranks : [(Key, Nat)];
  };
  public type RefinedPlayerSquadRanking = {
    // providerId : MonkeyId;
    userId : Key;
    name : Text;
    matchId : Key;
    points : RPoints;
    creation_time : Int;
    rank : Nat;
  };
  public type RawPlayerSquad = PlayerSquadCommon and {
    matchTime : Int;
    points : RPoints;
    matchName : Text;
  };
  public type IPlayerSquad = {
    // providerId : MonkeyId;
    name : Text;
    matchId : Key;
    cap : Key;
    viceCap : Key;
    players : [(Key, Bool)];
    formation : Text;
  };
  public type ContestRewardDistribution = {
    from : Nat;
    to : Nat; // null if it's for a single user
    amount : Int;
  };
  public type ContestCommon = {
    providerId : MonkeyId;
    matchId : Key;
    name : Text;
    slots : Nat;
    rewardDistribution : [ContestRewardDistribution];
    entryFee : Nat;
    minCap : Nat;
    maxCap : Nat;
    teamsPerUser : Nat;
    isDistributed : Bool;
    rules : Text;
    paymentMethod: Key;
  };
  public type Contest = ContestCommon and {
    creatorUserId : Key;
    slotsUsed : Nat;
    winner : ?Key;
  };
  

  public type ContestWithMatch = ContestCommon and {
    creatorUserId : Key;
    slotsUsed : Nat;
    homeTeamName : Text;
    awayTeamName : Text;
    awayScore : Nat;
    homeScore : Nat;
    winner : ?Key;
  };
  public type ContestWinner=User and {
     entryFee : Nat;
  };
  public type DetailedContest = Contest and {
    teamsJoinedContest : Nat;
    teamsCreatedOnContest : Nat;

  };

  public type ContestArray = [DetailedContest];
  public type DetailedMatchContest = RMatch and {
    latest : Bool;
    contests : ContestArray;
    providerId : Key;
    teamsCreated : Nat;
    teamsJoined : Nat;
  };
  // Contest with matchName
  public type MatchContest = Contest and {
    matchName : Text;
    homeTeamName : Text;
    awayTeamName : Text;
    awayScore : Nat;
    homeScore : Nat;
    firstPrize : Nat;
  };
  public type IContest = ContestCommon;
  public type Participant = {
    contestId : Key;
    userId : Key;
    squadId : Key;
    transactionId : Key;
    isRewarded : Bool;
    rank : Nat;
  };
     public type MatchTeamsInfo = {
   leagueName:Text;
    homeTeamName:Text;
    awayTeamName:Text;
    awayScore : Nat;
    homeScore : Nat;
    homeTeamLogo:Text;
    awayTeamLogo:Text;
    matchTime : Int;
    matchId:Key;

     };
   public type JoinedTeams =MatchTeamsInfo and {
    contestId : Key;
    contestName:Text;
    squadId : Key;
    squadName : Text;
    rank : Nat;
     

  };
  public type Ranking = {
    squad : [{
      squadId : Key;
      points : RPoints;
      rank : Nat;
    }];
  };
  // The key for reward should be the uerId + contestId
  public type Reward = {
    contestId : Key;
    userId : Key;
    amount : Nat;
    transactionId : ?Key;
    creation_time : Int;
    claim_time : ?Int;
    isClaimed : Bool;
  };
  public type ReturnReward = Reward and {
    id : Key;
  };
  type Shots = {
    shots_total : Int;
    shots_on_goal : Int;
  };

  type Goals = {
    scored : Int;
    assists : Int;
    conceded : Int;
    owngoals : Int;
    team_conceded : Int;
  };

  type Fouls = {
    drawn : Int;
    committed : Int;
  };

  type Cards = {
    yellowcards : Int;
    redcards : Int;
    yellowredcards : Int;
  };

  type Passing = {
    total_crosses : Int;
    crosses_accuracy : Int;
    passes : Int;
    accurate_passes : Int;
    passes_accuracy : Int;
    key_passes : Int;
  };

  type Dribbles = {
    attempts : Int;
    success : Int;
    dribbled_past : Int;
  };

  type Duels = {
    total : Int;
    won : Int;
  };

  type Other = {
    aerials_won : Int;
    punches : Int;
    offsides : Int;
    saves : Int;
    inside_box_saves : Int;
    pen_scored : Int;
    pen_missed : Int;
    pen_saved : Int;
    pen_committed : Int;
    pen_won : Int;
    hit_woodwork : Int;
    tackles : Int;
    blocks : Int;
    interceptions : Int;
    clearances : Int;
    dispossesed : Int;
    minutes_played : Int;
  };

  public type PlayerStats = {
    playerId : Key;
    matchId : Key;
    stats : {
      shots : Shots;
      goals : Goals;
      fouls : Fouls;
      cards : Cards;
      passing : Passing;
      dribbles : Dribbles;
      duels : Duels;
      other : Other;
    };
    rating : Text;
  };
  public type PlayerStatsWithName = PlayerStats and {
    name : Text;
  };

  public type Points = {
    shots : Shots;
    goals : Goals;
    fouls : Fouls;
    cards : Cards;
    passing : Passing;
    dribbles : Dribbles;
    duels : Duels;
    other : Other;
  };
  public type IPlayerStats = {
    playerId : Key;
    matchId : Key;
    stats : {
      shots : Shots;
      goals : Goals;
      fouls : Fouls;
      cards : Cards;
      passing : Passing;
      dribbles : Dribbles;
      duels : Duels;
      other : Other;
    };
    rating : Text;
  };

  public type AdminSetting = {
    settingType : Text;
    settingValue : Text;
    settingName : Text;
    creation_date : Int;
    modification_date : Int;
    last_modified_by : Key;
  };
  public type IAdminSetting = {
    settingType : Text;
    settingValue : Text;
    settingName : Text;
  };
  public type LedgerId = Text;
  public type PaymentMethod = {
    name : Text;
    ledgerId: LedgerId;
    creation_date : Int;
    modification_date : Int;
    last_modified_by : Key;
  };
  public type ContestWithFirstPrize = Contest and {
  firstPrize : Nat;
};
  public type MyObjects = User or Player or Team or Match or Tournament or PlayerSquad or Contest or Participant;
  public type Users = [(Key, User)];
  public type Teams = [(Key, Team)];
  public type Matches = [(Key, Match)];

  public type RMatches = [RMatch];
  public type RTournamentMatches = [RTournamentMatch];
  public type RMVPSTournamentMatchs = [RMVPSTournamentMatch];
  public type RefinedMatches = [(Key, RefinedMatch)];
  public type Players = [(Key, Player)];
  public type Tournaments = [(Key, Tournament)];
  public type PlayerSquads = [(Key, PlayerSquad)];
  public type ListPlayerSquads = [(Key, ListPlayerSquad)];
  public type RefinedPlayerSquads = [(Key, RefinedPlayerSquad)];
  public type RefinedPlayerSquadRankings = [(Key, RefinedPlayerSquadRanking)];
  public type RawPlayerSquads = [(Key, RawPlayerSquad)];
  public type Contests = [(Key, Contest)];
  public type ContestsWithId = [(Key, ContestWithMatch)];
  public type MatchContests = [(Key, MatchContest)];
  public type DetailedMatchContests = [DetailedMatchContest];
  public type RMatchContest = [MatchContest];
  public type Participants = [(Key, Participant)];
  public type Rewards = [(Key, Reward)];
  public type PlayersStats = [(Key, PlayerStats)];
  public type AdminSettings = [(Key, AdminSetting)];
  public type Seasons = [(Key, Season)];
  public type ContestTypes = [(Key, ContestType)];
  public type RContestTypes = [RContestType];
  public type PaymentMethods = [(LedgerId,PaymentMethod)]; 
  public type PlugPrincipalMap = [(Key, Key)];

  public func generateNewRemoteObjectId() : Key {
    return Int.toText(Time.now());
  };
  // Ledger types
  public type SubAccount = Blob;
  public type Icrc1Timestamp = Nat64;
  public type Icrc1Tokens = Nat;
  public type Icrc1BlockIndex = Nat;

  public type Account = {
    owner : Principal;
    subaccount : ?SubAccount;
  };
  public type TransferFromArgs = {
    spender_subaccount : ?SubAccount;
    from : Account;
    to : Account;
    amount : Icrc1Tokens;
    fee : ?Icrc1Tokens;
    memo : ?Blob;
    created_at_time : ?Icrc1Timestamp;
  };
  public type TransferFromResult = {
    #Ok : Icrc1BlockIndex;
    #Err : TransferFromError;
  };

  public type TransferFromError = {
    #BadFee : { expected_fee : Icrc1Tokens };
    #BadBurn : { min_burn_amount : Icrc1Tokens };
    #InsufficientFunds : { balance : Icrc1Tokens };
    #InsufficientAllowance : { allowance : Icrc1Tokens };
    #TooOld;
    #CreatedInFuture : { ledger_time : Icrc1Timestamp };
    #Duplicate : { duplicate_of : Icrc1BlockIndex };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };

  // Fantasy transection history
  public type TransactionType = {
    #send;
    #receive;
    #pending;
    #rejected;
  };
  public type Transaction = {
    user : Principal;
    from : Principal;
    to : Principal;
    amount : Icrc1Tokens;
    created_at_time : Int;
    contestId : Text;
    transaction_type : TransactionType;
    title : Text;
  };
  public type GetAllTransactionProps = {
    userId : ?Principal;
    contestId : ?Text;
    page : Nat;
    limit : Nat;
  };
  public type ReturnTransactions = { total : Nat; transaction : Transactions };
  public type UserAssets = {
    participated : Nat;
    contestWon : Nat;
    rewardsWon : Nat;
    totalEarning : Nat;

  };
  public type UserNftRecord= {
    nftCount : Nat;
    userId : Key;
    isClaimed : Bool;
    claimedDate : ?Int;
    winningDate : Int;


  };
    public type JoinedMatchesRecord= {
    joinedMatches : List.List<Text>;
    totalMatches : Int;
    isAirDropTaken : Bool;
  };
  public type Transfer = {
    playerId : MonkeyId;
    teamId : MonkeyId;
    isActive : Bool;
    player : IPlayer;
  };
  public type TopPlayer = {
    name : Text;
    joiningDate : Int;
    role : Role;
    email : Text;
    assets : UserAssets;
  };
  public type MatchesDateIndex = {
    matchId : Key;
  };
  public type MeAsTopPlayer = TopPlayer and {
    rank : Nat;
  };
  public type MVPSPlayers = {
    name : Text;
    number : Int;
    photo : Text;
  };

  public type Timestamp = Nat64;

  //1. Type that describes the Request arguments for an HTTPS outcall
  //See: /docs/current/references/ic-interface-spec#ic-http_request
  public type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : HttpMethod;
    transform : ?TransformRawResponseFunction;
  };

  public type HttpHeader = {
    name : Text;
    value : Text;
  };

  public type HttpMethod = {
    #get;
    #post;
    #head;
  };

  public type HttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };
  public type TransformRawResponseFunction = {
    function : shared query TransformArgs -> async HttpResponsePayload;
    context : Blob;
  };

  //2.2 These types describes the arguments the transform function needs
  public type TransformArgs = {
    response : HttpResponsePayload;
    context : Blob;
  };

  public type CanisterHttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };

  public type TransformContext = {
    function : shared query TransformArgs -> async HttpResponsePayload;
    context : Blob;
  };

  //3. Declaring the management canister which you use to make the HTTPS outcall
  public type IC = actor {
    http_request : HttpRequestArgs -> async HttpResponsePayload;
  };

  public type TopPlayers = [(Key, TopPlayer)];

  public type UsersAssets = [(Key, UserAssets)];

  public type Transactions = [(Key, Transaction)];

  // public let LEDGER_CANISTER_ID = "a4h2j-nqaaa-aaaam-ac3oq-cai";
  // public let TRANSACTION_CANISTER_ID = "wuw65-wiaaa-aaaam-ac7jq-cai";

  public let Default_Contest = {
    name = "Free";
    slots = 1000;
    entryFee = 0;
    teamsPerUser = 3;
    minCap = 100;
    maxCap = 0;
    providerId = "0";
    rewardDistribution : [ContestRewardDistribution] = [];
    rules = "No entry fee,
             Max limit for teams per user is 3";
    paymentMethod = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  };
  public let GAS_FEE = 10_000;
  public let MASTER_WALLET = "jfwt3-ckdh5-mv6s4-skjlw-cnh6l-qfpvs-v6wia-l2yap-z5diw-xskgi-uqe";

  // below testing
  // public let MASTER_WALLET = "cczcu-p2j5b-sgza5-dwrgs-luwwf-3giid-y4xgi-hyt34-ry4xk-7pv6p-vqe";
  public let ADMIN_WALLET = "23ojo-5fduj-boqrl-jokfi-glfug-ekijl-z6vyp-lbhju-hmiew-7ur3v-3qe";

  public let MAX_PLAYER_PER_SQUAD = 15;
  public let AdminSettings = {
    budget = "budget";
    platformPercentage = "platformPercentage";
    rewardableUsersPercentage = "rewardableUsersPercentage";
   

  };
  /// 0 - direct distribution all the users will be rewarded
  /// 1 - completedTierWeighted distribution 40% of the users will be rewarded and are devided into 10 tiers
  /// 2 - reducededTierWeighted 40% of the users will be rewarded and are devided into less then 10 tiers
  public let DistributionAlgo = {
    direct = 0;
    completedTierWeighted = 1;
    reducededTierWeighted = 2;
  };
    public let Date_In_Miliseconds={
   september15=1726340400000;
   november15 = 1731610800000;
  };
  public let MatchStatuses = {
    finished = "Match Finished";
    postponed = "Match Postponed";
  };

 
  public let NEXT_PUBLIC_API_URL = "https://wrapper.fantasyextreme.org/v1/service/";
  public let ICP_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

};
