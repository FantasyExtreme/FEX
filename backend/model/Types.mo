import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";


module Types {
  public let TIME_DEVISOR = 1_000_000;
  public let MAX_LIMIT = 10;
  public let MAX_TRANS_LIMIT = 10;

  public type Key = Text;
  public type MonkeyId = Text;
  public type MatchStatus = Text;
  public type RMatches = [RMatch];
    public type RPoints = Int;
    public type Matches = [(Key, Match)];
  public type Tournaments = [(Key, Tournament)];
    public type Seasons = [(Key, Season)];
  public type AdminSettings = [(Key, AdminSetting)];


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
  public type Tournament = {
    providerId : MonkeyId;
    country : Text;
    name : Text;
    description : Text;
    startDate : Int;
    endDate : Int;
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
   public type Season = {
    seasonName : Text;
    startDate : Int;
    endDate : Int;
    tournamentId : Key;
    providerId : MonkeyId;
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
  };
   public type Team = {
    providerId : MonkeyId;
    name : Text;
    shortName : Text;
    logo : Text;
    seasonId : Key;
  };
    public type Teams = [(Key, Team)];

   public type RTournamentMatches = [RTournamentMatch];
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

    public type PlayerCount = {
    g : Int;
    m : Int;
    f : Int;
    d : Int;
  };

  public type GetProps = {
    search : Text;
    page : Nat;
    limit : Nat;
    status : Text;
  };
  public type Users = [(Key, User)];
 public type Players = [(Key, Player)];
  public type ISeason = {
    id : Key;
    seasonName : Text;
    startDate : Int;
    endDate : Int;
    tournamentId : Key;
    providerId : MonkeyId;
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
   public type ContestCommon = {
    providerId : MonkeyId;
    matchId : Key;
    name : Text;
    slots : Nat;
    minCap : Nat;
    maxCap : Nat;
    teamsPerUser : Nat;
    rules : Text;
  };
  public type Contest = ContestCommon and {
    creatorUserId : Key;
    slotsUsed : Nat;
  };
    public type Participant = {
    contestId : Key;
    userId : Key;
    squadId : Key;
    rank : Nat;
  };
    public type Participants = [(Key, Participant)];
public type IPlayerSquad = {
    // providerId : MonkeyId;
    name : Text;
    matchId : Key;
    cap : Key;
    viceCap : Key;
    players : [(Key, Bool)];
    formation : Text;
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
    public type PlayerSquad = PlayerSquadCommon and {
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
 public type PlayerSquads = [(Key, PlayerSquad)];
  public type ListPlayerSquads = [(Key, ListPlayerSquad)];
  public type RefinedPlayerSquads = [(Key, RefinedPlayerSquad)];
  public type RefinedPlayerSquadRankings = [(Key, RefinedPlayerSquadRanking)];
  public type RawPlayerSquads = [(Key, RawPlayerSquad)];
  public type ContestWithMatch = ContestCommon and {
    creatorUserId : Key;
    slotsUsed : Nat;
    homeTeamName : Text;
    awayTeamName : Text;
    awayScore : Nat;
    homeScore : Nat;
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
  };
  public type IContest = ContestCommon;
  public type ITournament = {
    id : Key;
    providerId : MonkeyId;
    country : Text;
    name : Text;
    description : Text;
    startDate : Int;
    endDate : Int;
  };
  public type ContestsWithId = [(Key, ContestWithMatch)];
 public type DetailedMatchContests = [DetailedMatchContest];
  public type RMatchContest = [MatchContest];
    public type MatchContests = [(Key, MatchContest)];
  public type Contests = [(Key, Contest)];
 public type RankPlayerSquad = RefinedPlayerSquad and {
    // providerId : MonkeyId;
    ranks : [(Key, Nat)];
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
    public let MAX_PLAYER_PER_SQUAD = 15;
 public let AdminSettings = {
    budget = "budget";
    platformPercentage = "platformPercentage";


  };
  public func generateNewRemoteObjectId() : Key {
    return Int.toText(Time.now());
  };
};
