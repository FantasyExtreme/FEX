import Int "mo:base/Int";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Order "mo:base/Order";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
import Hash "mo:base/Hash";
import Prim "mo:prim";
import Types "../model/Types";
import FantasyStoreHelper "../helper/FantasyStoreHelper";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";
import Error "mo:base/Error";
import Int64 "mo:base/Int64";
import List "mo:base/List";
import FunctionalStableHashMap "mo:StableHashMap/FunctionalStableHashMap";
import Validation "../model/Validation";

shared ({ caller = initializer }) actor class FantasyFootball(init : { ledgerCanisterId : Text; ckbtcCanisterID : Text; transactionCanisterId : Text }) = this {

  type Key = Types.Key;
  type User = Types.User;
  type IUser = Types.IUser;
  type Team = Types.Team;
  type ITeamWithPlayers = Types.ITeamWithPlayers;
  type ITeam = Types.ITeam;
  type Match = Types.Match;
  type RMatch = Types.RMatch;
  type RTournamentMatch = Types.RTournamentMatch;
  type RefinedMatch = Types.RefinedMatch;
  type InputMatch = Types.InputMatch;
  type Player = Types.Player;
  type PlayerS = Types.PlayerS;
  type IPlayer = Types.IPlayer;
  type Tournament = Types.Tournament;
  type ITournament = Types.ITournament;
  type MatchStatus = Types.MatchStatus;
  type Season = Types.Season;
  type ISeason = Types.ISeason;
  type Position = Types.Position;
  type PlayerCount = Types.PlayerCount;
  type PlayerSquad = Types.PlayerSquad;
  type PointsPlayerSquad = Types.PointsPlayerSquad;
  type RefinedPlayerSquad = Types.RefinedPlayerSquad;
  type RefinedPlayerSquadRanking = Types.RefinedPlayerSquadRanking;
  type RawPlayerSquad = Types.RawPlayerSquad;
  type ListPlayerSquad = Types.ListPlayerSquad;
  type IPlayerSquad = Types.IPlayerSquad;
  type Contest = Types.Contest;
  type MatchContest = Types.MatchContest;
  type DetailedMatchContest = Types.DetailedMatchContest;
  type DetailedMatchContests = Types.DetailedMatchContests;
  type ContestArray = Types.ContestArray;
  type ContestType = Types.ContestType;
  type JoinedTeams = Types.JoinedTeams;
  type MatchTeamsInfo = Types.MatchTeamsInfo;

  type JoinedMatchesRecord = Types.JoinedMatchesRecord;

  type IContest = Types.IContest;
  type Participant = Types.Participant;
  type IPlayerStats = Types.IPlayerStats;
  type PlayerStats = Types.PlayerStats;
  type Points = Types.Points;
  type RPoints = Types.RPoints;
  type GetProps = Types.GetProps;
  type Transaction = Types.Transaction;
  type ContestTypes = Types.ContestTypes;
  type ContestWinner = Types.ContestWinner;
  type ContestWithFirstPrize = Types.ContestWithFirstPrize;
  type JoinedTeamsRecords = [(Key, JoinedTeams)];
  type JoinedMatchesRecords = [(Key, JoinedMatchesRecord)];

  // Ledger types

  type Account = Types.Account;
  type TransferFromArgs = Types.TransferFromArgs;
  type TransferFromResult = Types.TransferFromResult;
  type TransferFromError = Types.TransferFromError;

 
  // Return types
  type ReturnMatches = { matches : RTournamentMatches; total : Nat };
  type RMVPSTournamentMatchsList = {
    matches : RMVPSTournamentMatchs;
    total : Nat;
  };

  type ReturnDetailedMatchContests = {
    matches : DetailedMatchContests;
    total : Nat;
  };
  type ReturnTeams = { teams : RawPlayerSquads; total : Nat };
  type ReturnContests = { contests : MatchContests; total : Nat };
  type ReturnSeasons = { seasons : Seasons; total : Nat };
  type ReturnTournaments = { tournaments : Tournaments; total : Nat };
  type ReturnPagContests = {
    contests : [(Key, ContestWithFirstPrize)];
    total : Nat;
  };
  type ReturnRankings = {
    rankings : RefinedPlayerSquadRankings;
    userRank : ?(Key, RefinedPlayerSquadRanking);
    total : Nat;
  };
  type ReturnAdminSettings = { settings : AdminSettings; total : Nat };
  type ReturnAddParticipant = Result.Result<Text, TransferFromError>;

  type Users = Types.Users;
  type Matches = Types.Matches;
  type RMatches = Types.RMatches;
  type RTournamentMatches = Types.RTournamentMatches;
  type RMVPSTournamentMatchs = Types.RMVPSTournamentMatchs;
  type RMVPSTournamentMatch = Types.RMVPSTournamentMatch;
  type Teams = Types.Teams;
  type Players = Types.Players;
  type Tournaments = Types.Tournaments;
  type Seasons = Types.Seasons;
  type PlayerSquads = Types.PlayerSquads;
  type RefinedPlayerSquads = Types.RefinedPlayerSquads;
  type RefinedPlayerSquadRankings = Types.RefinedPlayerSquadRankings;
  type RawPlayerSquads = Types.RawPlayerSquads;
  type ListPlayerSquads = Types.ListPlayerSquads;
  type Contests = Types.Contests;
  type ContestsWithId = Types.ContestsWithId;
  type MatchContests = Types.MatchContests;
  type RMatchContest = Types.RMatchContest;
  type Participants = Types.Participants;
  type PlayersStats = Types.PlayersStats;
  type IPlayerStatus = Types.IPlayerStatus;
  type UsersAssets = Types.UsersAssets;
  type UserAssets = Types.UserAssets;
  type TopPlayers = Types.TopPlayers;
  type MeAsTopPlayer = Types.MeAsTopPlayer;

  type TopPlayer = Types.TopPlayer;
  type AdminSettings = Types.AdminSettings;
  type AdminSetting = Types.AdminSetting;
  type IAdminSetting = Types.IAdminSetting;
  type MVPSPlayers = Types.MVPSPlayers;


  var TIME_DEVISOR = Types.TIME_DEVISOR;
  var MAX_LIMIT = Types.MAX_LIMIT;
  var Date_In_Miliseconds = Types.Date_In_Miliseconds;

  stable var stable_users : Users = [];
  stable var stable_matches : Matches = [];
  stable var stable_teams : Teams = [];
  stable var stable_players : Players = [];
  stable var stable_tournaments : Tournaments = [];
  stable var stable_seasons : Seasons = [];
  stable var stable_playerSquads : PlayerSquads = [];
  stable var stable_contests : Contests = [];
  stable var stable_participants : Participants = [];
  stable var stable_playersStats : PlayersStats = [];
  stable var stable_userStats : UsersAssets = [];
  stable var stable_adminSettings : AdminSettings = [];
  stable var mvps_matches_ids : [Key] = [];
  stable var stable_contestTypes : ContestTypes = [];
  stable var stable_joined_matches : JoinedMatchesRecords = [];



  // stable var matchDateIndexStorage = FunctionalStableHashMap.init<Int, List.List<Text>>();
  stable var matchDateIndex = FunctionalStableHashMap.init<Int, List.List<Text>>();
  // it will store matches which user has joined during spacific time period for nft distribution
  stable var joinedMatchesOfUser = FunctionalStableHashMap.init<Key, List.List<(Text, Int)>>();

  var contestPaymentArray = [("0", init.ledgerCanisterId), ("", init.ledgerCanisterId), ("1", init.ckbtcCanisterID)];
  var contestPaymentMap = Map.fromIter<Text, Text>(contestPaymentArray.vals(), 2, Text.equal, Text.hash);

  stable var stableUserNameCount : Nat = 200;



  var userStorage = Map.fromIter<Key, User>(stable_users.vals(), 0, Text.equal, Text.hash);
  var matchStorage = Map.fromIter<Key, Match>(stable_matches.vals(), 0, Text.equal, Text.hash);
  var teamStorage = Map.fromIter<Key, Team>(stable_teams.vals(), 0, Text.equal, Text.hash);
  var playerStorage = Map.fromIter<Key, Player>(stable_players.vals(), 0, Text.equal, Text.hash);
  var tournamentStorage = Map.fromIter<Key, Tournament>(stable_tournaments.vals(), 0, Text.equal, Text.hash);
  var seasonStorage = Map.fromIter<Key, Season>(stable_seasons.vals(), 0, Text.equal, Text.hash);
  var playerSquadStorage = Map.fromIter<Key, PlayerSquad>(stable_playerSquads.vals(), 0, Text.equal, Text.hash);
  var contestStorage = Map.fromIter<Key, Contest>(stable_contests.vals(), 0, Text.equal, Text.hash);
  var participantStorage = Map.fromIter<Key, Participant>(stable_participants.vals(), 0, Text.equal, Text.hash);
  var playersStatsStorage = Map.fromIter<Key, PlayerStats>(stable_playersStats.vals(), 0, Text.equal, Text.hash);
  var userStatsStorage = Map.fromIter<Key, UserAssets>(stable_userStats.vals(), 0, Text.equal, Text.hash);
  var adminSettingStorage = Map.fromIter<Key, AdminSetting>(stable_adminSettings.vals(), 0, Text.equal, Text.hash);
  var contestTypeStorage = Map.fromIter<Key, ContestType>(stable_contestTypes.vals(), 0, Text.equal, Text.hash);
  var userJoinedMatchedStorage = Map.fromIter<Key, JoinedMatchesRecord>(stable_joined_matches.vals(), 0, Text.equal, Text.hash);

 
  // user taks storage

  let adminPrincipal = Principal.fromText(Types.MASTER_WALLET);
  let oneWeekInMilli = 7 * 24 * 60 * 60 * 1_000;
  let milisecondsInOneDay = 24 * 60 * 60 * 1000;

  stable var rewardPercentage = 80;
  // TODO change this when going into production and also add the api's identity as admin
  // always add the canisterId of the canister (yes you will have to deploy it first to get an id)
  let initAdmins = ["bkyz2-fmaaa-aaaaa-qaaaq-cai", "6l2of-d4yuy-o6apb-sbf24-5hqud-cgi6r-6djdz-jxnfy-nawlj-acoar-pqe", "3urfu-3ny5k-f5v65-z3ml4-rb5l2-efo5d-3chvs-c7sk5-kd5qu-sahw6-gqe"];
  stable var stable_points : Points = {
    shots = { shots_total = 1; shots_on_goal = 2 };
    goals = {
      scored = 10;
      assists = 6;
      conceded = -2;
      owngoals = -3;
      team_conceded = 0;
    };
    fouls = { drawn = 2; committed = -2 };
    cards = { yellowcards = -3; redcards = -5; yellowredcards = 0 };
    passing = {
      total_crosses = 2;
      crosses_accuracy = 0;
      passes = 1;
      accurate_passes = 2;
      passes_accuracy = 0;
      key_passes = 5;
    };
    dribbles = { attempts = 1; success = 5; dribbled_past = 3 };
    duels = { total = 0; won = 2 };
    other = {
      aerials_won = 3;
      punches = 0;
      offsides = -1;
      saves = 2;
      inside_box_saves = 3;
      pen_scored = 7;
      pen_missed = -5;
      pen_saved = 7;
      pen_committed = 0;
      pen_won = 3;
      hit_woodwork = 3;
      tackles = 3;
      blocks = 5;
      interceptions = 3;
      clearances = 1;
      dispossesed = -3;
      minutes_played = 0;
    };
  };
  // Auth
  private func onlyUser(id : Principal) {
    assert not Principal.isAnonymous(id);
    let user = userStorage.get(Principal.toText(id));
    Debug.print(debug_show (user, id));
    switch (user) {
      case (?_) {};
      case (null) {
        assert false;
      };
    };
  };
  private func thisUser(id : Text, id2 : Text) {
    assert id == id2;
  };
  private func onlyAdmin(id : Principal) {
    assert not Principal.isAnonymous(id);
    let user = userStorage.get(Principal.toText(id));
    switch (user) {
      case (?is) {
        switch (is.role) {
          case (#admin) {};
          case (_) {
            assert false;
          };
        };
      };
      case (null) {
        assert false;
      };
    };
  };
  private func checkMatchCompleted(status : Text) : Bool {
    if (status == "Match Finished") return true else return false;
  };
  // Indexing
  private func hashInt(n : Int) : Hash.Hash {
    Text.hash(Int.toText(n));
  };
  private func getMilliSecondsInDay() : Nat {
    return (24 * 3600 * 1_000);
  };
  private func getNanoSecondsInDay() : Nat {
    return (24 * 3600 * 1_000_000);
  };
  private func millisecondsToDays(milliseconds : Int) : Nat {
    let positiveMilliseconds = Int.abs(milliseconds);
    return positiveMilliseconds / getMilliSecondsInDay();
  };
  private func addMatchDateIndex(matchTime : Int, matchId : Key) {
    let day = millisecondsToDays(matchTime);
    switch (FunctionalStableHashMap.get(matchDateIndex, Int.equal, hashInt, day)) {
      case (null) FunctionalStableHashMap.put(matchDateIndex, Int.equal, hashInt, day, List.make(matchId));
      case (?list) FunctionalStableHashMap.put(matchDateIndex, Int.equal, hashInt, day, List.push(matchId, list));
    };
  };
  public func resetAndPopulateMatchDateIndex() : async () {
    matchDateIndex := FunctionalStableHashMap.init<Int, List.List<Text>>(); // Reset matchDateIndex
    for ((matchId, match) in matchStorage.entries()) {
      let matchTime = match.time;
      addMatchDateIndex(matchTime, matchId);
    };
  };
  private func isDayIsFriday(timestampMs : Int) : Bool {
    let timestampS = timestampMs / 1000;
    let daysSinceEpoch = (timestampS / 86400) + 4;
    let dayOfWeek = daysSinceEpoch % 7;
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[Int.abs(dayOfWeek)];
    if (day == "Friday") return true;
    return false;
  };

  public query func getDatedUpcomingMatches(startTime : Nat, endTime : Nat) : async [Match] {
    var result = Buffer.Buffer<Match>(100);

    let startDay = millisecondsToDays(startTime);
    let endDay = millisecondsToDays(endTime);

    for (day in Iter.range(startDay, endDay)) {
      switch (FunctionalStableHashMap.get(matchDateIndex, Int.equal, hashInt, day)) {
        case (null) {};
        case (?list) {
          for (id in List.toIter(list)) {
            switch (matchStorage.get(id)) {
              case (null) {};
              case (?match) {
                result.add(match);
              };
            };
          };
        };
      };
    };
    return Buffer.toArray(result);
  };
  public query func getMatchesByDateLimit(startTime : Nat, props : GetProps) : async [RMatch] {
    var result = Buffer.Buffer<RMatch>(100);
    let startDay = millisecondsToDays(startTime);
    var matchCount = 0;
    let startIndex = props.page * props.limit;
    let endIndex = startIndex + props.limit;

    switch (props.status) {
      case "2" {
        // This case get matches which are completed

        switch (FunctionalStableHashMap.get(matchDateIndex, Int.equal, hashInt, startDay)) {
          case (null) {};
          case (?list) {
            label breakloop for (id in List.toIter(list)) {
              if (matchCount >= endIndex) {
                break breakloop;
              };
              switch (matchStorage.get(id)) {
                case (null) {};
                case (?match) {
                  if (matchCount >= startIndex) {
                    let rMatch : RMatch = {
                      providerId = match.providerId;
                      homeTeam = match.homeTeam;
                      awayTeam = match.awayTeam;
                      time = match.time;
                      location = match.location;
                      seasonId = match.seasonId;
                      status = match.status;
                      id = id;
                      homeScore = match.homeScore;
                      awayScore = match.awayScore;
                    };
                    result.add(rMatch);
                  };
                  matchCount += 1;
                };
              };
            };
          };
        };
      };
      case "0" {
        // This case get matches which are UpComing
        var currentDay = startDay;

        while (matchCount < 10) {
          switch (FunctionalStableHashMap.get(matchDateIndex, Int.equal, hashInt, currentDay)) {
            case (null) {};
            case (?list) {
              label fcount for (id in List.toIter(list)) {
                if (matchCount >= 10) {
                  break fcount;
                };
                switch (matchStorage.get(id)) {
                  case (null) {};
                  case (?match) {
                    let rMatch : RMatch = {
                      providerId = match.providerId;
                      homeTeam = match.homeTeam;
                      awayTeam = match.awayTeam;
                      time = match.time;
                      location = match.location;
                      seasonId = match.seasonId;
                      status = match.status;
                      id = id;
                      homeScore = match.homeScore;
                      awayScore = match.awayScore;
                    };
                    result.add(rMatch);
                    matchCount += 1;
                  };
                };
              };
            };
          };
          currentDay += 1;
        };
      };
      case _ {};
    };
    return Buffer.toArray(result);
  };
  // Utility
  //  get time in miliseconds
  private func getContestIdsByMatch(matchId : Key) : [Key] {

    let contestIdsBuffer = Buffer.Buffer<Key>(contestStorage.size());
    for ((key, contest) in contestStorage.entries()) {
      if (contest.matchId == matchId) {
        contestIdsBuffer.add(key);
      };
    };
    return Buffer.toArray(contestIdsBuffer);
  };
  private func alreadyContestsCreated(matchId : Key) : {
    isGoldContestCreated : Bool;
    isBronzeContestCreated : Bool;
  } {
    var isGoldContestCreated : Bool = false;
    var isBronzeContestCreated : Bool = false;

    label contestLoop for ((key, contest) in contestStorage.entries()) {
      if (isGoldContestCreated and isBronzeContestCreated) {
        break contestLoop;
      };
      if (contest.matchId == matchId) {

        if (search({ compare = contest.name; s = "Gold" })) isGoldContestCreated := true;
        if (search({ compare = contest.name; s = "Bronze" })) isBronzeContestCreated := true;

      };
    };
    return { isGoldContestCreated; isBronzeContestCreated };
  };
  /// Check if user can be shown in FE
  private func shouldShowPlayer(player : Player) : Bool {
    if (player.active) true else false;
  };
  private func textToNat(txt : Text) : Nat {
    assert (txt.size() > 0);
    let chars = txt.chars();

    var num : Nat = 0;
    for (v in chars) {
      let charToNum = Nat32.toNat(Char.toNat32(v) -48);
      assert (charToNum >= 0 and charToNum <= 9);
      num := num * 10 + charToNum;
    };

    num;
  };
  private func sortRanking((_ka : Key, a : { points : Int; creation_time : Int }), (_kb : Key, b : { points : Int; creation_time : Int })) : Order.Order {
    if (a.points > b.points) return #less;
    if (a.points < b.points) return #greater;
    if (a.creation_time < b.creation_time) return #less;
    if (a.creation_time > b.creation_time) return #greater;
    return #equal;
  };
  private func sortRankingByRank((_ka : Key, a : { rank : Int; creation_time : Int }), (_kb : Key, b : { rank : Int; creation_time : Int })) : Order.Order {
    if (a.rank < b.rank) return #less;
    if (a.rank > b.rank) return #greater;
    if (a.creation_time < b.creation_time) return #less;
    if (a.creation_time > b.creation_time) return #greater;
    return #equal;
  };
  private func sortRankMap(a : (Nat, Nat), b : (Nat, Nat)) : Order.Order {
    let (a1, a2) = a;
    let (b1, b2) = b;
    if (a1 < b1) return #less;
    if (a1 > b1) return #greater;
    return #equal;
  };
  private func resetPlayerSquadByTeamIds(ids : [Key]) {
    for (id in ids.vals()) {
      for ((key, player) in playerStorage.entries()) {
        if (player.teamId == id) {
          let _ = playerStorage.replace(key, { player with isPlaying = false; isSub = false; points = ?0 });
        };

      };

    };
  };
  public shared ({ caller }) func adminResetPlayerSquadByTeamIds(ids : [Key]) {
    onlyAdmin(caller);
    resetPlayerSquadByTeamIds(ids);
  };
  private func getStats(playerId : Key, matchId : Key) : ?PlayerStats {
    var player : ?PlayerStats = null;
    for ((_key, playerStats) in playersStatsStorage.entries()) {
      if (playerStats.playerId == playerId and playerStats.matchId == matchId) {
        player := ?playerStats;
      };
    };
    return player;
  };
  private func getCurrentSeason(tournamentId : Key) : ?(Key, Season) {
    let tournament = tournamentStorage.get(tournamentId);
    switch (tournament) {
      case (?isTournament) {
        var currentSeason : ?(Key, Season) = null;
        for ((key, season) in seasonStorage.entries()) {

          if (season.tournamentId == tournamentId) {
            switch (currentSeason) {
              case (?(_, isSeason)) {
                if (isSeason.startDate < season.startDate) {
                  currentSeason := ?(key, season);
                };
              };
              case (null) {
                currentSeason := ?(key, season);
              };
            };
          };
        };
        return currentSeason;

      };
      case (null) {
        return null;
      };
    };
  };
  ///  Get time in miliseconds
  private func getTime() : Int {

    return Time.now() / TIME_DEVISOR;
  };
  let upcomingCompareFunc = func((a : RMatch), (b : RMatch)) : Order.Order {
    if (a.time < b.time) {
      return #less;
    } else if (a.time > b.time) {
      return #greater;
    } else {
      return #equal;
    };
  };
  let oldMatchesCompareFunc = func((a : RMatch), (b : RMatch)) : Order.Order {
    if (a.time > b.time) {
      return #less;
    } else if (a.time < b.time) {
      return #greater;
    } else {
      return #equal;
    };
  };
  private func getPoints(playerStats : ?PlayerStats) : ?RPoints {
    switch (playerStats) {
      case (?is) {
        let stats = is.stats;
        var crosses_accuracy = 0;
        var passes_accuracy = 0;
        var minutes_played = 0;
        if (stats.passing.crosses_accuracy > 50 and stats.passing.crosses_accuracy < 70) {
          crosses_accuracy := 2;
        } else if (stats.passing.crosses_accuracy > 70) {
          crosses_accuracy := 4;
        };
        if (stats.passing.passes_accuracy > 50 and stats.passing.passes_accuracy < 70) {
          passes_accuracy := 3;
        } else if (stats.passing.passes_accuracy > 70) {
          passes_accuracy := 6;
        };
        if (stats.other.minutes_played < 60) {
          minutes_played := 1;
        } else {
          minutes_played := 2;
        };
        var total : Int = (stable_points.shots.shots_total * stats.shots.shots_total) + (stable_points.shots.shots_on_goal * stats.shots.shots_on_goal) + (stable_points.goals.scored * stats.goals.scored) + (stable_points.goals.assists * stats.goals.assists) + (stable_points.goals.conceded * stats.goals.conceded) + (stable_points.goals.owngoals * stats.goals.owngoals) + (stable_points.goals.team_conceded * stats.goals.team_conceded) + (stable_points.fouls.drawn * stats.fouls.drawn) + (stable_points.fouls.committed * stats.fouls.committed) + (stable_points.cards.yellowcards * stats.cards.yellowcards) + (stable_points.cards.redcards * stats.cards.redcards) + (stable_points.cards.yellowredcards * stats.cards.yellowredcards) + (stable_points.passing.total_crosses * stats.passing.total_crosses) + (crosses_accuracy) + (stable_points.passing.passes * stats.passing.passes) + (stable_points.passing.accurate_passes * stats.passing.accurate_passes) + passes_accuracy + (stable_points.passing.key_passes * stats.passing.key_passes) + (stable_points.dribbles.attempts * stats.dribbles.attempts) + (stable_points.dribbles.success * stats.dribbles.success) + (stable_points.dribbles.dribbled_past * stats.dribbles.dribbled_past) + (stable_points.duels.total * stats.duels.total) + (stable_points.duels.won * stats.duels.won) + (stable_points.other.aerials_won * stats.other.aerials_won) + (stable_points.other.punches * stats.other.punches) + (stable_points.other.offsides * stats.other.offsides) + (stable_points.other.saves * stats.other.saves) + (stable_points.other.inside_box_saves * stats.other.inside_box_saves) + (stable_points.other.pen_scored * stats.other.pen_scored) + (stable_points.other.pen_missed * stats.other.pen_missed) + (stable_points.other.pen_saved * stats.other.pen_saved) + (stable_points.other.pen_committed * stats.other.pen_committed) + (stable_points.other.pen_won * stats.other.pen_won) + (stable_points.other.hit_woodwork * stats.other.hit_woodwork) + (stable_points.other.tackles * stats.other.tackles) + (stable_points.other.blocks * stats.other.blocks) + (stable_points.other.interceptions * stats.other.interceptions) + (stable_points.other.clearances * stats.other.clearances) + (stable_points.other.dispossesed * stats.other.dispossesed) + minutes_played;
        return ?total;

      };
      case (null) {
        return null;
      };
    };
  };
  private func getRefinedPoints(playerStats : ?PlayerStats, isSub : Bool) : ?RPoints {
    var points = getPoints(playerStats);
    switch (points) {
      case (?isPoints) {
        if (isSub) points := ?(isPoints / 2);
      };
      case (null) {};
    };
    return points;
  };
  private func updateSquadPoints(squad : PlayerSquad) : PointsPlayerSquad {
    var squadPoints : RPoints = 0;
    for ((key, bool) in squad.players.vals()) {
      let player = playerStorage.get(key);
      switch (player) {
        case (?is) {
          let stats = getStats(key, squad.matchId);
          let pointsWithSub = getRefinedPoints(stats, bool);
          let points = getRefinedPoints(stats, false);
          let _updatedPlayerWithPoints = playerStorage.replace(key, { is with points = points });
          switch (pointsWithSub) {
            case (?p) {
              squadPoints += p;
            };
            case (null) {};
          };
        };
        case (null) {};
      };
    };
    let newSquad : PointsPlayerSquad = {
      squad with
      points = squadPoints;
    };
    return newSquad;
  };
  private func nRefinePlayerSquad(squad : PlayerSquad, squadId : Key) : Types.RankPlayerSquad {
    let refinedPlayers = Buffer.Buffer<(Key, PlayerS, Bool)>(squad.players.size());
    // var squadPoints : RPoints = 0;
    for ((key, bool) in squad.players.vals()) {
      let player = playerStorage.get(key);
      switch (player) {
        case (?is) {
          // switch (is.points) {
          //   case (?points) {
          //     // updated
          //     if (bool) squadPoints += (points / 2) else squadPoints += points;
          //   };
          //   case (null) {};
          // };
          refinedPlayers.add((key, is, bool));
        };
        case (null) {};
      };
    };
    let rankBuffer = Buffer.Buffer<(Key, Nat)>(0);
    for (id in getContestIdsByMatch(squad.matchId).vals()) {
      let maybeParticipant = participantStorage.get(squadId # id);
      switch (maybeParticipant) {
        case (?isParticipant) {
          rankBuffer.add(id, isParticipant.rank);
        };
        case (null) {};
      };
    };
    let newSquad = {
      squad with players = Buffer.toArray(refinedPlayers);
      ranks = Buffer.toArray(rankBuffer);
    };
    return newSquad;
  };
  private func getMatchId(id : Key) : ?Key {
    var key : ?Key = null;
    for ((_key, match) in matchStorage.entries()) {
      if (match.providerId == id) {
        key := ?_key;
      };
    };
    return key;
  };
  private func getPlayerId(id : Key) : ?Key {
    var key : ?Key = null;
    for ((_key, player) in playerStorage.entries()) {
      if (player.providerId == id) {
        key := ?_key;
      };
    };
    return key;
  };
  private func search({ compare; s } : { compare : Text; s : Text }) : Bool {
    let searchString = Text.map(s, Prim.charToLower);
    let compareString = Text.map(compare, Prim.charToLower);
    if (Text.contains(compareString, #text searchString)) { return true } else {
      return false;
    };
  };
  private func compareStrings({ compare; s } : { compare : Text; s : Text }) : Bool {
    let searchString = Text.map(s, Prim.charToLower);
    let compareString = Text.map(compare, Prim.charToLower);
    if (compareString == searchString) { return true } else {
      return false;
    };
  };
  private func getLimit(limit : Nat) : Nat {
    var _l = MAX_LIMIT;
    if (limit < MAX_LIMIT) _l := limit;
    return _l;
  };
  private func getMatchName(isHome : Team, isAway : Team) : Text {
    return isHome.name # " vs " # isAway.name;
  };
  private func isInPast(time : Int) : Bool {
    return time < getTime();
  };
  private func isWithIn24H(time : Int) : Bool {
    return (getTime() < time and (getTime() +milisecondsInOneDay) > time);
  };
  private func isInFuture(time : Int) : Bool {
    return time > getTime();
  };
  private func getLatestMatch(status : Text) : Match {
    let currentTime = getTime();
    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    var withInThirtyMinutes = false;
    if (status == "0") {
      isUpcoming := true;
    } else if (status == "1") {
      isUpcoming := false;
    } else if (status == "2") {
      isUpcoming := false;
      isCompleted := true;
    } else if (status == "3") {
      isUpcoming := false;
      withInThirtyMinutes := true;
    };
    let _matches = HashMap.mapFilter<Key, Match, RMatch>(
      matchStorage,
      Text.equal,
      Text.hash,
      func(k, v) {
        // if (not search({ compare = v.location; s = props.search })) return null;
        if (not ((isUpcoming and v.time > currentTime) or (((not isUpcoming) and v.time < currentTime)))) return null;
        if (not ((isCompleted and checkMatchCompleted(v.status)) or (not isCompleted and not checkMatchCompleted(v.status)))) return null;
        return ?{ v with id = k };
      },
    );
    let filteredArr = Iter.toArray(_matches.vals());

    var sortedMatches : RMatches = [];
    if (isUpcoming) {
      sortedMatches := Array.sort(filteredArr, upcomingCompareFunc);
    } else {
      sortedMatches := Array.sort(filteredArr, oldMatchesCompareFunc);
    };
    return sortedMatches[0];

  };
  private func getDetailedMatchContest(match : RMatch, userId : Key) : ?DetailedMatchContest {
    let contestIds = getContestIdsByMatch(match.id);
    var tempTeamsCreated = 0;
    var tempTotalJoinded = 0;

    var tempContest : ContestArray = [];
    for (contestId in contestIds.vals()) {
      let maybeContest = contestStorage.get(contestId);

      switch (maybeContest) {
        case (?contest) {
          let squadIdBuffer = Buffer.Buffer<Key>(playerSquadStorage.size());
          var participated = 0;
          for ((key, squad) in playerSquadStorage.entries()) {
            if (squad.userId == userId and squad.matchId == match.id) {
              squadIdBuffer.add(key);
            };
          };
          for (key in squadIdBuffer.vals()) {
            let maybeSquad = participantStorage.get(key # contestId);
            if (Option.isSome(maybeSquad)) {
              tempTotalJoinded += 1;
              participated += 1;
            };
          };
          tempTeamsCreated := squadIdBuffer.size();
          let _contest = {
            contest with teamsCreatedOnContest = squadIdBuffer.size();
            teamsJoinedContest = participated;
          };
          tempContest := Array.append([_contest], tempContest);

        };
        case (null) {

        };
      };
    };
    return ?{
      match with providerId = match.providerId;
      contests = tempContest;
      teamsCreated = tempTeamsCreated;
      teamsJoined = tempTotalJoinded;
      latest = false;
    };

  };
  private func hasUserJoinedTheContest(matchId : Key, userId : Key) : Bool {
    let contestIds = getContestIdsByMatch(matchId);
    var isJoined = false;

    for (contestId in contestIds.vals()) {
      let maybeContest = contestStorage.get(contestId);

      switch (maybeContest) {
        case (?contest) {

          label playerLoop for ((key, squad) in playerSquadStorage.entries()) {
            if (squad.userId == userId and squad.matchId == matchId) {
              let maybeSquad = participantStorage.get(key # contestId);
              if (Option.isSome(maybeSquad)) {
                isJoined := true;
                break playerLoop;
              };

            };
          };

        };
        case (null) {

        };
      };
    };
    return isJoined;

  };
  private func getRewardPercentages() : {
    platformPercentage : Nat;
    rewardableUsersPercentage : Nat;
  } {
    let maybePlatformPercentage = adminSettingStorage.get(Types.AdminSettings.platformPercentage);
    let maybeRewardableUsersPercentage = adminSettingStorage.get(Types.AdminSettings.rewardableUsersPercentage);
    var platformPercentage = rewardPercentage;
    var rewardableUsersPercentage = 0;
    switch (maybePlatformPercentage, maybeRewardableUsersPercentage) {
      case (?isPlatformPercentage, ?isRewardableUsersPercentage) {
        platformPercentage := textToNat(isPlatformPercentage.settingValue);
        rewardableUsersPercentage := textToNat(isRewardableUsersPercentage.settingValue);
      };
      case (?isPlatformPercentage, null) {
        platformPercentage := textToNat(isPlatformPercentage.settingValue);
      };
      case (null, ?isRewardableUsersPercentage) {
        rewardableUsersPercentage := textToNat(isRewardableUsersPercentage.settingValue);
      };
      case (null, null) {};
    };
    return { rewardableUsersPercentage; platformPercentage };
  };
  public func testingGetRewardPercentages() : async {
    platformPercentage : Nat;
    rewardableUsersPercentage : Nat;
  } {
    let maybePlatformPercentage = adminSettingStorage.get(Types.AdminSettings.platformPercentage);
    let maybeRewardableUsersPercentage = adminSettingStorage.get(Types.AdminSettings.rewardableUsersPercentage);
    var platformPercentage = rewardPercentage;
    var rewardableUsersPercentage = 0;
    switch (maybePlatformPercentage, maybeRewardableUsersPercentage) {
      case (?isPlatformPercentage, ?isRewardableUsersPercentage) {
        platformPercentage := textToNat(isPlatformPercentage.settingValue);
        rewardableUsersPercentage := textToNat(isRewardableUsersPercentage.settingValue);
      };
      case (?isPlatformPercentage, null) {
        platformPercentage := textToNat(isPlatformPercentage.settingValue);
      };
      case (null, ?isRewardableUsersPercentage) {
        rewardableUsersPercentage := textToNat(isRewardableUsersPercentage.settingValue);
      };
      case (null, null) {};
    };
    return { rewardableUsersPercentage; platformPercentage };
  };
  private func textToFloatNotNull(t : Text) : Float {
    let isNumber = textToFloat(t);
    switch (isNumber) {
      case (null) { return 0 };
      case (?number) { return number };
    };
  };

  private func getTierBasedUsers(n : Nat) : (Nat, Nat) {
    if (n < 7) {
      return (1, 1);
    };
    let allTiers = n / 7;
    let remainder = n % 7;
    let lastTier = allTiers + remainder;
    return (allTiers, lastTier);
  };
  // add tournament name and id in a match
  private func addTournamentInMatch(m : RMatch) : ?RTournamentMatch {
    let season = seasonStorage.get(m.seasonId);
    switch (season) {
      case (?isSeason) {
        let tournament = tournamentStorage.get(isSeason.tournamentId);
        switch (tournament) {
          case (?isTournament) {
            var isRewardable =false;
            return ?{
              m with tournamentId = isSeason.tournamentId;
              tournamentName = isTournament.name;
              isRewardable;
            };
          };
          case (null) {
            return null;
          };
        };
      };
      case (null) {
        return null;

      };
    };
  };
  private func utilityGetTournamentByProvider(id : Types.MonkeyId) : ?ITournament {
    var rTournament : ?ITournament = null;
    label tournamentLoop for ((key, tournament) in tournamentStorage.entries()) {
      if (tournament.providerId == id) {
        rTournament := ?{ tournament with id = key };
        break tournamentLoop;
      };
    };

    return rTournament;
  };
  /*
    pGetPlayerIdsByTeamIds use to get ids of players by teams ids
    @perm {teamIds} array of teamIds
    @return array of players ids
  */
  private func pGetPlayerIdsByTeamIds(teamIds : [Key]) : [Key] {
    let playerIds = Buffer.Buffer<Key>(playerStorage.size());
    for ((key, player) in playerStorage.entries()) {
      for (teamId in teamIds.vals()) {
        if (player.teamId == teamId) {
          playerIds.add(key);
        };
      };
    };
    return Buffer.toArray(playerIds);
  };

  // Ledger methods
  private func transferToAdmin(user : Principal, amount : Nat, paymentMethod : Text) : async TransferFromResult {
    let maybeLedgerId = contestPaymentMap.get(paymentMethod);
    switch (maybeLedgerId) {
      case (?ledgerId) {
        let LEDGER = actor (ledgerId) : actor {
          icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
        };
        // let userPrincipal = Principal.fromText(userId);
        let adminPrincipal = Principal.fromText(Types.ADMIN_WALLET);
        let result = await LEDGER.icrc2_transfer_from({
          amount = amount;
          created_at_time = null;
          fee = null;
          from = { owner = user; subaccount = null };
          memo = null;
          spender_subaccount = null;
          to = { owner = adminPrincipal; subaccount = null };
        });
        return result;
      };
      case (null) {
        return #Err(#GenericError { error_code = 0; message = "payment method not found" });
      };
    };
  };
  // Ledger methods
  private func transferFromAdmin(user : Principal, amount : Nat, paymentMethod : Text) : async TransferFromResult {
    let maybeLedgerId = contestPaymentMap.get(paymentMethod);
    switch (maybeLedgerId) {
      case (?ledgerId) {
        let LEDGER = actor (ledgerId) : actor {
          icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
        };
        // let userPrincipal = Principal.fromText(userId);
        let adminPrincipal = Principal.fromText(Types.ADMIN_WALLET);
        let result = await LEDGER.icrc2_transfer_from({
          amount = amount;
          created_at_time = null;
          fee = null;
          from = { owner = adminPrincipal; subaccount = null };
          memo = null;
          spender_subaccount = null;
          to = { owner = user; subaccount = null };
        });
        return result;

      };
      case (null) {
        return #Err(#GenericError { error_code = 0; message = "payment method not found" });

      };
    };
  };
  // Ledger methods
  private func transferICPFromAdmin(user : Principal, amount : Nat) : async TransferFromResult {
    let LEDGER = actor (Types.ICP_LEDGER_CANISTER_ID) : actor {
      icrc2_transfer_from : (TransferFromArgs) -> async (TransferFromResult);
    };
    // let userPrincipal = Principal.fromText(userId);
    let adminPrincipal = Principal.fromText(Types.MASTER_WALLET);
    let result = await LEDGER.icrc2_transfer_from({
      amount = amount;
      created_at_time = null;
      fee = null;
      from = { owner = adminPrincipal; subaccount = null };
      memo = null;
      spender_subaccount = null;
      to = { owner = user; subaccount = null };
    });
    return result;
  };

  private func getRewardMap({ entryFee; slotsUsed } : { entryFee : Nat; slotsUsed : Nat }) : Map.HashMap<Nat, Nat> {
    var rewardPercentages = getRewardPercentages();
    let totalPrizePool = entryFee * slotsUsed;

    var platformPercentage = rewardPercentages.platformPercentage;
    var rewardableUsersPercentage = rewardPercentages.rewardableUsersPercentage;
    let rewardablePrizePool = (totalPrizePool * platformPercentage) / 100;
    let leastRewardableUsersForCompletedDistribution = 10;
    var strategy = Types.DistributionAlgo.completedTierWeighted;
    // var rewardableUsersInt = (slotsUsed * rewardableUsersPercentage) / 100;
    var rewardableUsersInt = slotsUsed;
    if (slotsUsed > 3) {
      rewardableUsersInt := (slotsUsed * rewardableUsersPercentage) / 100;
    };
    let rewardableUsers = Int.abs(rewardableUsersInt);
    if (rewardableUsers < leastRewardableUsersForCompletedDistribution) {
      strategy := Types.DistributionAlgo.reducededTierWeighted;
    };
    if (strategy == Types.DistributionAlgo.completedTierWeighted) {
      let sevenTierUsers : Nat = (rewardableUsers - 3);
      var rewardPerTier = rewardablePrizePool / 10;

      let (allTierUsers, lastTierUsers) = getTierBasedUsers(sevenTierUsers);
      let userTierRewardMap = Map.HashMap<Nat, { from : Nat; to : Nat; amount : ?Nat }>(0, Nat.equal, Hash.hash);
      var currentUser = 1;
      for (i in Iter.range(1, 10)) {
        if (i <= 3) {
          userTierRewardMap.put(i, { from = i; to = i; amount = null });
          currentUser += 1;
        } else if (i == 10) {
          let from = currentUser;
          let to = Int.abs(from + lastTierUsers - 1);
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        } else {
          let from = currentUser;
          let to = from + allTierUsers - 1;
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        };
      };
      var i = 1;
      i := 10;
      var residualValue = 0;
      while (i > 0) {
        if (i == 3 and allTierUsers > 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 3);
              residualValue := rewardForTier * 2;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else if (i == 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue));
              residualValue := 0;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 2);
              residualValue := rewardForTier;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        };
        i -= 1;
      };
      let rewardMap = Map.HashMap<Nat, Nat>(0, Nat.equal, Hash.hash);
      for ((key, userReward) in userTierRewardMap.entries()) {
        for (i in Iter.range(userReward.from, userReward.to)) {
          switch (userReward.amount) {
            case (?isAmount) {
              rewardMap.put(i, isAmount);
            };
            case (null) {};
          };
        };
      };
      return rewardMap;
      // return ?{
      //   rewards = Iter.toArray(userTierRewardMap.entries());
      //   prizePool = rewardablePrizePool;
      //   RewardPerTier = rewardPerTier;
      // };
    } else {
      var remainingTierUsers : Nat = 0;
      if (rewardableUsers > 3) {
        remainingTierUsers := (rewardableUsers - 3);
      };
      // let remainingTierUsers : Nat = (rewardableUsers - 3);
      var tiers = rewardableUsers;
      var rewardPerTier = rewardablePrizePool / tiers;
      let (allTierUsers, lastTierUsers) = getTierBasedUsers(remainingTierUsers);
      let userTierRewardMap = Map.HashMap<Nat, { from : Nat; to : Nat; amount : ?Nat }>(0, Nat.equal, Hash.hash);
      var currentUser = 1;
      for (i in Iter.range(1, tiers)) {
        if (i <= 3) {
          userTierRewardMap.put(i, { from = i; to = i; amount = null });
          currentUser += 1;
        } else if (i == tiers) {
          let from = currentUser;
          let to = Int.abs(from + lastTierUsers - 1);
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        } else {
          let from = currentUser;
          let to = Int.abs(from + allTierUsers - 1);
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        };
      };
      var i = tiers;
      var residualValue = 0;
      while (i > 0) {
        if (i == 3 and allTierUsers > 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 3);
              residualValue := rewardForTier * 2;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else if (i == 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue));
              residualValue := 0;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 2);
              residualValue := rewardForTier;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        };
        i -= 1;
      };
      let rewardMap = Map.HashMap<Nat, Nat>(0, Nat.equal, Hash.hash);
      for ((key, userReward) in userTierRewardMap.entries()) {
        for (i in Iter.range(userReward.from, userReward.to)) {
          switch (userReward.amount) {
            case (?isAmount) {
              rewardMap.put(i, isAmount);
            };
            case (null) {};
          };
        };
      };
      return rewardMap;
      // return ?{
      //   rewards = Iter.toArray(userTierRewardMap.entries());
      //   prizePool = rewardablePrizePool;
      //   RewardPerTier = rewardPerTier;
      // };
    };
  };

  public func getRewardsTable({ entryFee; slotsUsed; props } : { entryFee : Nat; slotsUsed : Nat; props : GetProps }) : async {
    total : Nat;
    map : [(Nat, Nat)];
  } {
    if (slotsUsed > 1_000_000) {
      throw Error.reject("Large value for slots used");
    };
    var rewardPercentages = getRewardPercentages();
    let totalPrizePool = entryFee * slotsUsed;

    var platformPercentage = rewardPercentages.platformPercentage;
    var rewardableUsersPercentage = rewardPercentages.rewardableUsersPercentage;
    let rewardablePrizePool = (totalPrizePool * platformPercentage) / 100;
    let leastRewardableUsersForCompletedDistribution = 10;
    var strategy = Types.DistributionAlgo.completedTierWeighted;
    // var rewardableUsersInt = (slotsUsed * rewardableUsersPercentage) / 100;
    var rewardableUsersInt = slotsUsed;
    if (slotsUsed > 3) {
      rewardableUsersInt := (slotsUsed * rewardableUsersPercentage) / 100;
    };
    let rewardableUsers = Int.abs(rewardableUsersInt);
    if (rewardableUsers < leastRewardableUsersForCompletedDistribution) {
      strategy := Types.DistributionAlgo.reducededTierWeighted;
    };
    if (strategy == Types.DistributionAlgo.completedTierWeighted) {
      let sevenTierUsers : Nat = (rewardableUsers - 3);
      var rewardPerTier = rewardablePrizePool / 10;

      let (allTierUsers, lastTierUsers) = getTierBasedUsers(sevenTierUsers);
      let userTierRewardMap = Map.HashMap<Nat, { from : Nat; to : Nat; amount : ?Nat }>(0, Nat.equal, Hash.hash);
      var currentUser = 1;
      for (i in Iter.range(1, 10)) {
        if (i <= 3) {
          userTierRewardMap.put(i, { from = i; to = i; amount = null });
          currentUser += 1;
        } else if (i == 10) {
          let from = currentUser;
          let to = Int.abs(from + lastTierUsers - 1);
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        } else {
          let from = currentUser;
          let to = from + allTierUsers - 1;
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        };
      };
      var i = 1;
      i := 10;
      var residualValue = 0;
      while (i > 0) {
        if (i == 3 and allTierUsers > 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 3);
              residualValue := rewardForTier * 2;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else if (i == 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue));
              residualValue := 0;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 2);
              residualValue := rewardForTier;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        };
        i -= 1;
      };
      let rewardMap = Map.HashMap<Nat, Nat>(0, Nat.equal, Hash.hash);

      for ((key, userReward) in userTierRewardMap.entries()) {
        for (i in Iter.range(userReward.from, userReward.to)) {
          switch (userReward.amount) {
            case (?isAmount) {
              if (search({ compare = Nat.toText(i); s = (props.search) })) rewardMap.put(i, isAmount);
            };
            case (null) {};
          };
        };
      };
      let arr : [(Nat, Nat)] = Iter.toArray(rewardMap.entries());
      let sortedArray = Array.sort(arr, sortRankMap);
      let limit = getLimit(props.limit);
      let startIndex : Nat = props.page * limit;
      let total = sortedArray.size();
      if (startIndex >= total) {
        return { total = total; map = [] };
      };
      var endIndex : Nat = startIndex + limit;
      if (endIndex > total) {
        endIndex := total;
      };
      return {
        total;
        map = Iter.toArray(Array.slice((sortedArray), startIndex, endIndex));
      };
      // return ?{
      //   rewards = Iter.toArray(userTierRewardMap.entries());
      //   prizePool = rewardablePrizePool;
      //   RewardPerTier = rewardPerTier;
      // };
    } else {
      var remainingTierUsers : Nat = 0;
      if (rewardableUsers > 3) {
        remainingTierUsers := (rewardableUsers - 3);
      };
      // let remainingTierUsers : Nat = (rewardableUsers - 3);
      var tiers = rewardableUsers;
      var rewardPerTier = rewardablePrizePool / tiers;
      let (allTierUsers, lastTierUsers) = getTierBasedUsers(remainingTierUsers);
      let userTierRewardMap = Map.HashMap<Nat, { from : Nat; to : Nat; amount : ?Nat }>(0, Nat.equal, Hash.hash);
      var currentUser = 1;
      for (i in Iter.range(1, tiers)) {
        if (i <= 3) {
          userTierRewardMap.put(i, { from = i; to = i; amount = null });
          currentUser += 1;
        } else if (i == tiers) {
          let from = currentUser;
          let to = Int.abs(from + lastTierUsers - 1);
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        } else {
          let from = currentUser;
          let to = Int.abs(from + allTierUsers - 1);
          userTierRewardMap.put(i, { from; to; amount = null });
          currentUser := to + 1;
        };
      };
      var i = tiers;
      var residualValue = 0;
      while (i > 0) {
        if (i == 3 and allTierUsers > 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 3);
              residualValue := rewardForTier * 2;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else if (i == 1) {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue));
              residualValue := 0;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        } else {
          var oldValue = userTierRewardMap.get(i);
          switch (oldValue) {
            case (?isValue) {
              var rewardForTier = Int.abs((rewardPerTier + residualValue) / 2);
              residualValue := rewardForTier;
              var range = Int.abs(isValue.to - isValue.from) +1;
              var rewardPerUser : Nat = Int.abs(rewardForTier / range);
              let _ = userTierRewardMap.replace(i, { isValue with amount = ?rewardPerUser });
            };
            case (null) {};
          };
        };
        i -= 1;
      };
      let rewardMap = Map.HashMap<Nat, Nat>(0, Nat.equal, Hash.hash);
      for ((key, userReward) in userTierRewardMap.entries()) {
        for (i in Iter.range(userReward.from, userReward.to)) {
          switch (userReward.amount) {
            case (?isAmount) {
              if (search({ compare = Nat.toText(i); s = (props.search) })) rewardMap.put(i, isAmount);
            };
            case (null) {};
          };
        };
      };
      let arr : [(Nat, Nat)] = Iter.toArray(rewardMap.entries());
      let sortedArray = Array.sort(arr, sortRankMap);
      let limit = getLimit(props.limit);
      let startIndex : Nat = props.page * limit;
      let total = sortedArray.size();
      if (startIndex >= total) {
        return { total = total; map = [] };
      };
      var endIndex : Nat = startIndex + limit;
      if (endIndex > total) {
        endIndex := total;
      };
      return {
        total;
        map = Iter.toArray(Array.slice((sortedArray), startIndex, endIndex));
      };
    };
  };

  /*
   isNameAlreadyTaken use to check username is already taken or not
   @perm username
   @return boolean
  */
  private func isNameAlreadyTaken(username : Text) : Bool {
    var isTaken : Bool = false;
    for ((id, user) in userStorage.entries()) {
      if (user.name == username) {
        isTaken := true;
      };
    };
    return isTaken;

  };
  private func verifyBudget(players : [(Key, Bool)]) : Result.Result<Text, Text> {
    if (players.size() > Types.MAX_PLAYER_PER_SQUAD) {
      return #err("Player size exceeded");
    };
    var budget = 0;
    for ((key, _) in players.vals()) {
      let player = playerStorage.get(key);
      switch (player) {
        case (?isPlayer) {
          budget += isPlayer.fantasyPrice;
        };
        case (null) {
          return #err("Player not found");
        };
      };
    };
    let budgetsetting = adminSettingStorage.get(Types.AdminSettings.budget);
    switch (budgetsetting) {
      case (?isSetting) {
        if (budget > textToNat(isSetting.settingValue)) {
          return #err("Budget exceeded");
        };
      };
      case (null) {
        return #err("Price is not fixed yet, please try again or ask admin");
      };
    };
    return #ok("Budget verified");
  };
  func textToFloat(t : Text) : ?Float {

    var i : Float = 1;
    var f : Float = 0;
    var isDecimal : Bool = false;

    for (c in t.chars()) {
      if (Char.isDigit(c)) {
        let charToNat : Nat64 = Nat64.fromNat(Nat32.toNat(Char.toNat32(c) -48));
        let natToFloat : Float = Float.fromInt64(Int64.fromNat64(charToNat));
        if (isDecimal) {
          let n : Float = natToFloat / Float.pow(10, i);
          f := f + n;
        } else {
          f := f * 10 + natToFloat;
        };
        i := i + 1;
      } else {
        if (Char.equal(c, '.') or Char.equal(c, ',')) {
          f := f / Float.pow(10, i); // Force decimal
          f := f * Float.pow(10, i); // Correction
          isDecimal := true;
          i := 1;
        } else {
          return null;
        };
      };
    };

    return ?f;
  };
  func extractUSD(input : Text) : ?Float {
    let chars = input.chars();
    var usdFound = false;
    var collectingNumber = false;
    var numberStr = "";
    var buffer = "";

    for (char in chars) {

      if (usdFound and collectingNumber) {
        if (Char.isDigit(char) or char == '.') {
          numberStr := numberStr # Text.fromChar(char);
        } else if (char == '}' or char == ',' or char == ' ') {
          return textToFloat(numberStr);
        };
      } else if (usdFound and char == ':') {
        collectingNumber := true;
      } else {
        buffer := buffer # Text.fromChar(char);
        if (Text.equal(buffer, "usd")) {
          usdFound := true;
          buffer := ""; // Reset buffer to stop adding characters
        } else if (char != 'u' and char != 's') {
          buffer := ""; // Reset buffer if it grows too large
        };
      };
    };
    return null;
  };

  func getIcpusdExchange() : async ?Float {

    let ic : Types.IC = actor ("aaaaa-aa");

    let ONE_MINUTE : Nat64 = 60;
    let start_timestamp : Types.Timestamp = 1682978460; //May 1, 2023 22:01:00 GMT
    let end_timestamp : Types.Timestamp = 1682978520; //May 1, 2023 22:02:00 GMT
    let host : Text = "api.coingecko.com";
    let url = "https://" # host # "/api/v3/simple/price?ids=internet-computer&vs_currencies=usd";

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };
    let http_request : Types.HttpRequestArgs = {
      url = url;
      max_response_bytes = null;
      headers = [];
      body = null;
      method = #get;
      transform = ?transform_context;
    };

    Cycles.add(20_949_972_000);

    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    let response_body : Blob = Blob.fromArray(http_response.body);
    let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };
    let usd = extractUSD(decoded_text);
    Debug.print(debug_show (usd));

    usd;
  };

  //7. CREATE TRANSFORM FUNCTION
  public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
    let transformed : Types.CanisterHttpResponsePayload = {
      status = raw.response.status;
      body = raw.response.body;
      headers = [
        {
          name = "Content-Security-Policy";
          value = "default-src 'self'";
        },
        { name = "Referrer-Policy"; value = "strict-origin" },
        { name = "Permissions-Policy"; value = "geolocation=(self)" },
        {
          name = "Strict-Transport-Security";
          value = "max-age=63072000";
        },
        { name = "X-Frame-Options"; value = "DENY" },
        { name = "X-Content-Type-Options"; value = "nosniff" },
      ];
    };
    transformed;
  };

  
  // private func addReward()
  // Users
  public shared ({ caller }) func addUser(iUser : IUser) : async Result.Result<(Text, ?User), Text> {
    // Return error if the user already exists
    assert not Principal.isAnonymous(caller);
    let userId = Principal.toText(caller);
    let maybeOldUser = userStorage.get(userId);

    switch maybeOldUser {
      case (?user) {
       
        return #ok("Already a User", ?user);
      };
      case (null) {
        // return #err("Error while getting user");
        var tempUserName = iUser.name;
        var isNameTaken = isNameAlreadyTaken(tempUserName);

        while (isNameTaken) {
          tempUserName := tempUserName # Nat.toText(stableUserNameCount);
          stableUserNameCount += 1;
          isNameTaken := isNameAlreadyTaken(tempUserName);

        };
        var tempUser : User = {
          name = tempUserName;
          joiningDate = getTime();
          role = #user;
          email = iUser.email;
        };
        userStorage.put(Principal.toText(caller), tempUser);
    
    
        return #ok("User added successfuly", ?tempUser);
      };
    };

  };

  /*
    pGetPlayerPoints use to get points of player
    @perms {playerId}
    @perms {matchId}
    @return player pointes
   */
  func pGetPlayerPoints(playerId : Key, matchId : Key) : ?RPoints {
    var playerStats : ?PlayerStats = null;
    for ((_key, _playerStats) in playersStatsStorage.entries()) {
      if (_playerStats.playerId == playerId and _playerStats.matchId == matchId) {
        playerStats := ?_playerStats;
      };
    };
    let maybePlayer = playerStorage.get(playerId);
    switch (maybePlayer) {
      case (?isPlayer) {
        let points = getRefinedPoints(playerStats, isPlayer.isSub);
        return points;
      };
      case (null) {
        let points = getPoints(playerStats);
        return points;
      };
    };
  };
  /*
   updateUser use to update user profile
   @perms {IUser}
   @return user

   */
  public shared ({ caller }) func updateUser(iUser : IUser) : async Result.Result<(Text, ?User), Text> {
    // Return error if the user already exists
    assert not Principal.isAnonymous(caller);
    let maybeOldUser = userStorage.get(Principal.toText(caller));
    switch maybeOldUser {
      case (?user) {
        if (user.name != iUser.name) {
          var isNameTaken = isNameAlreadyTaken(iUser.name);
          if (isNameTaken) {
            return #err("UserName already taken");

          };
        };

        var tempUser : User = {
          name = iUser.name;
          joiningDate = user.joiningDate;
          role = user.role;
          email = iUser.email;
        };
        let newUser = userStorage.replace(Principal.toText(caller), tempUser);
        return #ok("Profile updated successfully", newUser);
      };
      case (null) {

        return #err("User not found");
      };
    };

  };
  public query ({ caller }) func getUser(userId : ?Text) : async ?User {
    switch (userId) {
      case (?id) {
        return userStorage.get(id);
      };
      case (null) {
        return userStorage.get(Principal.toText(caller));
      };
    };
  };
  public shared ({ caller }) func makeAdmin(id : Principal) : async Bool {
    // Return error if the user already exists
    assert Principal.isController(caller);
    let maybeOldUser = userStorage.get(Principal.toText(id));
    switch maybeOldUser {
      case (?user) {
        var tempUser : User = {
          name = user.name;
          joiningDate = getTime();
          role = #admin;
          email = user.email;
        };
        let _t = userStorage.replace(Principal.toText(id), tempUser);
        return true;
      };
      case (null) {
        var tempUser : User = {
          name = "admin";
          joiningDate = getTime();
          email = "";
          role = #admin;
        };

        userStorage.put(Principal.toText(id), tempUser);
        return true;
      };
    };

  };
  public query ({ caller }) func getAdmins() : async Users {
    // Return error if the user already exists
    assert Principal.isController(caller);
    let admins = Buffer.Buffer<(Key, User)>(userStorage.size());
    for ((key, user) in userStorage.entries()) {
      if (user.role == #admin) {
        admins.add((key, user));
      };
    };
    return Buffer.toArray(admins);

  };

  // PlayersStats
  public shared ({ caller }) func addPlayerStats(inputStats : IPlayerStats) : async Bool {
    onlyAdmin(caller);
    let newPlayerStats : PlayerStats = {
      matchId = inputStats.matchId;
      playerId = inputStats.playerId;
      stats = inputStats.stats;
      rating = inputStats.rating;
    };
    playersStatsStorage.put(inputStats.matchId # inputStats.playerId, newPlayerStats);
    return true;
  };
  public shared ({ caller }) func _updatePlayersStats(inputStats : [IPlayerStats]) : async [Bool] {
    // onlyUser(caller);
    let result = Buffer.Buffer<Bool>(inputStats.size());
    for (stats in inputStats.vals()) {
      // let isAlready =
      let isMatchId = getMatchId(stats.matchId);
      switch (isMatchId) {
        case (?matchId) {
          let isPlayerId = getPlayerId(stats.playerId);
          switch (isPlayerId) {
            case (?playerId) {
              let newPlayerStats : PlayerStats = {
                matchId = stats.matchId;
                playerId = stats.playerId;
                stats = stats.stats;
                rating = stats.rating;
              };
              playersStatsStorage.put(stats.matchId # stats.playerId, newPlayerStats);
              result.add(true);
            };
            case (null) {
              result.add(false);

            };
          };
        };
        case (null) {
          result.add(false);

        };
      };

    };
    return Buffer.toArray(result);
  };
  public shared ({ caller }) func updatePlayersStats(inputStats : [IPlayerStats]) : async [Bool] {
    onlyAdmin(caller);
    let result = Buffer.Buffer<Bool>(inputStats.size());
    for (stats in inputStats.vals()) {
      let newPlayerStats : PlayerStats = {
        matchId = stats.matchId;
        playerId = stats.playerId;
        stats = stats.stats;
        rating = stats.rating;
      };
      playersStatsStorage.put(stats.matchId # stats.playerId, newPlayerStats);
      result.add(true);
    };
    return Buffer.toArray(result);
  };
  public query func getPlayerStats(playerId : Key, matchId : Key) : async ?PlayerStats {
    var player : ?PlayerStats = null;
    for ((_key, playerStats) in playersStatsStorage.entries()) {
      if (playerStats.playerId == playerId and playerStats.matchId == matchId) {
        player := ?playerStats;
      };
    };
    return player;

  };
  public query func getPlayerStatsByMatchId(matchId : Key) : async [(Key, Types.PlayerStatsWithName)] {
    let statsBuffer = Buffer.Buffer<(Key, Types.PlayerStatsWithName)>(playersStatsStorage.size());
    for ((key, stats) in playersStatsStorage.entries()) {
      if (stats.matchId == matchId) {
        let maybePlayer = playerStorage.get(stats.playerId);
        switch (maybePlayer) {
          case (?isPlayer) {
            statsBuffer.add((key, { stats with name = isPlayer.name }));
          };
          case (null) {
            statsBuffer.add((key, { stats with name = "" }));
          };
        };
      };
    };
    return Buffer.toArray(statsBuffer);
  };
  public query func getPlayerPoints(playerId : Key, matchId : Key) : async ?RPoints {
    pGetPlayerPoints(playerId, matchId);
  };
  // Ranking
  public query ({ caller }) func nGetSquadRanking(contestId : Key, props : GetProps) : async ReturnRankings {
    var mySquads = Buffer.Buffer<(Key, PlayerSquad)>(3);
    let maybeMatch = matchStorage.get(contestId);
    switch (maybeMatch) {
      case (?match) {
        if (isInFuture(match.time)) onlyAdmin(caller);
      };
      case (null) {};
    };
    var _playerSquadsBuffer = Buffer.Buffer<(Key, PlayerSquad)>(playerSquadStorage.size());
    for ((_k, participant) in participantStorage.entries()) {
      if (participant.contestId == contestId) {
        let maybeSquad = playerSquadStorage.get(participant.squadId);
        switch (maybeSquad) {
          case (?squad) {
            if (squad.userId == Principal.toText(caller)) mySquads.add((participant.squadId, { squad with rank = participant.rank }));
            _playerSquadsBuffer.add(participant.squadId, { squad with rank = participant.rank });
          };
          case (null) {};
        };
      } else {};
    };
    let _squadArray = Buffer.toArray(_playerSquadsBuffer);
    let sortedSquads = Array.sort(
      _squadArray,
      sortRankingByRank,
    );
    let mySortedSquads = Array.sort(
      Buffer.toArray(mySquads),
      sortRankingByRank,
    );
    var myRanking : ?(Key, PlayerSquad) = null;
    if (mySortedSquads.size() > 0) {
      myRanking := ?mySortedSquads[0];
    };

    let limit = getLimit(props.limit);
    let totalRankings = (sortedSquads.size());
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalRankings) {
      return { rankings = []; total = totalRankings; userRank = null };
    };
    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalRankings) {
      endIndex := totalRankings;
    };
    return {
      rankings = Iter.toArray(Array.slice((sortedSquads), startIndex, endIndex));
      total = totalRankings;
      userRank = myRanking;
    };
  };
  public shared ({ caller }) func updateRanking(matchId : Key) {
    onlyAdmin(caller);
    let maybeMatch = matchStorage.get(matchId);
    var squadAndParticipantBuffer = Buffer.Buffer<(Key, PointsPlayerSquad and Participant)>(playerSquadStorage.size());
    // var participantBuffer = Buffer.Buffer<(Key, Participant and { points : RPoints })>(participantStorage.size());
    switch (maybeMatch) {
      case (?match) {
        let contestIds = getContestIdsByMatch(matchId);
        for (contestId in contestIds.vals()) {
          for ((_key, participant) in participantStorage.entries()) {
            if (participant.contestId == contestId) {
              let maybeSquad = playerSquadStorage.get(participant.squadId);
              switch (maybeSquad) {
                case (?squad) {
                  let newSquad = updateSquadPoints(squad);
                  squadAndParticipantBuffer.add(
                    _key,
                    {
                      newSquad with
                      squadId = participant.squadId;
                      contestId = participant.contestId;
                      userId = participant.userId;
                      transactionId = participant.transactionId;
                      isRewarded = participant.isRewarded;
                    },
                  );
                };
                case (null) {};
              };
            } else {};
          };
          var sortedSquads = Array.sort(
            Buffer.toArray(squadAndParticipantBuffer),
            sortRanking,
          );
          var rank : Nat = 1;
          for ((key, squad) in sortedSquads.vals()) {
            let _replaced = playerSquadStorage.replace(squad.squadId, { squad with rank = 0 });
            let _r = participantStorage.replace(key, { squad with rank });
            rank := rank + 1;
          };
          squadAndParticipantBuffer.clear();
        };
      };
      case (null) {};
    };
  };
  // PlayerSquads
  public shared ({ caller }) func addPlayerSquad(inputSquad : IPlayerSquad) : async Result.Result<Text, Text> {
    onlyUser(caller);
    let r = verifyBudget(inputSquad.players);
    let maybeMatch = matchStorage.get(inputSquad.matchId);
    switch (maybeMatch) {
      case (?isMatch) {
        if (isInPast(isMatch.time)) {
          return #err("Time limit exceeded");

          // onlyAdmin(caller);
        };
        if (not isWithIn24H(isMatch.time)) {
          // TODO return #err("Hold tight! Team setup opens 24 hours before the match.");

        };
      };
      case (null) {
        return #err("Match does not exist");
      };
    };
    switch (r) {
      case (#err(error)) {
        return #err(error);
      };
      case (#ok(_)) {};
    };

    // Count the number of players and substitutes
    let playersCount = Validation.playersCount(inputSquad.players);
    switch (playersCount) {
      case (#ok(_)) {};
      case (#err(res)) {
        return #err(res);
      };
    };

    let playerKeys = Array.map<(Text, Bool), Text>(
      inputSquad.players,
      func(playerTuple : (Text, Bool)) : Text {
        let (key, _) = playerTuple;
        key;
      },
    );
    switch (countDuplicates(playerKeys)) {
      case (#ok(count)) {
        let teamFormatiopnValidate = Validation.validateTeamFormation(inputSquad.players, inputSquad.formation, playerStorage);
        switch (teamFormatiopnValidate) {
          case (#err(err)) {
            return #err(err);
          };
          case (#ok(_)) {

            let getMatch = matchStorage.get(inputSquad.matchId);
            switch (getMatch) {
              case (null) {
                return #err("Match not found");
              };
              case (?isMatch) {
                //this check what ever selected players are not from single team
                let selectedPlayersNotFromSingleTeam = Validation.validateSelectedPlayersAreNotFromSingleTeam(inputSquad.players, isMatch.homeTeam, isMatch.awayTeam, playerStorage);

                switch (selectedPlayersNotFromSingleTeam) {
                  case (#err(err)) {
                    return #err(err);
                  };
                  case (#ok(_)) {

                    let newSquad = {
                      inputSquad with
                      rank = 0;
                      points = 0;
                      userId = Principal.toText(caller);
                      creation_time = getTime();
                      hasParticipated = false;
                    };
                    playerSquadStorage.put(
                      Types.generateNewRemoteObjectId(),
                      newSquad,
                    );
                    return #ok("Squad created successfully");
                  };
                };

              };
            };
          };
        };
      };
      case (#err(msg)) {
        Debug.print(msg);
        return #err(msg);
      };
    };

  };
  public query ({ caller }) func getPlayerSquad(squadId : Key) : async ?Types.RankPlayerSquad {
    let maybeSquad = playerSquadStorage.get(squadId);
    switch (maybeSquad) {
      case (?squad) {
        if (squad.userId != Principal.toText(caller)) {
          let match = matchStorage.get(squad.matchId);
          switch (match) {
            case (?isMatch) {
              if (isInFuture(isMatch.time)) {
                return null;
              };
            };
            case (null) {
              return null;
            };
          };
        };
        return ?nRefinePlayerSquad(squad, squadId);
      };
      case (null) {
        return null;
      };
    };
  };
  public query func getSquadWithPoints(squadId : Key) : async ?RefinedPlayerSquad {
    let maybeSquad = playerSquadStorage.get(squadId);
    switch (maybeSquad) {
      case (?squad) {
        return ?nRefinePlayerSquad(squad, squadId);
      };
      case (null) {
        return null;
      };
    };
  };
  public query ({ caller }) func getPlayerSquadsByMatch(matchId : Key) : async RefinedPlayerSquads {
    let playerSquad = Buffer.Buffer<(Key, RefinedPlayerSquad)>(playerSquadStorage.size());
    for ((key, squad) in playerSquadStorage.entries()) {
      if (squad.matchId == matchId and squad.userId == Principal.toText(caller)) {
        let newSquad = nRefinePlayerSquad(squad, key);
        playerSquad.add((key, newSquad));
      };
    };
    return Buffer.toArray(playerSquad);
  };

  // get player squads by match and without match
  public query ({ caller }) func getRawPlayerSquadsByMatch(matchId : ?Key, contestId : ?Key) : async PlayerSquads {

    let playerSquad = Buffer.Buffer<(Key, PlayerSquad)>(playerSquadStorage.size());
    var tempMatchId : Key = "";

    // switch(matchId) {
    //   case(null) {  };
    //   case(?isId) {
    //     tempMatchId:=isId;

    //    };
    // };
    //     let contestsIdsOfMatches=getContestIdsByMatch(tempMatchId);

    let joinedContests = getJoinedContestsSquadIds(Principal.toText(caller), contestId);
    label squadsLoop for ((key, squad) in playerSquadStorage.entries()) {

      switch (matchId) {
        case (?isId) {
          if (not (squad.matchId == isId)) continue squadsLoop;
        };
        case (null) {
          // continue squadsLoop;
        };
      };
      if (squad.userId == Principal.toText(caller)) {
        var participated = false;
        for (id in joinedContests.vals()) {
          if (id == key) {
            participated := true;

          } else {
            participated := false;
          };
        };
        let newSquad = nRefinePlayerSquad(squad, key);
        let match = matchStorage.get(squad.matchId);
        switch (match) {
          case (?isMatch) {
            let homeTeam = teamStorage.get(isMatch.homeTeam);
            let awayTeam = teamStorage.get(isMatch.awayTeam);
            let matchTime = isMatch.time;
            switch (homeTeam, awayTeam) {
              case (?isHome, ?isAway) {
                playerSquad.add((key, { newSquad with players = squad.players; hasParticipated = participated; matchName = getMatchName(isHome, isAway); matchTime = matchTime }));

              };
              case (_, _) {

              };
            };

          };
          case (null) {};
        };

      };
    };
    return Buffer.toArray(playerSquad);
  };

  //

  func countDuplicates(playerKeys : [Text]) : Result.Result<Nat, Text> {
    var count : Nat = 0;
    var size = Array.size(playerKeys);
    var i = 0;

    // Iterate over each key in playerKeys using a while loop
    while (i < size) {
      let key1 = playerKeys[i];
      var isDuplicate : Bool = false;

      // Compare key1 with previous keys
      var j = 0;
      while (j < i) {
        let key2 = playerKeys[j];
        if (key1 == key2) {
          isDuplicate := true; // Use := for assignment
          return #err("Duplicate player keys found in the squad."); // Stop checking further once a duplicate is found
        };
        j += 1; // Increment inner loop index
      };

      // If a duplicate is found, increment the count
      if (isDuplicate) {
        count += 1;
      };
      i += 1; // Increment outer loop index
    };
    return #ok(count);
  };

  public shared ({ caller }) func updatePlayerSquad(squadId : Key, newSquad : IPlayerSquad) : async Result.Result<{ message : Text; squad : ?PlayerSquad }, Text> {
    onlyUser(caller);

    // Assuming `playerKeys` is derived from `newSquad.players`
    let playerKeys = Array.map<(Text, Bool), Text>(
      newSquad.players,
      func(playerTuple : (Text, Bool)) : Text {
        let (key, _) = playerTuple;
        key;
      },
    );
    let playersCount = Validation.playersCount(newSquad.players);
    switch (playersCount) {
      case (#ok(_)) {};
      case (#err(res)) {
        return #err(res);
      };
    };

    switch (countDuplicates(playerKeys)) {
      case (#ok(count)) {

        let maybeSquad = playerSquadStorage.get(squadId);
        switch (maybeSquad) {
          case (?isSquad) {
            let match = matchStorage.get(isSquad.matchId);
            switch (match) {
              case (?isMatch) {
                if (isInPast(isMatch.time)) return #err("Time limit exceeded");
              };
              case (null) {};
            };

            let r = verifyBudget(newSquad.players);
            switch (r) {
              case (#err(error)) {
                return #err(error);
              };
              case (#ok(_)) {};
            };

            thisUser(Principal.toText(caller), isSquad.userId);
            let teamFormatiopnValidate = Validation.validateTeamFormation(newSquad.players, newSquad.formation, playerStorage);
            switch (teamFormatiopnValidate) {
              case (#err(err)) {
                return #err(err);
              };
              case (#ok(_)) {
                let getMatch = matchStorage.get(newSquad.matchId);
                switch (getMatch) {
                  case (null) {
                    return #err("Match not found");
                  };
                  case (?isMatch) {

                    let selectedPlayersNotFromSingleTeam = Validation.validateSelectedPlayersAreNotFromSingleTeam(newSquad.players, isMatch.homeTeam, isMatch.awayTeam, playerStorage);

                    switch (selectedPlayersNotFromSingleTeam) {
                      case (#err(err)) {
                        return #err(err);
                      };
                      case (#ok(_)) {

                        let updatedSquad = {
                          userId = isSquad.userId;
                          name = newSquad.name;
                          matchId = newSquad.matchId;
                          cap = newSquad.cap;
                          viceCap = newSquad.viceCap;
                          players = newSquad.players;
                          formation = newSquad.formation;
                          creation_time = isSquad.creation_time;
                          rank = isSquad.rank;
                          hasParticipated = isSquad.hasParticipated;
                          points = isSquad.points;
                          // providerId = newSquad.providerId;
                        };

                        let oldSquad = playerSquadStorage.replace(squadId, updatedSquad);
                        return #ok({
                          message = "Squad updated successfully";
                          squad = oldSquad;
                        });
                      };
                    };
                  };

                };
              };
            };
          };
          case (null) {
            return #err("Squad not found");
          };
        };

      };
      case (#err(msg)) {
        Debug.print(msg);
        return #err(msg);
      };
    };

  };

  // Contests
  public shared ({ caller }) func addContest(inputContest : IContest) : async Result.Result<Text, Text> {
    onlyAdmin(caller);
    let maybeMatch = matchStorage.get(inputContest.matchId);
    if (Option.isNull(contestPaymentMap.get(inputContest.paymentMethod))) return #err("Payment method not found");
    switch (maybeMatch) {
      case (?isMatch) {
        let currentTime = getTime();
        if (currentTime > isMatch.time) return #err("Time limit exceeded");

        // let maybeContest = contestStorage.get(contestId);
        let contestId = Types.generateNewRemoteObjectId();

        let newContest : Contest = {
          creatorUserId = Principal.toText(caller);
          name = inputContest.name;
          matchId = inputContest.matchId;
          entryFee = inputContest.entryFee;
          slots = inputContest.slots;
          slotsUsed = 0;
          rewardDistribution = inputContest.rewardDistribution;
          minCap = inputContest.minCap;
          maxCap = inputContest.maxCap;
          providerId = inputContest.providerId;
          teamsPerUser = inputContest.teamsPerUser;
          rules = inputContest.rules;
          winner = null;
          isDistributed = false;
          paymentMethod = inputContest.paymentMethod;
        };
        // using the matchId as the contestId because a match can only have one contest
        contestStorage.put(
          contestId,
          newContest,
        );
        return #ok("Contest added successfully");

      };
      case (null) {
        return #err("No match found")

      };
    };

  };
  public shared ({ caller }) func updateContest(inputContest : IContest, contestId : Key) : async Result.Result<Text, Text> {
    onlyAdmin(caller);
    let maybeMatch = matchStorage.get(inputContest.matchId);
    switch (maybeMatch) {
      case (?isMatch) {
        let currentTime = getTime();
        if (currentTime < isMatch.time) {
          let maybeContest = contestStorage.get(contestId);
          switch (maybeContest) {
            case (null) {
              return #err("No Contest found");
            };
            case (?isContest) {
              // if (inputContest.slots < isContest.slotsUsed) return #err("Slots overflow");
              let newContest : Contest = {
                creatorUserId = Principal.toText(caller);
                name = inputContest.name;
                matchId = inputContest.matchId;
                entryFee = inputContest.entryFee;
                slots = inputContest.slots;
                slotsUsed = isContest.slotsUsed;
                rewardDistribution = inputContest.rewardDistribution;
                minCap = inputContest.minCap;
                maxCap = inputContest.maxCap;
                providerId = inputContest.providerId;
                teamsPerUser = inputContest.teamsPerUser;
                winner = isContest.winner;
                isDistributed = isContest.isDistributed;
                rules = inputContest.rules;
                paymentMethod = isContest.paymentMethod;

              };
              let _t = contestStorage.replace(
                contestId,
                newContest,
              );
            };
          };

          return #ok("Contest updated successfully");
        } else {
          return #err("Time limit exceeded");
        };
      };
      case (null) {
        return #err("No match found")

      };
    };

  };
  public shared ({ caller }) func removeContest(contestId : Key) : async ?Contest {
    onlyAdmin(caller);
    contestStorage.remove(contestId);
  };
  public query func getContest(contestId : Key) : async ?Contest {
    return contestStorage.get(contestId);
  };
  /**
   getContestWithMatch use to get  contest with match with contest id
   @param array of contestId
   @return {contest:Contest;match:RefinedMatch}

  **/
  public query func getContestWithMatch(contestId : Key) : async ?{
    contest : Contest;
    match : ?RefinedMatch;
  } {
    let contest = contestStorage.get(contestId);
    switch (contest) {
      case (null) return null;
      case (?isContest) {
        let getMatch = pGetMatch(isContest.matchId);
        return ?{ match = getMatch; contest = isContest };
      };
    };
  };

  /**
   getContestNames use to get list of contest names og given ids
   @param array of contestIds
   @return [(id, contestname)]

  **/
  public query func getContestNames(contestIds : [Key]) : async [(Text, Text)] {
    var tempContextNames : [(Text, Text)] = [];
    for (id in contestIds.vals()) {
      let getContest = contestStorage.get(id);

      switch (getContest) {
        case (?isContest) {
          tempContextNames := Array.append(tempContextNames, [(id, isContest.name)]);
        };
        case (null) {
          tempContextNames := Array.append(tempContextNames, [(id, "")]);

        };
      };
    };
    return tempContextNames;
  };
  /**
   getContestsByIds use to get list of contest names og given ids
   @param array of contestIds
   @return [(id, Contest)]

  **/
  public query func getContestsByIds(contestIds : [Key]) : async [Contest and { id : Key }] {
    var contests : [Contest and { id : Key }] = [];
    for (id in contestIds.vals()) {
      let getContest = contestStorage.get(id);

      switch (getContest) {
        case (?isContest) {
          contests := Array.append(contests, [{ isContest with id }]);
        };
        case (null) {};
      };
    };
    return contests;
  };
  public query func getContestsByMatchId(matchId : Key) : async Contests {
    let contests = Buffer.Buffer<(Key, Contest)>(contestStorage.size());
    for ((key, contest) in contestStorage.entries()) {
      if (contest.matchId == matchId) {
        contests.add((key, contest));
      };
    };
    return Buffer.toArray(contests);
  };
  public query ({ caller }) func getJoinedContests() : async MatchContests {
    // let contestsBuffer = Buffer.Buffer<(Key, MatchContest)>(participantStorage.size());
    var contestMap = Map.HashMap<Key, MatchContest>(participantStorage.size(), Text.equal, Text.hash);
    label participantLoop for ((key, participant) in participantStorage.entries()) {
      if (participant.userId == Principal.toText(caller)) {
        let isAlreadyIncluded = contestMap.get(participant.contestId);
        if (isAlreadyIncluded != null) {
          continue participantLoop;
        };
        let contest = contestStorage.get(participant.contestId);
        switch (contest) {
          case (?isContest) {
            let match = matchStorage.get(isContest.matchId);
            var firstPrize = 0;
            if (isContest.entryFee != 0 and isContest.slotsUsed != 0) {
              let rewardMap = getRewardMap({
                slotsUsed = isContest.slotsUsed;
                entryFee = isContest.entryFee;
              });
              switch (rewardMap.get(1)) {
                case (null) {};
                case (?isReward) {
                  firstPrize := isReward;

                };
              };

            };
            switch (match) {
              case (?isMatch) {
                let homeTeam = teamStorage.get(isMatch.homeTeam);
                let awayTeam = teamStorage.get(isMatch.awayTeam);
                let homeScore = isMatch.homeScore;
                let awayScore = isMatch.awayScore;
                switch (homeTeam, awayTeam) {
                  case (?isHome, ?isAway) {
                    let newContest = {
                      isContest with matchName = getMatchName(isHome, isAway);
                      homeTeamName = isHome.name;
                      awayTeamName = isAway.name;
                      awayScore = awayScore;
                      homeScore = homeScore;
                      firstPrize = firstPrize;
                    };
                    contestMap.put(participant.contestId, newContest);
                    // contestsBuffer.add((participant.contestId, newContest));
                  };
                  case (_, _) {

                  };
                };

              };
              case (null) {};
            };

          };
          case (null) {};
        };
      };
    };
    // return Buffer.toArray(contestsBuffer);
    return Iter.toArray(contestMap.entries());
  };

  public query func getPaginatedContestsByMatchId(matchId : Key, props : GetProps) : async ReturnPagContests {
    let contests = Buffer.Buffer<(Key, Contest and { firstPrize : Nat })>(contestStorage.size());
    var totalCount = 0;

    // Count total number of contests matching matchId
    for ((_, contest) in contestStorage.entries()) {
      if (contest.matchId == matchId) {
        totalCount += 1;

      };
    };
    if (totalCount == 0) {
      return { contests = []; total = totalCount };
    };

    let startIndex : Nat = (props.page) * props.limit;
    var endIndex : Nat = startIndex + props.limit;

    // Adjust endIndex if props.limit exceeds total number of contests
    if (endIndex > totalCount) {
      endIndex := totalCount;
    };

    // If startIndex is beyond total count, return empty array
    if (startIndex >= totalCount) {
      return { contests = []; total = totalCount };
    };

    // Iterate through contestStorage to collect contests for pagination
    var count : Nat = 0;
    label participantLoop for ((key, contest) in contestStorage.entries()) {
      if (contest.matchId == matchId) {
        count += 1;
        if (count > startIndex and count <= endIndex) {
          var firstPrize = 0;
          if (contest.entryFee != 0 and contest.slotsUsed != 0) {
            let rewardMap = getRewardMap({
              slotsUsed = contest.slotsUsed;
              entryFee = contest.entryFee;
            });
            switch (rewardMap.get(1)) {
              case (null) {};
              case (?isReward) {
                firstPrize := isReward;

              };
            };

          };
          contests.add((key, { contest with firstPrize = firstPrize }));
        };
        if (count == endIndex) {
          break participantLoop; // Exit loop once endIndex is reached
        };
      };
    };

    return { contests = Buffer.toArray(contests); total = totalCount };
  };
  public query ({ caller }) func getFilterdContests(props : GetProps) : async ReturnContests {
    let currentTime = getTime();
    var limit = getLimit(props.limit);
    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    if (props.status == "0") {
      isUpcoming := true;
    } else if (props.status == "1") {
      isUpcoming := false;
    } else if (props.status == "2") {
      isUpcoming := false;
      isCompleted := true;
    };

    var contestMap = Map.HashMap<Key, MatchContest>(participantStorage.size(), Text.equal, Text.hash);
    label participantLoop for ((key, participant) in participantStorage.entries()) {
      if (participant.userId == Principal.toText(caller)) {
        let isAlreadyIncluded = contestMap.get(participant.contestId);
        if (isAlreadyIncluded != null) {
          continue participantLoop;
        };

        let contest = contestStorage.get(participant.contestId);
        switch (contest) {
          case (?isContest) {
            var firstPrize = 0;
            if (isContest.entryFee != 0 and isContest.slotsUsed != 0) {
              let rewardMap = getRewardMap({
                slotsUsed = isContest.slotsUsed;
                entryFee = isContest.entryFee;
              });
              switch (rewardMap.get(1)) {
                case (null) {};
                case (?isReward) {
                  firstPrize := isReward;

                };
              };

            };
            let match = matchStorage.get(isContest.matchId);
            switch (match) {
              case (?isMatch) {
                let homeTeam = teamStorage.get(isMatch.homeTeam);
                let awayTeam = teamStorage.get(isMatch.awayTeam);
                let homeScore = isMatch.homeScore;
                let awayScore = isMatch.awayScore;
                let matchTime = isMatch.time;
                let isMatchUpcoming = (matchTime > currentTime);
                let isMatchCompleted = (matchTime < currentTime);
                if (isUpcoming and not isMatchUpcoming) continue participantLoop;
                if (isCompleted and not isMatchCompleted) continue participantLoop;
                if (not ((isUpcoming and isMatchUpcoming) or (((not isUpcoming) and isMatchCompleted)))) continue participantLoop;
                if (not ((isCompleted and checkMatchCompleted(isMatch.status)) or (not isCompleted and not checkMatchCompleted(isMatch.status)))) continue participantLoop;
                switch (homeTeam, awayTeam) {
                  case (?isHome, ?isAway) {
                    if (not search({ compare = isContest.name; s = props.search }) and not search({ compare = getMatchName(isHome, isAway); s = props.search })) continue participantLoop;

                    let newContest = {
                      isContest with matchName = getMatchName(isHome, isAway);
                      homeTeamName = isHome.name;
                      awayTeamName = isAway.name;
                      awayScore = awayScore;
                      homeScore = homeScore;
                      firstPrize = firstPrize;
                    };

                    contestMap.put(participant.contestId, newContest);

                  };
                  case (_, _) {

                  };
                };

              };
              case (null) {};
            };

          };
          case (null) {};
        };
      };
    };
    let filteredArr = Iter.toArray(contestMap.entries());
    let totalContests = Array.size(filteredArr);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalContests) {
      return { total = totalContests; contests = [] };

    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalContests) {
      endIndex := totalContests;
    };

    let slicedContests = Iter.toArray(Array.slice<(Key, MatchContest)>(filteredArr, startIndex, endIndex));
    return {
      total = totalContests;
      contests = slicedContests;
    };
  };
  public query func getRewardPercentage() : async Nat {
    var _rewardPercentage = rewardPercentage;
    let maybePlatformPercentage = adminSettingStorage.get(Types.AdminSettings.platformPercentage);
    switch (maybePlatformPercentage) {
      case (null) {};
      case (?platformPercentage) {
        _rewardPercentage := textToNat(platformPercentage.settingValue);
      };
    };
    return _rewardPercentage;
  };
  public query ({ caller }) func getContestTypes(isAll : Bool) : async Types.RContestTypes {
    let contestTypesBuffer = Buffer.Buffer<Types.RContestType>(0);
    label typeLoop for ((key, contestType) in contestTypeStorage.entries()) {
      if (isAll) {
        onlyAdmin(caller);
      };
      if ((not isAll and not contestType.isActive)) continue typeLoop;
      contestTypesBuffer.add({ contestType with id = key });
    };
    return Buffer.toArray(contestTypesBuffer);
  };

  // public query func getRankingOfSquads
  // Participant
  public shared ({ caller }) func addParticipant(iContestId : Key, squadId : Key, offset : Int) : async ReturnAddParticipant {
    onlyUser(caller);
    let contest = contestStorage.get(iContestId);
    let userId = Principal.toText(caller);
    switch (contest) {
      case (?isContest) {

        let maybeMatch = matchStorage.get(isContest.matchId);
        switch (maybeMatch) {
          case (?isMatch) {
            if (not isInFuture(isMatch.time)) {
              // onlyAdmin(caller);

              return #err(#GenericError { error_code = 0; message = "Time limit exceeded" });
            };
            let newParticipant : Participant = {
              userId;
              squadId = squadId;
              contestId = iContestId;
              transactionId = "";
              isRewarded = false;
              rank = 0;
            };

            var isAlreadyParticipated = false;
            var maxTeamsLimitReached = false;
            var teamsJoined = 0;
            label participants for (participant in participantStorage.vals()) {
              if (participant.contestId == iContestId and participant.userId == userId) {
                teamsJoined := teamsJoined + 1;
                if (participant.squadId == squadId) {
                  isAlreadyParticipated := true;
                };
                if (teamsJoined >= isContest.teamsPerUser) {
                  maxTeamsLimitReached := true;
                  break participants;
                };
              };
            };

            if (isAlreadyParticipated) {
              return #err(#GenericError { error_code = 0; message = "Already Participated" });
            };
            if (maxTeamsLimitReached) {
              return #err(#GenericError { error_code = 0; message = "Maximum Team Limit Reached" });
            };
            let maybeSquad = playerSquadStorage.get(squadId);
            if (Option.isNull(maybeSquad)) return #err(#GenericError { error_code = 0; message = "Error joining contest please refresh the page and try again" });
            let isPaid = isContest.entryFee != 0;
            if (isPaid) {
              let transfer = await transferToAdmin(caller, isContest.entryFee, isContest.paymentMethod);
              switch (transfer) {
                case (#Err(error)) {
                  return #err(error);
                };
                case (#Ok(_)) {};
              };
            };

            switch (maybeSquad) {
              // there isContest no way that this will be null because of the check above
              case (null) {};
              case (?squad) {
                let _updatedSquad = playerSquadStorage.replace(
                  squadId,
                  {
                    squad with
                    hasParticipated = true;
                  },
                );
              };
            };

            let newSlotsUsed = isContest.slotsUsed + 1;
            let newContest : Contest = {
              creatorUserId = isContest.creatorUserId;
              name = isContest.name;
              matchId = isContest.matchId;
              entryFee = isContest.entryFee;
              slots = isContest.slots;
              slotsUsed = newSlotsUsed;
              rewardDistribution = isContest.rewardDistribution;
              minCap = isContest.minCap;
              maxCap = isContest.maxCap;
              providerId = isContest.providerId;
              teamsPerUser = isContest.teamsPerUser;
              winner = isContest.winner;
              isDistributed = isContest.isDistributed;
              rules = isContest.rules;
              paymentMethod = isContest.paymentMethod;
            };
            let _t = contestStorage.replace(iContestId, newContest);
            let _res = pIncreaseParticipant({
              id = userId;
              assetsVal = null;
            });
            let transactionCanister = actor (init.transactionCanisterId) : actor {
              addTransaction : (Transaction, ?Text) -> async Result.Result<(Text), (Text, Bool)>;
            };
            let adminPrincipal = Principal.fromText(Types.MASTER_WALLET);
            let currentTime = getTime();

            var tempTrans : Transaction = {
              user = caller;
              from = caller;
              to = adminPrincipal;
              amount = isContest.entryFee;
              created_at_time = currentTime;
              contestId = iContestId;
              transaction_type = #send;
              title = "Entry Fee";
            };
            var transactionId = "";
            if (isPaid) {
              transactionId := Types.generateNewRemoteObjectId();
              let isId = await transactionCanister.addTransaction(tempTrans, null);
              switch (isId) {
                case (#ok(id)) { transactionId := id };
                case (#err(_)) {};
              };
            };
            participantStorage.put(
              squadId # iContestId,
              { newParticipant with transactionId },
            );
            var startDate : Int = Date_In_Miliseconds.september15;
            let endDate = Date_In_Miliseconds.november15;
            if (startDate <= isMatch.time and endDate >= isMatch.time) {
              addMatchToJoinedList(isContest.matchId, userId); //new

            };
          
            return #ok("Participated successfully");
          };
          case (null) {
            return #err(#GenericError { error_code = 0; message = "No match found" });
          };
        };
      };
      case (null) {
        return #err(#GenericError { error_code = 0; message = "No such Contest" });
      };
    };

  };
  public query func getParticipants(contestId : Key) : async Participants {
    let participantsBuffer = Buffer.Buffer<(Key, Participant)>(participantStorage.size());
    for ((key, participant) in participantStorage.entries()) {
      if (participant.contestId == contestId) {
        participantsBuffer.add((key, participant));
      };
    };
    return Buffer.toArray(participantsBuffer);
  };

  public query func getAllParticipants() : async Participants {
    let participantsBuffer = Buffer.Buffer<(Key, Participant)>(participantStorage.size());
    for ((key, participant) in participantStorage.entries()) {
      participantsBuffer.add((participant.userId, participant));

    };

    return Buffer.toArray(participantsBuffer);
  };
  func _includes(item : Key, items : [Key]) : Bool {
    var _res = false;
    label includeloop for (i in items.vals()) {
      if (i == item) {
        _res := true;
        break includeloop;
      };
    };
    return _res;
  };
  func getJoinedContestsSquadIds(userId : Key, contestId : ?Key) : [Key] {
    let contestKeys = Buffer.Buffer<Key>(participantStorage.size());
    for ((key, participant) in participantStorage.entries()) {
      switch (contestId) {
        case (null) {
          if (participant.userId == userId) {
            contestKeys.add(participant.squadId);
          };
        };
        case (?isContestId) {
          if (participant.userId == userId and isContestId == participant.contestId) {
            contestKeys.add(participant.squadId);
          };
        };
      };

    };
    return Buffer.toArray(contestKeys);
  };
  // Seasons
  public shared ({ caller }) func addSeason(season : Season) : async Bool {
    onlyAdmin(caller);
    // let seasonsBuffer = Buffer.Buffer<(Key, Season)>(seasonStorage.size());
    // let season = {}
    // for ((key, season) in seasonStorage.entries()) {
    //   if(season.tournamentId == tournamentId) {
    //     seasonsBuffer.add((key, season));
    //   }
    // };
    seasonStorage.put(Types.generateNewRemoteObjectId(), season);
    return true;
    // return Buffer.toArray(seasonsBuffer);
  };
  public shared ({ caller }) func addSeasons(seasons : [ISeason]) : async Bool {
    onlyAdmin(caller);
    for (season in seasons.vals()) {
      let id = Int.toText(Time.now()) # season.id;
      seasonStorage.put(id, season);
    };
    return true;
  };
  public shared ({ caller }) func addLeague(tournament : Tournament, season : Season, teamsWithPlayers : [ITeamWithPlayers]) {
    onlyAdmin(caller);

    let tournamentId = Types.generateNewRemoteObjectId();
    tournamentStorage.put(tournamentId, tournament);

    let seasonId = Types.generateNewRemoteObjectId();
    seasonStorage.put(seasonId, { season with tournamentId });

    for (teamWithPlayers in teamsWithPlayers.vals()) {

      let teamId = Int.toText(Time.now()) # teamWithPlayers.id;
      teamStorage.put(teamId, { teamWithPlayers with seasonId });

      for (player in teamWithPlayers.players.vals()) {

        let playerId = Int.toText(Time.now()) # player.id;
        playerStorage.put(playerId, { player with isPlaying = false; isSub = false; teamId; active = true; points = ?0 });
      };

    };
    // for (player in players.vals()) {
    //   let id = Int.toText(Time.now()) # player.id;
    //   playerStorage.put(id, { player with isPlaying = false; isSub = false; teamId = });
    // };

    // return true;
  };
  // Depricated
  public query func getSeasons(tournamentId : Key) : async Seasons {
    let seasonsBuffer = Buffer.Buffer<(Key, Season)>(seasonStorage.size());
    for ((key, season) in seasonStorage.entries()) {
      if (season.tournamentId == tournamentId) {
        seasonsBuffer.add((key, season));
      };
    };
    return Buffer.toArray(seasonsBuffer);
  };
  public query func getSeasonByProvider(id : Types.MonkeyId, tournamentProviderId : Types.MonkeyId) : async ?ISeason {
    var rSeason : ?ISeason = null;
    var tournament = utilityGetTournamentByProvider(tournamentProviderId);
    switch (tournament) {
      case (?isTournament) {
        let season = getCurrentSeason(isTournament.id);
        switch (season) {
          case (?(key, isSeason)) {
            return ?{ isSeason with id = key };
          };
          case (null) {
            return null;
          };
        };
      };
      case (null) { return null };
    };
    // var maybeTrounament = tournamentStorage.gettournamentProvider
    label seasonLoop for ((key, season) in seasonStorage.entries()) {
      if (season.providerId == id) {
        rSeason := ?{ season with id = key };
        break seasonLoop;
      };
    };
    return rSeason;
  };
  public query func getSeasonsN(tournamentId : Key, props : GetProps) : async ReturnSeasons {
    var limit = getLimit(props.limit);
    let _seasons = HashMap.mapFilter<Key, Season, Season>(
      seasonStorage,
      Text.equal,
      Text.hash,
      func(k, v) = if (search({ compare = v.seasonName; s = props.search }) and v.tournamentId == tournamentId) return ?v else return null,
    );

    let filteredArr = Iter.toArray(_seasons.entries());
    let compareFunc = func((_ka : Key, a : Season), (_kb : Key, b : Season)) : Order.Order {
      if (a.startDate < b.startDate) {
        return #less;
      } else if (a.startDate > b.startDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let sortedSeasons = Array.sort(filteredArr, compareFunc);
    let totalSeasons = Array.size(sortedSeasons);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalSeasons) {
      return { total = totalSeasons; seasons = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalSeasons) {
      endIndex := totalSeasons;
    };
    return {
      total = totalSeasons;
      seasons = Iter.toArray(Array.slice<(Key, Season)>(sortedSeasons, startIndex, endIndex));
    };

  };
  // Tournaments
  // Depricated
  public query func getTournaments() : async Tournaments {
    return Iter.toArray(tournamentStorage.entries());
  };
  public query func getTournamentsN(props : GetProps) : async ReturnTournaments {
    var limit = getLimit(props.limit);
    let _tournaments = HashMap.mapFilter<Key, Tournament, Tournament>(
      tournamentStorage,
      Text.equal,
      Text.hash,
      func(k, v) = if (search({ compare = v.name; s = props.search })) return ?v else return null,
    );

    let filteredArr = Iter.toArray(_tournaments.entries());
    let compareFunc = func((_ka : Key, a : Tournament), (_kb : Key, b : Tournament)) : Order.Order {
      if (a.startDate < b.startDate) {
        return #less;
      } else if (a.startDate > b.startDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let sortedTournaments = Array.sort(filteredArr, compareFunc);
    let totalTournaments = Array.size(sortedTournaments);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalTournaments) {
      return { total = totalTournaments; tournaments = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalTournaments) {
      endIndex := totalTournaments;
    };
    return {
      total = totalTournaments;
      tournaments = Iter.toArray(Array.slice<(Key, Tournament)>(sortedTournaments, startIndex, endIndex));
    };
  };
  public shared ({ caller }) func addTournament(tournament : Tournament) {
    onlyAdmin(caller);
    let tournamentId = Types.generateNewRemoteObjectId();
    return tournamentStorage.put(tournamentId, tournament);
  };
  public query func getTournamentByProvider(id : Types.MonkeyId) : async ?ITournament {
    var rTournament : ?ITournament = null;
    label tournamentLoop for ((key, tournament) in tournamentStorage.entries()) {
      if (tournament.providerId == id) {
        rTournament := ?{ tournament with id = key };
        break tournamentLoop;
      };
    };

    return rTournament;
  };
  public shared ({ caller }) func addTournaments(tournaments : [ITournament]) : async Bool {
    onlyAdmin(caller);

    for (tournament in tournaments.vals()) {
      let id = Int.toText(Time.now()) # tournament.id;
      tournamentStorage.put(id, tournament);
    };
    return true;
  };
  // Teams
  public query func getTeamById(teamId : Key) : async ?Team {
    return teamStorage.get(teamId);
  };
  public query func getTeamByName(teamName : Text) : async ?(Key, Team) {
    let teams = teamStorage.entries();
    var team : ?(Key, Team) = null;
    for ((key, _team) in teams) {
      if (_team.name == teamName) {
        team := ?(key, _team);
      };
    };
    return team;
  };
  private func getTeams(seasonId : Key) : Result.Result<(Teams, Nat), (Text)> {
    // let allTeams = Iter.toArray(teamStorage.entries());
    let teamBuffer = Buffer.Buffer<(Key, Team)>(teamStorage.size());
    for ((key, team) in teamStorage.entries()) {
      if (team.seasonId == seasonId) {
        teamBuffer.add((key, team));
      };
    };
    return #ok(Buffer.toArray(teamBuffer), teamBuffer.size());
  };
  public query func getTeamsBySeason(seasonId : Key) : async Result.Result<(Teams, Nat), (Text)> {
    // let allTeams = Iter.toArray(teamStorage.entries());
    return getTeams(seasonId);
  };
  public shared ({ caller }) func addTeam(team : Team) : async Team {
    onlyAdmin(caller);
    let teamId = Types.generateNewRemoteObjectId();
    teamStorage.put(teamId, team);
    return team;
  };
  public shared ({ caller }) func addTeams(teams : [ITeam]) : async Bool {
    onlyAdmin(caller);
    for (team in teams.vals()) {
      let id = Int.toText(Time.now()) # team.id;
      teamStorage.put(id, team);
    };
    return true;

  };
  public shared ({ caller }) func addTeamLogo(teamId : Key, logo : Text) : async Result.Result<(Text, Bool), (Text, Bool)> {
    onlyAdmin(caller);
    let maybeTeam = teamStorage.get(teamId);
    switch (maybeTeam) {
      case (?team) {
        var newTeam = {
          name = team.name;
          shortName = team.shortName;
          logo = logo;
          providerId = team.providerId;
          seasonId = team.seasonId;
        };
        let temp = teamStorage.replace(teamId, newTeam);
        return #ok("Logo updated", true);
      };
      case (null) {
        return #err("Team not found", false);
      };
    };
  };
  // Players
  public query func getPlayersByTeamId(teamId : Key) : async Result.Result<(Players, PlayerCount), (Text)> {
    let allPlayers = Iter.toArray(playerStorage.entries());
    var teamPlayers : Players = [];
    object countByPosition {
      public var g = 0;
      public var m = 0;
      public var f = 0;
      public var d = 0;
      public func inc(cc : Text) {
        switch (cc) {
          case ("g") { g += 1 };
          case ("m") { m += 1 };
          case ("f") { f += 1 };
          case ("d") { d += 1 };
          case (_) {};
        };
      };
    };
    for ((key, player) in allPlayers.vals()) {
      if (player.teamId == teamId) {
        teamPlayers := Array.append(teamPlayers, [(key, player)]);
        switch (player.position) {
          case (#goalKeeper) {
            // countByPosition.g += 1;
            countByPosition.inc("g");
          };
          case (#midfielder) {
            // countByPosition.m += 1;
            countByPosition.inc("m");
          };
          case (#forward) {
            // countByPosition.f += 1;
            countByPosition.inc("f");
          };
          case (#defender) {
            // countByPosition.d += 1;
            countByPosition.inc("d");
          };
        };
      };
    };
    return #ok(
      teamPlayers,
      {
        g = countByPosition.g;
        d = countByPosition.d;
        m = countByPosition.m;
        f = countByPosition.f;
      },
    );
  };
  public query func getPlayersByTeamIds(teamIds : [Key]) : async Result.Result<(Players, PlayerCount), (Text)> {
    let allPlayers = Iter.toArray(playerStorage.entries());
    var teamPlayers : Players = [];
    object countByPosition {
      public var g = 0;
      public var m = 0;
      public var f = 0;
      public var d = 0;
      public func inc(cc : Text) {
        switch (cc) {
          case ("g") { g += 1 };
          case ("m") { m += 1 };
          case ("f") { f += 1 };
          case ("d") { d += 1 };
          case (_) {};
        };
      };
    };
    for ((key, player) in allPlayers.vals()) {
      for (teamId in teamIds.vals()) {

        if (player.teamId == teamId and shouldShowPlayer(player)) {
          teamPlayers := Array.append(teamPlayers, [(key, player)]);
          switch (player.position) {
            case (#goalKeeper) {
              // countByPosition.g += 1;
              countByPosition.inc("g");
            };
            case (#midfielder) {
              // countByPosition.m += 1;
              countByPosition.inc("m");
            };
            case (#forward) {
              // countByPosition.f += 1;
              countByPosition.inc("f");
            };
            case (#defender) {
              // countByPosition.d += 1;
              countByPosition.inc("d");
            };
          };
        };
      };
    };
    return #ok(
      teamPlayers,
      {
        g = countByPosition.g;
        d = countByPosition.d;
        m = countByPosition.m;
        f = countByPosition.f;
      },
    );
  };
  public query func getPlayerIdsByTeamIds(teamIds : [Key]) : async [Key] {
    pGetPlayerIdsByTeamIds(teamIds);
  };

  public query func getPlayersByPosition(position : Position) : async Result.Result<(Players), (Text)> {
    let allPlayers = Iter.toArray(playerStorage.entries());
    var positionPlayers : Players = [];
    for ((key, player) in allPlayers.vals()) {
      if (player.position == position) {
        positionPlayers := Array.append(positionPlayers, [(key, player)]);
      };
    };
    return #ok(positionPlayers);
  };
  public shared ({ caller }) func addPlayer(player : Player) {
    onlyAdmin(caller);
    let playerId = Types.generateNewRemoteObjectId();
    return playerStorage.put(playerId, player);
  };
  public query func getPlayer(playerId : Key) : async ?Player {
    return playerStorage.get(playerId);
  };
  public shared ({ caller }) func addPlayers(players : [IPlayer]) {
    onlyAdmin(caller);
    for (player in players.vals()) {
      let id = Int.toText(Time.now()) # player.id;
      playerStorage.put(id, { player with isPlaying = false; isSub = false; active = true; points = ?0 });
    };
  };
  public shared ({ caller }) func updatePlayerStatus(playerStatuses : [IPlayerStatus]) : async [Bool] {
    onlyAdmin(caller);
    let resultBuffer = Buffer.Buffer<Bool>(playerStorage.size());
    for (playerStatus in playerStatuses.vals()) {
      let oldPlayer = playerStorage.get(playerStatus.id);
      switch (oldPlayer) {
        case (?is) {
          let newPlayer : Player = {
            is with isPlaying = playerStatus.isPlaying;
            isSub = playerStatus.isSub;
          };
          let _ = playerStorage.replace(playerStatus.id, newPlayer);
          resultBuffer.add(true);

        };
        case (null) {
          resultBuffer.add(false);

        };
      };
    };
    return Buffer.toArray(resultBuffer);
  };
  private func getPlayersByProviderId(providerId : Types.MonkeyId) : [(Key, Player)] {
    let players = Buffer.Buffer<(Key, Player)>(3);
    label playerLoop for ((key, player) in playerStorage.entries()) {
      if (player.providerId == providerId) {
        players.add((key, player));
      };
    };
    return Buffer.toArray(players);
  };
  public func testingGetPlayersByProviderId(providerId : Types.MonkeyId) : async [(Key, Player)] {
    let players = Buffer.Buffer<(Key, Player)>(3);
    label playerLoop for ((key, player) in playerStorage.entries()) {
      if (player.providerId == providerId) {
        players.add((key, player));
      };
    };
    return Buffer.toArray(players);
  };
  public func testingGetTeamByProviderId(providerId : Types.MonkeyId) : async ?(Key, Team) {
    var id : ?(Key, Team) = null;
    label teamLoop for ((key, team) in teamStorage.entries()) {
      if (team.providerId == providerId) {
        id := ?(key, team);
        break teamLoop;
      };
    };
    return id;
  };
  private func getTeamByProviderId(providerId : Types.MonkeyId) : ?(Key, Team) {
    var id : ?(Key, Team) = null;
    label teamLoop for ((key, team) in teamStorage.entries()) {
      if (team.providerId == providerId) {
        id := ?(key, team);
        break teamLoop;
      };
    };
    return id;
  };
  public shared ({ caller }) func transferPlayers(transfers : [Types.Transfer]) : async [Text] {
    onlyAdmin(caller);
    let r = Buffer.Buffer<Text>(0);
    for (transfer in transfers.vals()) {
      let maybeTeam = getTeamByProviderId(transfer.teamId);
      switch (maybeTeam) {
        case (?(teamId, team)) {
          // let newPlayer : Player = {
          let players = getPlayersByProviderId(transfer.playerId);
          var found = false;
          var maybeOldPlayer : ?(Key, Player) = null;
          for ((key, player) in players.vals()) {
            maybeOldPlayer := ?(key, player);
            if (player.teamId == teamId) {
              found := true;
              let _ = playerStorage.replace(key, { player with active = transfer.isActive });
              r.add("Deactivated player with with name: " # player.name);
              Debug.print(debug_show ("Deactivated player with with name: " # player.name, transfer.isActive));
            };
          };
          if (not found) {
            switch (maybeOldPlayer) {
              case (?(key, oldPlayer)) {
                let id = key # transfer.teamId;
                playerStorage.put(id, { oldPlayer with teamId; active = transfer.isActive });
                r.add("Added player with with name: " # oldPlayer.name);
                Debug.print(debug_show ("Added player with with name: " # oldPlayer.name, transfer.isActive));
                // r.add(true);
              };
              case (null) {

                let id = transfer.playerId # transfer.teamId;
                playerStorage.put(id, { transfer.player with teamId; active = transfer.isActive; isPlaying = false; isSub = false; points = ?0 });
                r.add("Old  player not found with this teamId: " # transfer.teamId # " and this player Id: " #transfer.playerId # " with name: " # transfer.player.name # " added in this team:" # transfer.teamId);

              };
            };
          };
          //  playerStorage.put(key, { player with teamId = transfer.teamId });

        };
        case (null) {
          r.add("Team not found: " # transfer.teamId # " and this player Id:" #transfer.playerId);
        };
      };
    };

    //   switch (maybeplayer) {
    //     case (?(key, player)) {

    //     case (null) {};
    //   };
    // };
    return Buffer.toArray(r);
  };
  func pGetMatch(matchId : Key) : ?RefinedMatch {
    let maybeMatch = matchStorage.get(matchId);
    switch (maybeMatch) {
      case (?match) {
        let homeTeam = teamStorage.get(match.homeTeam);
        let awayTeam = teamStorage.get(match.awayTeam);
        let newMatch : RefinedMatch = {
          match with
          homeTeam = (match.homeTeam, homeTeam);
          awayTeam = (match.awayTeam, awayTeam);
        };
        return ?newMatch;
      };
      case (null) {
        return null;
      };
    };
  };
  // Matches
  public query func getMatch(matchId : Key) : async ?RefinedMatch {
    return pGetMatch(matchId);
  };
  public query func getRawMatch(matchId : Key) : async ?Match {
    return matchStorage.get(matchId);
  };
  private func getJoinedContestNamesBySquadId(squadId : Key) : [Text] {
    var contestNames : [Text] = [];
    label contestName for ((key, participant) in participantStorage.entries()) {
      if (squadId == participant.squadId) {
        let contest = contestStorage.get(participant.contestId);
        switch (contest) {
          case (null) {};
          case (?isContest) {

            contestNames := Array.append(contestNames, [isContest.name]);
            //  break contestName;
          };
        };

      };

    };
    return contestNames;
  };
  public query ({ caller }) func getListPlayerSquadsByMatch(matchId : Key, contestId : ?Key) : async ListPlayerSquads {
    let playerSquad = Buffer.Buffer<(Key, ListPlayerSquad)>(playerSquadStorage.size());
    // let contestsIdsOfMatches=getContestIdsByMatch(matchId);
    let joinedContests = getJoinedContestsSquadIds(Principal.toText(caller), contestId);
    label squadsLoop for ((key, squad) in playerSquadStorage.entries()) {

      if (squad.userId == Principal.toText(caller) and matchId == squad.matchId) {
        var participated = false;
        for (id in joinedContests.vals()) {
          if (id == key) {
            participated := true;
          };
          // else {
          //   participated := false;
          // };
        };
        let newSquad = nRefinePlayerSquad(squad, key);
        // let match = matchStorage.get(squad.matchId);
        // switch (match) {
        //   case (?isMatch) {
        //     let homeTeam = teamStorage.get(isMatch.homeTeam);
        //     let awayTeam = teamStorage.get(isMatch.awayTeam);
        //     switch (homeTeam, awayTeam) {
        //       case (?isHome, ?isAway) {
        //         playerSquad.add((key, { newSquad with hasParticipated = participated; matchName = getMatchName(isHome, isAway) }));

        //       };
        //       case (_, _) {

        //       };
        //     };

        //   };
        //   case (null) {};
        // };
        var rank : Nat = 0;
        switch (contestId) {
          case (?isId) {
            for ((key, newRank) in newSquad.ranks.vals()) {
              if (key == isId) {
                rank := newRank;
              };
            };
          };
          case (null) {};
        };
        let joindedContestName = getJoinedContestNamesBySquadId(key);

        playerSquad.add((key, { newSquad with hasParticipated = participated; rank; joinedContestsName = joindedContestName }));

      };
    };
    return Buffer.toArray(playerSquad);
  };

  public query ({ caller }) func getFilterdRawPlayerSquadsByMatch(matchId : ?Key, contestId : ?Key, props : GetProps) : async ReturnTeams {
    let currentTime = getTime();
    var limit = getLimit(props.limit);
    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    if (props.status == "0") {
      isUpcoming := true;
    } else if (props.status == "1") {
      isUpcoming := false;
    } else if (props.status == "2") {
      isUpcoming := false;
      isCompleted := true;
    };
    let playerSquad = Buffer.Buffer<(Key, RawPlayerSquad)>(playerSquadStorage.size());
    //  var tempMatchId:Key="";

    // switch(matchId) {
    //   case(null) {  };
    //   case(?isId) {
    //     tempMatchId:=isId;

    //    };
    // };
    //         let contestsIdsOfMatches=getContestIdsByMatch(tempMatchId);

    let joinedContests = getJoinedContestsSquadIds(Principal.toText(caller), contestId);
    label squadsLoop for ((key, squad) in playerSquadStorage.entries()) {

      switch (matchId) {
        case (?isId) {
          if (not (squad.matchId == isId)) continue squadsLoop;
        };
        case (null) {
          // continue squadsLoop;
        };
      };

      if (squad.userId == Principal.toText(caller)) {
        var participated = false;
        for (id in joinedContests.vals()) {
          if (id == key) {
            participated := true;
          } else {
            participated := false;
          };
        };
        let newSquad = nRefinePlayerSquad(squad, key);
        let match = matchStorage.get(squad.matchId);
        switch (match) {
          case (?isMatch) {
            let homeTeam = teamStorage.get(isMatch.homeTeam);
            let awayTeam = teamStorage.get(isMatch.awayTeam);

            // Determine match status based on time
            let matchTime = isMatch.time;
            let isMatchUpcoming = (matchTime > currentTime);
            let isMatchCompleted = (matchTime < currentTime);

            // Apply filters based on the props
            if (isUpcoming and not isMatchUpcoming) continue squadsLoop;
            if (isCompleted and not isMatchCompleted) continue squadsLoop;
            if (not ((isUpcoming and isMatchUpcoming) or (((not isUpcoming) and isMatchCompleted)))) continue squadsLoop;
            if (not ((isCompleted and checkMatchCompleted(isMatch.status)) or (not isCompleted and not checkMatchCompleted(isMatch.status)))) continue squadsLoop;
            switch (homeTeam, awayTeam) {
              case (?isHome, ?isAway) {

                playerSquad.add((key, { newSquad with hasParticipated = participated; matchName = getMatchName(isHome, isAway); matchTime = matchTime }));

              };
              case (_, _) {

              };
            };

          };
          case (null) {};
        };

      };

    };
    let filteredArr = Buffer.toArray(playerSquad);
    var totalTeams = playerSquad.size();
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalTeams) {
      return { total = totalTeams; teams = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalTeams) {
      endIndex := totalTeams;
    };

    let slicedTeams = Iter.toArray(Array.slice<(Key, RawPlayerSquad)>(filteredArr, startIndex, endIndex));

    return {
      total = totalTeams;
      teams = slicedTeams;
    };
    // return Buffer.toArray(playerSquad);
  };

  public query ({ caller }) func getMatches(props : GetProps, time : ?Int) : async ReturnMatches {
    // let _matches = Iter.toArray(matchStorage.entries());
    // get current time in miliseconds
    let currentTime = getTime();
    var limit = getLimit(props.limit);
    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    var withInSixtyMinutes = false;
    var thirtyMinutes = 60 * 60 * 1000;
    if (props.status == "0") {
      isUpcoming := true;
    } else if (props.status == "1") {
      isUpcoming := false;
    } else if (props.status == "2") {
      isUpcoming := false;
      isCompleted := true;
    } else if (props.status == "3") {
      isUpcoming := false;
      withInSixtyMinutes := true;
    };
    let _matches = HashMap.mapFilter<Key, Match, RMatch>(
      matchStorage,
      Text.equal,
      Text.hash,
      func(k, v) {
        if (not search({ compare = v.location; s = props.search })) return null;
        if (not ((isUpcoming and v.time > currentTime) or (((not isUpcoming) and v.time < currentTime) or withInSixtyMinutes))) return null;
        if (not ((isCompleted and checkMatchCompleted(v.status)) or (not isCompleted and not checkMatchCompleted(v.status)))) return null;
        if (not ((withInSixtyMinutes and (v.time - currentTime) <= thirtyMinutes) or not withInSixtyMinutes)) return null;

        switch (time) {
          case (?isTime) {
            if (FantasyStoreHelper.isSameDay(isTime, v.time)) {
              return ?{ v with id = k };
            } else {
              return null;
            };
          };
          case (null) {
            return ?{ v with id = k };

          };
        };

      },
    );
    let filteredArr = Iter.toArray(_matches.vals());

    var sortedMatches : RMatches = [];
    if (isUpcoming) {
      sortedMatches := Array.sort(filteredArr, upcomingCompareFunc);
    } else {
      sortedMatches := Array.sort(filteredArr, oldMatchesCompareFunc);
    };
    // let sortedMatches : [Match] = [];
    let totalMatches = Array.size(sortedMatches);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalMatches) {
      return { total = totalMatches; matches = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalMatches) {
      endIndex := totalMatches;
    };

    let slicedMatches = Iter.toArray(Array.slice<RMatch>(sortedMatches, startIndex, endIndex));
    let matchesWithLeague = Array.mapFilter<RMatch, RTournamentMatch>(slicedMatches, addTournamentInMatch);
    return {
      total = totalMatches;
      matches = matchesWithLeague;
    };
  };
  // Get matches for dashboard
  public query ({ caller }) func getDetailedMatchesContests(props : GetProps) : async ReturnDetailedMatchContests {
    let currentTime = getTime();
    var limit = getLimit(props.limit);
    let userId = Principal.toText(caller);

    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    var all = false;
    if (props.status == "0") {
      isUpcoming := true;
    } else if (props.status == "1") {
      isUpcoming := false;
    } else if (props.status == "2") {
      isUpcoming := false;
      isCompleted := true;
    } else if (props.status == "3") {
      isUpcoming := false;
      all := true;

    };
    let _matches = HashMap.mapFilter<Key, Match, RMatch>(
      matchStorage,
      Text.equal,
      Text.hash,
      func(k, v) {
        if (not search({ compare = v.location; s = props.search })) return null;
        if (not all) {
          if (not ((isUpcoming and v.time > currentTime) or (((not isUpcoming) and v.time < currentTime)))) return null;
          if (not ((isCompleted and checkMatchCompleted(v.status)) or (not isCompleted and not checkMatchCompleted(v.status)))) return null;
        };
        let isMatchJoined = hasUserJoinedTheContest(k, userId);
        if (not isMatchJoined) return null;

        return ?{ v with id = k };

      },
    );
    let filteredArr = Iter.toArray(_matches.vals());

    if (not all) {
      var sortedMatches : RMatches = [];
      if (isUpcoming) {
        sortedMatches := Array.sort(filteredArr, upcomingCompareFunc);
      } else {
        sortedMatches := Array.sort(filteredArr, oldMatchesCompareFunc)

      };
      let sortedDetailedBuffer = Buffer.Buffer<DetailedMatchContest>((sortedMatches.size()));
      label sortedLoop for (match in sortedMatches.vals()) {

        let maybeDetailedMatchContest = (getDetailedMatchContest(match, userId));
        switch (maybeDetailedMatchContest) {
          case (?detailedMatchContest) {
            if (detailedMatchContest.teamsCreated == 0) continue sortedLoop;
            sortedDetailedBuffer.add(detailedMatchContest);
          };
          case (null) {};
        };
      };

      // let sortedMatches : [Match] = [];
      let totalMatches = sortedDetailedBuffer.size();
      let startIndex : Nat = props.page * limit;
      if (startIndex >= totalMatches) {
        return { total = totalMatches; matches = [] };
      };
      var endIndex : Nat = startIndex + limit;
      if (endIndex > totalMatches) {
        endIndex := totalMatches;
      };
      let slicedArray = Iter.toArray(Array.slice<DetailedMatchContest>(Buffer.toArray(sortedDetailedBuffer), startIndex, endIndex));
      return {
        total = totalMatches;
        matches = slicedArray;
      };
    };

    // Separate matches into categories
    let upcomingMatchesBuffer = Buffer.Buffer<RMatch>(filteredArr.size());
    let inProgressMatchesBuffer = Buffer.Buffer<RMatch>(filteredArr.size());
    let completedMatchesBuffer = Buffer.Buffer<RMatch>(filteredArr.size());

    for (match in filteredArr.vals()) {
      if (match.time > currentTime) {
        upcomingMatchesBuffer.add(match);
      } else if (checkMatchCompleted(match.status)) {
        completedMatchesBuffer.add(match);
      } else {
        inProgressMatchesBuffer.add(match);
      };
    };

    let sortedUpcomingMatches = Array.sort(Buffer.toArray(upcomingMatchesBuffer), upcomingCompareFunc);
    let sortedInProgressMatches = Array.sort(Buffer.toArray(inProgressMatchesBuffer), oldMatchesCompareFunc);
    let sortedCompletedMatches = Array.sort(Buffer.toArray(completedMatchesBuffer), oldMatchesCompareFunc);
    let combinedBuffer = Buffer.Buffer<DetailedMatchContest>((filteredArr.size()));
    var upcomingLatestIndex = 0;
    if (sortedUpcomingMatches.size() > 0) {
      // get upcoming with same time
      var latestMatchTime = sortedUpcomingMatches[0].time;
      label sameLoop for (match in sortedUpcomingMatches.vals()) {
        if (match.time == latestMatchTime) {
          let maybeDetailedMatchContest = (getDetailedMatchContest(match, userId));
          switch (maybeDetailedMatchContest) {
            case (?detailedMatchContest) {
              if (detailedMatchContest.teamsCreated == 0) continue sameLoop;
              combinedBuffer.add({ detailedMatchContest with latest = true });
              upcomingLatestIndex += 1;
            };
            case (null) {};
          };
        } else {
          break sameLoop;
        };
      };

    };
    var inprogressLatestIndex = 0;
    if (sortedInProgressMatches.size() > 0) {
      var latestMatchTime = sortedInProgressMatches[0].time;
      label sameLoop for (match in sortedInProgressMatches.vals()) {
        if (match.time == latestMatchTime) {

          let maybeDetailedMatchContest = (getDetailedMatchContest(match, userId));
          switch (maybeDetailedMatchContest) {
            case (?detailedMatchContest) {
              if (detailedMatchContest.teamsCreated == 0) continue sameLoop;
              combinedBuffer.add({ detailedMatchContest with latest = true });
              inprogressLatestIndex += 1;
            };
            case (null) {};
          };
        } else {
          break sameLoop;
        };
      };
    };
    var upcomingIndex = 0;
    label upcomingLoop for (match in sortedUpcomingMatches.vals()) {
      if (upcomingIndex < upcomingLatestIndex) {
        upcomingIndex += 1;
        continue upcomingLoop;
      };

      let maybeDetailedMatchContest = (getDetailedMatchContest(match, userId));
      switch (maybeDetailedMatchContest) {
        case (?detailedMatchContest) {
          if (detailedMatchContest.teamsCreated == 0) continue upcomingLoop;
          combinedBuffer.add(detailedMatchContest);
        };
        case (null) {};
      };

    };
    var inprogressIndex = 0;
    label inProgressLoop for (match in sortedInProgressMatches.vals()) {
      if (inprogressIndex < inprogressLatestIndex) {
        inprogressIndex += 1;
        continue inProgressLoop;
      };

      let maybeDetailedMatchContest = (getDetailedMatchContest(match, userId));
      switch (maybeDetailedMatchContest) {
        case (?detailedMatchContest) {
          if (detailedMatchContest.teamsCreated == 0) continue inProgressLoop;
          combinedBuffer.add(detailedMatchContest);
        };
        case (null) {};
      };

    };
    label completedLoop for (match in sortedCompletedMatches.vals()) {

      let maybeDetailedMatchContest = (getDetailedMatchContest(match, userId));
      switch (maybeDetailedMatchContest) {
        case (?detailedMatchContest) {
          if (detailedMatchContest.teamsCreated == 0) continue completedLoop;
          combinedBuffer.add(detailedMatchContest);
        };
        case (null) {};
      };

    };
    let totalMatches = combinedBuffer.size();
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalMatches) {
      return { total = totalMatches; matches = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalMatches) {
      endIndex := totalMatches;
    };

    let slicedArray = Iter.toArray(Array.slice<DetailedMatchContest>(Buffer.toArray(combinedBuffer), startIndex, endIndex));
    return {
      total = totalMatches;
      matches = slicedArray;
    };
  };

  private func pGetMatches(props : GetProps, time : ?Int, offset : Int, tournamentId : ?Key) : RMatches {
    let currentTime = getTime();
    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    var withInThirtyMinutes = false;
    var isOngoing = false;

    var thirtyMinutes = 30 * 60 * 1000;
    if (props.status == "0") {
      isUpcoming := true;
    } else if (props.status == "1") {
      isUpcoming := false;
      isOngoing := true;
    } else if (props.status == "2") {
      isUpcoming := false;
      isCompleted := true;
    } else if (props.status == "3") {
      isUpcoming := false;
      withInThirtyMinutes := true;
    };
    let _matches = HashMap.mapFilter<Key, Match, RMatch>(
      matchStorage,
      Text.equal,
      Text.hash,
      func(k, v) {
        if (not search({ compare = v.location; s = props.search })) return null;
        //checking for is match upcomming
        if (not ((isUpcoming and v.time > currentTime) or (((not isUpcoming) and v.time < currentTime) or withInThirtyMinutes))) {
          return null;

        };
        //checking for is match completed

        if (not ((isCompleted and checkMatchCompleted(v.status)) or (not isCompleted and not checkMatchCompleted(v.status)))) {
          return null;
        };
        //checking for is match inprogress

        if (not ((withInThirtyMinutes and (v.time - currentTime) <= thirtyMinutes) or not withInThirtyMinutes)) {
          return null;
        };
        //is match inprogress and match status is "Time to be defined" then dont show it inprogress match list
        if (isOngoing and v.status == "Time to be defined") {
          return null;
        };

        switch (tournamentId) {
          case (?isId) {

            let season = getCurrentSeason(isId);
            switch (season) {
              case (?(key, _)) {
                if (not (v.seasonId == key)) return null;
              };
              case (null) {
                return null;
              };
            };
          };
          case (null) {};
        };
        switch (time) {
          case (?isTime) {
            if (isCompleted) {

              if (FantasyStoreHelper.isSameDayWithOffset(isTime, v.time, offset)) {
                return ?{ v with id = k };
              } else {
                return null;
              };
            } else {
              if (v.time >= isTime) {
                return ?{ v with id = k };
              } else {
                return null;
              };
            };

          };
          case (null) {
            return ?{ v with id = k };

          };
        };

      },
    );

    let filteredArr = Iter.toArray(_matches.vals());
    let compareFunc = func((a : RMatch), (b : RMatch)) : Order.Order {
      if (a.time < b.time) {
        return #less;
      } else if (a.time > b.time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let oldMatchesCompareFunc = func((a : RMatch), (b : RMatch)) : Order.Order {
      if (a.time > b.time) {
        return #less;
      } else if (a.time < b.time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    var sortedMatches : RMatches = [];
    if (isUpcoming) {
      sortedMatches := Array.sort(filteredArr, compareFunc);
    } else {
      sortedMatches := Array.sort(filteredArr, oldMatchesCompareFunc)

    };
    return sortedMatches;
  };
  // function for filtering the matchws with tournamnet
  public query func getMatchesWithTournamentId(props : GetProps, time : ?Int, offset : Int, tournamentId : ?Key) : async ReturnMatches {

    var limit = getLimit(props.limit);
    let sortedMatches = pGetMatches(props : GetProps, time : ?Int, offset : Int, tournamentId : ?Key);
    // let sortedMatches : [Match] = [];
    let totalMatches = Array.size(sortedMatches);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalMatches) {
      return { total = totalMatches; matches = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalMatches) {
      endIndex := totalMatches;
    };

    let slicedMatches = Iter.toArray(Array.slice<RMatch>(sortedMatches, startIndex, endIndex));
    let matchesWithLeague = Array.mapFilter<RMatch, RTournamentMatch>(slicedMatches, addTournamentInMatch);
    return {
      total = totalMatches;
      matches = matchesWithLeague;
    };

  };
  public query func getUpcomingMatches(props : GetProps, endTime : Nat) : async ReturnMatches {
    // let _matches = Iter.toArray(matchStorage.entries());
    // get current time in miliseconds
    let currentTime = getTime();
    var limit = getLimit(props.limit);
    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    if (props.status == "0") {
      isUpcoming := true;
    } else if (props.status == "1") {
      isUpcoming := false;
    } else if (props.status == "2") {
      isUpcoming := false;
      isCompleted := true;
    };
    let _matches = HashMap.mapFilter<Key, Match, RMatch>(
      matchStorage,
      Text.equal,
      Text.hash,
      func(k, v) = if (search({ compare = v.location; s = props.search }) and ((isUpcoming and v.time > currentTime) or (not isUpcoming and v.time < currentTime)) and ((isCompleted and checkMatchCompleted(v.status)) or (not isCompleted and not checkMatchCompleted(v.status))) and v.time < endTime) {
        return ?{ v with id = k };
      } else {
        return null;
      },
    );
    let filteredArr = Iter.toArray(_matches.vals());
    let compareFunc = func((a : RMatch), (b : RMatch)) : Order.Order {
      if (a.time < b.time) {
        return #less;
      } else if (a.time > b.time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let oldMatchesCompareFunc = func((a : RMatch), (b : RMatch)) : Order.Order {
      if (a.time > b.time) {
        return #less;
      } else if (a.time < b.time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    var sortedMatches : RMatches = [];
    if (isUpcoming) {
      sortedMatches := Array.sort(filteredArr, compareFunc);
    } else {
      sortedMatches := Array.sort(filteredArr, oldMatchesCompareFunc)

    };
    // let sortedMatches : [Match] = [];
    let totalMatches = Array.size(sortedMatches);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalMatches) {
      return { total = totalMatches; matches = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalMatches) {
      endIndex := totalMatches;
    };

    let slicedMatches = Iter.toArray(Array.slice<RMatch>(sortedMatches, startIndex, endIndex));
    let matchesWithLeague = Array.mapFilter<RMatch, RTournamentMatch>(slicedMatches, addTournamentInMatch);
    return {
      total = totalMatches;
      matches = matchesWithLeague;
    };
  };
  public query func getMatchesByTeamId(teamId : Key) : async Matches {
    let matches = Iter.toArray(matchStorage.entries());
    let compare = func((keyA : Key, a : Match), (keyB : Key, b : Match)) : Order.Order {
      if (a.time > b.time) {
        return #less;
      } else if (a.time < b.time) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let sortedMatches = Array.sort(matches, compare);
    // var teamMatches : Matches = [];
    var teamMatches : Buffer.Buffer<(Key, Match)> = Buffer.Buffer<(Key, Match)>(sortedMatches.size());
    for ((key, match) in sortedMatches.vals()) {
      if (match.homeTeam == teamId or match.awayTeam == teamId) {
        // teamMatches := teamMatches # [match]; // Add the match directly to the array
        teamMatches.add((key, match));
      };
    };
    return Buffer.toArray(teamMatches);
  };

  public shared ({ caller }) func addMatch(match : InputMatch) : async Result.Result<(Text, Match), (Text, Bool)> {
    onlyAdmin(caller);
    let maybeHomeTeam = await getTeamByName(match.homeTeamName);
    let maybeAwayTeam = await getTeamByName(match.awayTeamName);
    switch (maybeHomeTeam) {
      case (?(homeKey, homeTeam)) {
        switch (maybeAwayTeam) {
          case (?(awayKey, awayTeam)) {
            let newMatch = {
              // time = match.time;
              // location = match.location;
              // providerId = match.providerId;
              // seasonId = match.seasonId;
              // status = match.status;
              match with
              homeTeam = homeKey;
              awayTeam = awayKey;
            };
            let matchId = Types.generateNewRemoteObjectId();
            matchStorage.put(matchId, newMatch);
            addMatchDateIndex(newMatch.time, matchId);
            return #ok("Match added Successfully", newMatch);
          };
          case (null) {
            return #err("AwayTeam not found", false);
          };
        };
      };
      case (null) {
        return #err("HomeTeam not found", false);

      };
    };

  };

  public shared ({
    caller;
  }) func addDefaultContestsOnMatches() : async Result.Result<(Text), (Text)> {
    onlyAdmin(caller);
    let currentTime = getTime();

    for ((key, match) in matchStorage.entries()) {
      if (match.time >= currentTime) {
        let alreadyContestCreated = alreadyContestsCreated(key);
        let id = Int.toText(Time.now()) # key;
        if (not alreadyContestCreated.isGoldContestCreated) {
          contestStorage.put(
            id,
            {
              Types.Default_Contests[0] with matchId = key;
              creatorUserId = "";
              slotsUsed = 0;
              winner = null;
              isDistributed = false;
            },
          );
        };
        if (not alreadyContestCreated.isBronzeContestCreated) {
          contestStorage.put(
            id # "124",
            {
              Types.Default_Contests[1] with matchId = key;
              creatorUserId = "";
              slotsUsed = 0;
              winner = null;
              isDistributed = false;
            },
          );
        };

      };
    };
    return #ok("contest created successfully");
  };
  public shared ({ caller }) func updateMatchStatus(status : MatchStatus, matchId : Key) : async Bool {
    onlyAdmin(caller);
    let maybeMatch = matchStorage.get(matchId);
    switch (maybeMatch) {
      case (?match) {
        // if(status == )
        if (isInFuture(match.time)) {
          Debug.print(debug_show ("Match was in future"));
          return false;
        };
        let _ = matchStorage.replace(matchId, { match with status });
        if (status == Types.MatchStatuses.finished) {
          let contestsids = getContestIdsByMatch(matchId);
          for (contestId in contestsids.vals()) {
            let maybeContest = contestStorage.get(contestId);
            switch (maybeContest) {
              case (null) {};
              case (?contest) {
                // let squads = Buffer.Buffer<PlayerSquad>(playerSquadStorage.size());
                var winner : ?Key = null;
                label squadLoop for ((key, squad) in playerSquadStorage.entries()) {
                  if (squad.matchId == matchId and squad.rank == 1) {
                    winner := ?squad.userId;
                    break squadLoop;
                    // squads.add(squad);
                  };
                  // if (squads.size() == contest.slots) {
                  //   break squadLoop;
                  // };
                };
                switch (winner) {
                  case (null) {};
                  case (?isWinner) {
                    // update contest won stat
                    let _ = increaseContestWon({
                      id = isWinner;
                      assetsVal = null;
                    });
                  };
                };
                // add winner
                let _oldContest = contestStorage.replace(contestId, { contest with winner = winner });
              };
            };
            // reset lineup
            resetPlayerSquadByTeamIds([match.homeTeam, match.awayTeam]);

            let _resp = await nDistributeRewards(matchId, contestId);
            Debug.print(debug_show (_resp, "DONE WITH IT "));

          };

        };

        // update match status
        return true;
      };
      case (null) {
        Debug.print(debug_show ("Match was not found"));

        return false;
      };
    };

  };
  private func addMatchToMvps(matchId : Key) {
    let isAlready = Array.find<Key>(mvps_matches_ids, func x = x == matchId);
    switch (isAlready) {
      case (?isExisted) {};
      case (null) {
        if (mvps_matches_ids.size() <= 5) {
          mvps_matches_ids := Array.append([matchId], mvps_matches_ids)

        } else {
          mvps_matches_ids := Array.append([matchId], Iter.toArray(Array.slice<Key>(mvps_matches_ids, 0, 4)));
        };
      };
    };

  };
  public shared ({ caller }) func addMatchToMvpsAdmin(matchId : Key) {
    onlyAdmin(caller);
    addMatchToMvps(matchId);

  };
  public shared ({ caller }) func updateMatchScore(data : Types.MatchScore) : async Bool {
    onlyAdmin(caller);
    let maybeMatch = matchStorage.get(data.id);
    switch (maybeMatch) {
      case (?match) {
        let _ = matchStorage.replace(data.id, { match with homeScore = data.homeScore; awayScore = data.awayScore });
        return true;
      };
      case (null) {
        Debug.print(debug_show ("Match was not found"));
        return false;
      };
    };
  };
  public shared ({ caller }) func finishMatch(inputMatch : Types.MatchScore) : async Result.Result<Text, Text> {
    onlyAdmin(caller);
    let maybeMatch = matchStorage.get(inputMatch.id);

  
    switch (maybeMatch) {
      case (null) {
        return #err("Match not found");
      };
      case (?match) {
        if (isInFuture(match.time)) {
          return #err("Match in future");
        };
        // TODO
        if (match.status == Types.MatchStatuses.finished) return #err("Match already dead");
        Debug.print(debug_show ("Updating match with this score:::", inputMatch.homeScore, inputMatch.awayScore));
        let _ = matchStorage.replace(inputMatch.id, { match with status = inputMatch.status; homeScore = inputMatch.homeScore; awayScore = inputMatch.awayScore });
        if (inputMatch.status != Types.MatchStatuses.finished) {
          return #err("Match not finished");
        };
        let contestsids = getContestIdsByMatch(inputMatch.id);
        label contestLoop for (contestId in contestsids.vals()) {
          let maybeContest = contestStorage.get(contestId);

          switch (maybeContest) {
            case (null) {
              return #err("No contest found");
            };
            case (?contest) {
              // let squads = Buffer.Buffer<PlayerSquad>(playerSquadStorage.size());
              var winner : ?Key = null;

              label squadLoop for ((key, squad) in playerSquadStorage.entries()) {
                if (squad.matchId == inputMatch.id) {
                  let maybeParticipant = participantStorage.get(key # contestId);
                  switch (maybeParticipant) {
                    case (?participant) {
                      if (participant.rank == 1) {
                        winner := ?squad.userId;
                        break squadLoop;
                      };
                    };
                    case (null) {};
                  };

                 
                };
               
              };
              switch (winner) {
                case (null) {
                  continue contestLoop;
                  // return #err("No winner found");
                };
                case (?isWinner) {
             
                  // add match to mvps
                  addMatchToMvps(inputMatch.id);
                
                  if (contest.entryFee != 0) {
                    let _resp = await nDistributeRewards(inputMatch.id, contestId);
                    Debug.print(debug_show (_resp, "DONE WITH IT "));
                  };
                  // update contest won stat
                  let _ = increaseContestWon({ id = isWinner; assetsVal = null });
                };
              };
              // add winner
              let _oldContest = contestStorage.replace(contestId, { contest with winner = winner });
            };
          };
          // reset lineup

        };
        resetPlayerSquadByTeamIds([match.homeTeam, match.awayTeam]);

        
        return #ok("Match finished" );
      };

    };

  };

  public shared ({ caller }) func postponeMatch(matchId : Key, status : MatchStatus) : async Bool {
    onlyAdmin(caller);
    switch (matchStorage.get(matchId)) {
      case (?match) {
        if (status == Types.MatchStatuses.postponed) {
          ignore matchStorage.replace(matchId, { match with status });
          return true;
        } else return false;
      };
      case (null) {
        return false;
      };
    };
  };
  public shared ({ caller }) func reScheduleMatch(matchId : Key, status : MatchStatus) : async Bool {
    onlyAdmin(caller);
    switch (matchStorage.get(matchId)) {
      case (?match) {
        if (status != Types.MatchStatuses.postponed) {
          ignore matchStorage.replace(matchId, { match with status });
          return true;
        } else return false;
      };
      case (null) {
        return false;
      };
    };
  };

 
  public shared ({ caller }) func nDistributeRewards(matchId : Key, contestId : Key) : async ReturnAddParticipant {
    onlyAdmin(caller);
    Debug.print(debug_show ("we started distribution"));
    let maybeMatch = matchStorage.get(matchId);
    switch (maybeMatch) {
      case (null) {
        return #err(#GenericError { error_code = 0; message = "Match not found" });
      };
      case (?match) {
        if (isInFuture(match.time)) return #err(#GenericError { error_code = 0; message = "Match not finished" });
        if (match.status != Types.MatchStatuses.finished) {
          return #err(#GenericError { error_code = 0; message = "Match not finished" });
        };
        let maybeContest = contestStorage.get(contestId);
        switch (maybeContest) {
          case (null) {
            return #err(#GenericError { error_code = 0; message = "Contest not found" });
          };
          case (?contest) {
            if (contest.isDistributed) return #err(#GenericError { error_code = 0; message = "Already distributed" });
            if (contest.entryFee == 0) return #err(#GenericError { error_code = 0; message = "Error while distribution" });
            // Initiate canister actor to call methods
            let transactionCanister = actor (init.transactionCanisterId) : actor {
              getAllTransactions : (Types.GetAllTransactionProps) -> async Types.ReturnTransactions;
              addTransaction : (Transaction, ?Text) -> async Result.Result<(Text), (Text, Bool)>;
            };
            let limit = 10;
            var page = 0;
            // Get all the transactions related to this contest and store them in a hashmap.
            let initialTransactions = await transactionCanister.getAllTransactions({
              page;
              limit;
              userId = null;
              contestId = ?contestId;
            });
            let transactionMap = Map.fromIter<Key, Transaction>(initialTransactions.transaction.vals(), 0, Text.equal, Text.hash);
            while (transactionMap.size() < initialTransactions.total) {
              let newTransactions = await transactionCanister.getAllTransactions({
                page;
                limit;
                userId = null;
                contestId = ?contestId;
              });
              for ((key, transaction) in newTransactions.transaction.vals()) {
                transactionMap.put(key, transaction);
              };
              if (transactionMap.size() < initialTransactions.total) page += 1;
            };

            //
            Debug.print(debug_show ("we got soo close though!!!", contest.slotsUsed, contest.entryFee));
            let rewardMap = getRewardMap({
              slotsUsed = contest.slotsUsed;
              entryFee = contest.entryFee;
            });
            Debug.print(debug_show ("we did itttttt!!!", Iter.toArray(rewardMap.entries())));

            // check all the participant of this contest and get squad and reward them
            var particpantIndex = 0;
            label participantLoop for ((key, participant) in participantStorage.entries()) {
              particpantIndex += 1;
              if (participant.contestId == contestId) {
                if (participant.isRewarded) return #err(#GenericError { error_code = 0; message = "Already rewarded participant" });
                let userId = Principal.fromText(participant.userId);
                let maybeSquad = playerSquadStorage.get(participant.squadId);
                switch (maybeSquad) {
                  case (null) {
                    Debug.print(debug_show ("Squad not found", { matchId; squadId = participant.squadId }));
                    return #err(#GenericError { error_code = 0; message = "Squad not found" });
                  };
                  case (?squad) {

                    let maybeTransaction = transactionMap.get(participant.transactionId);
                    switch (maybeTransaction) {
                      case (?transaction) {
                        // If amount in transaction and the fee of contest do not match return error
                        if (transaction.amount != contest.entryFee) {
                          Debug.print(debug_show ("Amount Difference", participant.transactionId, matchId, { amount = transaction.amount; fee = contest.entryFee }));
                          return #err(#GenericError { error_code = 0; message = "Amount Difference" });
                        };

                        // Give reward from admin wallet to user wallet

                        switch (rewardMap.get(participant.rank)) {
                          case (?reward) {
                            let transfer = await transferFromAdmin(userId, reward, contest.paymentMethod);
                            switch (transfer) {
                              case (#Ok(_)) {
                                var tempTrans : Transaction = {
                                  user = userId;
                                  from = adminPrincipal;
                                  to = userId;
                                  amount = reward;
                                  created_at_time = getTime();
                                  contestId = contestId;
                                  transaction_type = #receive;
                                  title = "Contest Reward";
                                };
                                let _ = pIncreaseRewardsWon({
                                  id = Principal.toText(userId);
                                  assetsVal = ?reward;
                                });

                                // Add transaction
                                let _res2 = transactionCanister.addTransaction(tempTrans, ?Nat.toText(particpantIndex));

                             
                              };
                              case (#Err(error)) {
                                return #err(error);
                              };
                            };
                          };
                          case (null) {};
                        };
                        // Change participant status to rewarded
                        let _newSquad = participantStorage.replace(key, { participant with isRewarded = true });
                      };
                      case (null) {
                        Debug.print(debug_show ("transaction not found", participant.transactionId, matchId));
                        return #err(#GenericError { error_code = 0; message = "Transaction not found" });
                      };
                    };
                  };
                };
              };
            };
            let _newContest = contestStorage.replace(contestId, { contest with isDistributed = true });
            return #ok("Done");
          };
        };

      };

    };
  };
 
  public shared ({ caller }) func testingIncreaseMatchTime(matchId : Key) : async ?Match {
    onlyAdmin(caller);
    let maybeMatch = matchStorage.get(matchId);
    switch (maybeMatch) {
      case (?isMatch) {
        let currentTime = getTime();
        let newTime = currentTime + 600000;
        let updatedMatch = { isMatch with time = newTime };
        matchStorage.replace(matchId, updatedMatch);
      };
      case (null) {
        return null;
      };
    };
  };
  public shared ({ caller }) func testingStartMatch(matchId : Key, seconds : Nat) : async ?Match {
    onlyAdmin(caller);

    let maybeMatch = matchStorage.get(matchId);
    switch (maybeMatch) {
      case (?isMatch) {
        let currentTime = getTime();
        let newTime = currentTime + (seconds * 1_000);
        let updatedMatch = {
          isMatch with time = newTime;
          status = "Not Started";
        };
        matchStorage.replace(matchId, updatedMatch);
      };
      case (null) {
        return null;
      };
    };
  };
  public shared ({ caller }) func addMatches(matches : [InputMatch]) : async {
    succ : [(Bool, Match)];
    err : [(Bool, Text)];
  } {
    onlyAdmin(caller);
    let succ = Buffer.Buffer<(Bool, Match)>(matches.size());
    let err = Buffer.Buffer<(Bool, Text)>(matches.size());
    for (match in matches.vals()) {
      let maybeHomeTeam = await getTeamByName(match.homeTeamName);
      let maybeAwayTeam = await getTeamByName(match.awayTeamName);
      switch (maybeHomeTeam) {
        case (?(homeKey, homeTeam)) {
          switch (maybeAwayTeam) {
            case (?(awayKey, awayTeam)) {
              let newMatch = {
                match with
                homeTeam = homeKey;
                awayTeam = awayKey;
                // time = match.time;
                // location = match.location;
                // providerId = match.providerId;
                // seasonId = match.seasonId;
                // status = match.status;
              };
              let id = Int.toText(Time.now()) # match.id;

              matchStorage.put(id, newMatch);
              addMatchDateIndex(newMatch.time, id);
              contestStorage.put(
                id,
                {
                  Types.Default_Contests[0] with matchId = match.id;
                  creatorUserId = "";
                  slotsUsed = 0;
                  winner = null;
                  isDistributed = false;
                },
              );
              contestStorage.put(
                id # "124",
                {
                  Types.Default_Contests[1] with matchId = match.id;
                  creatorUserId = "";
                  slotsUsed = 0;
                  winner = null;
                  isDistributed = false;
                },
              );
              succ.add((true, newMatch))
              // return #ok("Match added Successfully", newMatch);
            };
            case (null) {
              err.add((false, "Away"))
              // return #err("AwayTeam not found", false);
            };
          };
        };
        case (null) {
          err.add((false, "Home"))
          // return #err("HomeTeam not found", false);

        };
      };
    };
    let succArray = Buffer.toArray(succ);
    let errArray = Buffer.toArray(err);
    return { succ = succArray; err = errArray };
  };
  public shared ({ caller }) func addNewMatches(matches : [InputMatch], seasonId : Key) : async {
    succ : [(Bool, Match)];
    err : [(Bool, Text)];
  } {
    onlyAdmin(caller);
    let succ = Buffer.Buffer<(Bool, Match)>(matches.size());
    let err = Buffer.Buffer<(Bool, Text)>(matches.size());
    var filteredMatches = Buffer.fromArray<InputMatch>(matches);
    for ((_key, _match) in matchStorage.entries()) {
      if (_match.seasonId == seasonId) {
        filteredMatches := Buffer.mapFilter<InputMatch, InputMatch>(
          filteredMatches,
          func(m) {
            if (m.providerId == _match.providerId) {
              return null;
            } else {
              return ?m;
            };
          },
        );
      };
    };

    for (match in filteredMatches.vals()) {
      let maybeHomeTeam = await getTeamByName(match.homeTeamName);
      let maybeAwayTeam = await getTeamByName(match.awayTeamName);
      switch (maybeHomeTeam) {
        case (?(homeKey, homeTeam)) {
          switch (maybeAwayTeam) {
            case (?(awayKey, awayTeam)) {
              let newMatch = {
                match with
                homeTeam = homeKey;
                awayTeam = awayKey;
                // time = match.time;
                // location = match.location;
                // providerId = match.providerId;
                // seasonId = match.seasonId;
                // status = match.status;
              };
              resetPlayerSquadByTeamIds([homeKey, awayKey]);
              let id = Int.toText(Time.now()) # match.id;
              matchStorage.put(id, newMatch);
              addMatchDateIndex(newMatch.time, id);
              contestStorage.put(
                id,
                {
                  Types.Default_Contests[0] with matchId = match.id;
                  creatorUserId = "";
                  slotsUsed = 0;
                  winner = null;
                  isDistributed = false;
                },
              );
              contestStorage.put(
                id # "321",
                {
                  Types.Default_Contests[1] with matchId = match.id;
                  creatorUserId = "";
                  slotsUsed = 0;
                  winner = null;
                  isDistributed = false;
                },
              );
              succ.add((true, newMatch))
              // return #ok("Match added Successfully", newMatch);
            };
            case (null) {
              err.add((false, "Away"))
              // return #err("AwayTeam not found", false);
            };
          };
        };
        case (null) {
          err.add((false, "Home"))
          // return #err("HomeTeam not found", false);

        };
      };
    };
    let succArray = Buffer.toArray(succ);
    let errArray = Buffer.toArray(err);
    return { succ = succArray; err = errArray };
  };
  public shared ({ caller }) func updateUpcomingMatches(matches : [InputMatch]) : async {
    succ : [(Bool, Text)];
    err : [(Bool, Text)];
  } {
    onlyAdmin(caller);
    let succ = Buffer.Buffer<(Bool, Text)>(matches.size());
    let err = Buffer.Buffer<(Bool, Text)>(matches.size());
    for ((key, match) in matchStorage.entries()) {
      for (newMatch in matches.vals()) {
        // let maybeMatch = matchStorage.get(match.id);
        if (match.providerId == newMatch.providerId) {
          if (isInFuture(newMatch.time)) {
            // Update the match time
            let updatedMatch = {
              match with
              time = newMatch.time;
            };
            let _ = matchStorage.replace(key, updatedMatch);
            succ.add((true, key));
          } else {
            err.add((false, "Match is not upcoming"));
          };
        };
      };
    };

    let succArray = Buffer.toArray(succ);
    let errArray = Buffer.toArray(err);
    return { succ = succArray; err = errArray };
  };
  // Admin/System Settings
  public query ({ caller }) func whoami() : async Text {
    return Principal.toText(caller);
  };
  public query func getBudget() : async ?Text {
    let budgetSettings = adminSettingStorage.get(Types.AdminSettings.budget);
    switch (budgetSettings) {
      case (?adminSetting) {
        return ?adminSetting.settingValue;
      };
      case (null) {
        return null;
      };
    };
  };

  // Admin
  public shared ({ caller }) func changeAllContestNames({ name } : { name : Text }) {
    assert Principal.isController(caller);
    for ((key, contest) in contestStorage.entries()) {
      ignore contestStorage.replace(key, { contest with name });
    };
  };
  public query ({ caller }) func getTeamsByTournament(tournamentId : Key) : async Result.Result<(Teams, Nat), (Text)> {
    // let allTeams = Iter.toArray(teamStorage.entries());
    onlyAdmin(caller);
    let tournament = tournamentStorage.get(tournamentId);
    switch (tournament) {
      case (?isTournament) {
        let season = getCurrentSeason(tournamentId);
        switch (season) {
          case (?(key, _)) {
            return getTeams(key);
          };
          case (null) {
            return #err("No season found");
          };
        };
      };
      case (null) {
        return #err("No tournament found");
      };
    };
  };
  public shared ({ caller }) func updatePlayerPrices(prices : [{ id : Key; fantasyPrice : Nat }]) : async Bool {
    onlyAdmin(caller);
    label priceLoop for (price in prices.vals()) {
      let maybePlayer = playerStorage.get(price.id);
      switch (maybePlayer) {
        case (?player) {
          if (player.fantasyPrice == price.fantasyPrice) continue priceLoop;
          let _ = playerStorage.put(price.id, { player with fantasyPrice = price.fantasyPrice });
        };
        case (null) {};
      };
    };
    return true;
  };
  public shared ({ caller }) func updateStatsSysteam(points : Points) : async Bool {
    onlyAdmin(caller);
    stable_points := points;
    return true;
  };
  public shared ({ caller }) func getStatsSystem() : async Points {
    onlyAdmin(caller);
    return stable_points;
  };

  public query ({ caller }) func getAdminSetting(settingName : Text) : async ?AdminSetting {
    onlyAdmin(caller);
    return adminSettingStorage.get(settingName);
  };
  public query ({ caller }) func getAdminSettings(props : GetProps) : async ReturnAdminSettings {
    onlyAdmin(caller);
    let settings = HashMap.mapFilter<Key, AdminSetting, AdminSetting>(
      adminSettingStorage,
      Text.equal,
      Text.hash,
      func(k, v) {
        if (not (search({ compare = v.settingName; s = props.search }) or search({ compare = v.settingValue; s = props.search }))) return null;
        return ?v;

      },
    );
    let limit = getLimit(props.limit);
    let totalSettings = settings.size();
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalSettings) {
      return { total = totalSettings; settings = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalSettings) {
      endIndex := totalSettings;
    };

    let slicedSettings = Iter.toArray(Array.slice<(Key, AdminSetting)>(Iter.toArray(settings.entries()), startIndex, endIndex));
    return { total = totalSettings; settings = slicedSettings };
  };
  public shared ({ caller }) func addAdminSetting(setting : IAdminSetting) : async Bool {
    onlyAdmin(caller);
    let currentTime = getTime();
    let newSetting : AdminSetting = {
      setting with
      creation_date = currentTime;
      modification_date = currentTime;
      last_modified_by = Principal.toText(caller);
    };
    adminSettingStorage.put(setting.settingName, newSetting);
    return true;
  };
  public shared ({ caller }) func addContestType(contestType : ContestType) : async Text {
    onlyAdmin(caller);
    let id = Types.generateNewRemoteObjectId();
    let added = contestTypeStorage.put(id, contestType);
    return id;
  };
  public shared ({ caller }) func updateContestType(id : Key, contestType : ContestType) : async ?ContestType {
    onlyAdmin(caller);
    let added = contestTypeStorage.replace(id, contestType);
    return added;
  };

  public shared ({ caller }) func updateAdminSetting(setting : IAdminSetting) : async Bool {
    onlyAdmin(caller);
    let currentTime = getTime();
    let maybeOldSetting = adminSettingStorage.get(setting.settingName);
    switch maybeOldSetting {
      case (?oldSetting) {
        let newSetting : AdminSetting = {
          setting with
          creation_date = oldSetting.creation_date;
          modification_date = currentTime;
          last_modified_by = Principal.toText(caller);
        };
        adminSettingStorage.put(setting.settingName, newSetting);
        return true;
      };
      case (null) {
        return false;
      };
    };
  };
  public shared ({ caller }) func deleteAdminSetting(settingName : Text) : async ?AdminSetting {
    onlyAdmin(caller);
    let maybeOldSetting = adminSettingStorage.get(settingName);
    switch maybeOldSetting {
      case (?oldSetting) {
        adminSettingStorage.remove(settingName);
      };
      case (null) {
        return null;
      };
    };
  };
  // for testing purpose only

  public shared ({ caller }) func testingRemove() {
    assert Principal.isController(caller);
    stable_users := [];
    stable_matches := [];
    stable_teams := [];
    stable_players := [];
    stable_tournaments := [];
    stable_seasons := [];
    stable_playerSquads := [];
    stable_contests := [];
    stable_participants := [];
    stable_playersStats := [];
    stable_userStats := [];
    stable_adminSettings := [];
    stable_teams := [];
    stable_contestTypes := [];

    userStorage := Map.fromIter<Key, User>(stable_users.vals(), stable_users.size(), Text.equal, Text.hash);
    matchStorage := Map.fromIter<Key, Match>(stable_matches.vals(), stable_matches.size(), Text.equal, Text.hash);
    teamStorage := Map.fromIter<Key, Team>(stable_teams.vals(), stable_teams.size(), Text.equal, Text.hash);
    playerStorage := Map.fromIter<Key, Player>(stable_players.vals(), stable_players.size(), Text.equal, Text.hash);
    tournamentStorage := Map.fromIter<Key, Tournament>(stable_tournaments.vals(), stable_tournaments.size(), Text.equal, Text.hash);
    seasonStorage := Map.fromIter<Key, Season>(stable_seasons.vals(), stable_seasons.size(), Text.equal, Text.hash);
    playerSquadStorage := Map.fromIter<Key, PlayerSquad>(stable_playerSquads.vals(), stable_playerSquads.size(), Text.equal, Text.hash);
    contestStorage := Map.fromIter<Key, Contest>(stable_contests.vals(), stable_contests.size(), Text.equal, Text.hash);
    participantStorage := Map.fromIter<Key, Participant>(stable_participants.vals(), stable_participants.size(), Text.equal, Text.hash);
    playersStatsStorage := Map.fromIter<Key, PlayerStats>(stable_playersStats.vals(), stable_playersStats.size(), Text.equal, Text.hash);
    userStatsStorage := Map.fromIter<Key, UserAssets>(stable_userStats.vals(), stable_userStats.size(), Text.equal, Text.hash);
    adminSettingStorage := Map.fromIter<Key, AdminSetting>(stable_adminSettings.vals(), stable_adminSettings.size(), Text.equal, Text.hash);
    contestTypeStorage := Map.fromIter<Key, ContestType>(stable_contestTypes.vals(), stable_contestTypes.size(), Text.equal, Text.hash);

  };
  public query ({ caller }) func testingGetMatches() : async Matches {
    onlyAdmin(caller);
    return Iter.toArray(matchStorage.entries());
  };
  public query ({ caller }) func testingGetSeasons() : async {
    seasons : Seasons;
    amount : Nat;
  } {
    onlyAdmin(caller);
    return {
      seasons = Iter.toArray(seasonStorage.entries());
      amount = seasonStorage.size();
    };
  };
  public query ({ caller }) func testingGetPlayerSquads() : async {
    squads : PlayerSquads;
    amount : Nat;
  } {
    onlyAdmin(caller);
    return {
      squads = Iter.toArray(playerSquadStorage.entries());
      amount = playerSquadStorage.size();
    };
  };
  /*
    getAssetsOfUser use to get assets of user by id
    @param userId
    @return userAssets:UserAssets
  */
  public query ({ caller }) func getAssetsOfUser(id : Text) : async UserAssets {
    assert not Principal.isAnonymous(caller);
    let userId = Principal.toText(caller);
    if (userId != id) {
      onlyAdmin(caller);
    };
    let assets = userStatsStorage.get(id);

    switch (assets) {
      case (?isassets) {
        return isassets;
      };
      case (null) {
        let tempAsset : UserAssets = {
          participated = 0;
          contestWon = 0;
          rewardsWon = 0;
          totalEarning = 0;
        };
        return tempAsset;
      };
    };
  };
  /*
    getAssetsOfUser private  to this canister use to get assets of user by id
    @param userId
    @return userAssets:UserAssets
  */
  func getAssetsOfUserPrivate(id : Text) : UserAssets {
    let assets = userStatsStorage.get(id);

    switch (assets) {
      case (?isassets) {
        return isassets;
      };
      case (null) {
        let tempAsset : UserAssets = {
          participated = 0;
          contestWon = 0;
          rewardsWon = 0;
          totalEarning = 0;
        };
        return tempAsset;
      };
    };
  };
  /*
    increaseParticipant use to increaseParticipant assets
    @params id and assets to increase
    @return Boolean
  */
  public shared ({ caller }) func increaseParticipant(
    props : {
      id : Key;
      assetsVal : ?Nat;
    }
  ) : async Bool {
    assert Principal.isController(caller);
    pIncreaseParticipant(props);

  };
  func pIncreaseParticipant({
    id : Key;
    assetsVal : ?Nat;
  }) : Bool {
    // assert Principal.isController(caller);

    let isUser = userStorage.get(id);
    switch (isUser) {
      case (null) return false;
      case (?user) {
        let getAssets = userStatsStorage.get(id);
        var tempperticipentCount : Nat = 0;

        switch (assetsVal) {
          case (null) { tempperticipentCount := 1 };
          case (?isVal) { tempperticipentCount := isVal };
        };
        switch (getAssets) {
          case (null) {

            let tempAsset : UserAssets = {
              participated = tempperticipentCount;
              contestWon = 0;
              rewardsWon = 0;
              totalEarning = 0;
            };
            userStatsStorage.put(id, tempAsset);

            return true;

          };
          case (?assets) {

            let tempAsset : UserAssets = {
              assets with participated = tempperticipentCount + assets.participated
            };
            let _res = userStatsStorage.replace(id, tempAsset);
            return true;
          };
        };

      };
    };

  };
  /*
    increaseContestWon use to increaseContestWon assets
    @params id and assets to increase
    @return Boolean
  */
  public shared ({ caller }) func increaseContestWon({
    id : Key;
    assetsVal : ?Nat;
  }) : async Bool {
    assert Principal.isController(caller);

    let isUser = userStorage.get(id);
    switch (isUser) {
      case (null) return false;
      case (?user) {
        let getAssets = userStatsStorage.get(id);
        var tempContestWon : Nat = 0;

        switch (assetsVal) {
          case (null) { tempContestWon := 1 };
          case (?isVal) { tempContestWon := isVal };
        };
        switch (getAssets) {
          case (null) {

            let tempAsset : UserAssets = {
              participated = 0;
              contestWon = tempContestWon;
              rewardsWon = 0;
              totalEarning = 0;
            };
            userStatsStorage.put(id, tempAsset);

            return true;

          };
          case (?assets) {

            let tempAsset : UserAssets = {
              assets with contestWon = tempContestWon + assets.contestWon
            };
            let _res = userStatsStorage.replace(id, tempAsset);
            return true;
          };
        };

      };
    };

  };
  private func pIncreaseRewardsWon({
    id : Key;
    assetsVal : ?Nat;
  }) : Bool {
    let isUser = userStorage.get(id);
    switch (isUser) {
      case (null) return false;
      case (?user) {
        let getAssets = userStatsStorage.get(id);
        var tempRewardsWon = 0;

        switch (assetsVal) {
          case (null) { tempRewardsWon := 1 };
          case (?isVal) { tempRewardsWon := isVal };
        };
        switch (getAssets) {
          case (null) {

            let tempAsset : UserAssets = {
              participated = 0;
              contestWon = 0;
              rewardsWon = tempRewardsWon;
              totalEarning = 0;
            };
            userStatsStorage.put(id, tempAsset);

            return true;

          };
          case (?assets) {

            let tempAsset : UserAssets = {
              assets with rewardsWon = tempRewardsWon + assets.rewardsWon;
            };
            let _res = userStatsStorage.replace(id, tempAsset);
            return true;
          };
        };

      };
    };

  };
  /*
    increaseRewardsWon use to increaseRewardsWon assets
    @params id and assets to increase
    @return Boolean
  */
  public shared ({ caller }) func increaseRewardsWon({
    id : Key;
    assetsVal : ?Nat;
  }) : async Bool {
    assert Principal.isController(caller);
    pIncreaseRewardsWon({ id; assetsVal });
  };
  /*
    increaseTotalEarning use to increaseTotalEarning assets
    @params id and assets to increase
    @return Boolean
  */
  public shared ({ caller }) func increaseTotalEarning({
    id : Key;
    assetsVal : ?Nat;
  }) : async Bool {
    assert Principal.isController(caller);

    let isUser = userStorage.get(id);
    var tempTotalEarning : Nat = 0;

    switch (assetsVal) {
      case (null) { tempTotalEarning := 1 };
      case (?isVal) { tempTotalEarning := isVal };
    };
    switch (isUser) {
      case (null) return false;
      case (?user) {
        let getAssets = userStatsStorage.get(id);
        switch (getAssets) {
          case (null) {

            let tempAsset : UserAssets = {
              participated = 0;
              contestWon = 0;
              rewardsWon = 0;
              totalEarning = tempTotalEarning;
            };
            userStatsStorage.put(id, tempAsset);
            return true;
          };
          case (?assets) {
            let tempAsset : UserAssets = {
              assets with totalEarning = tempTotalEarning + assets.totalEarning;
            };
            let _res = userStatsStorage.replace(id, tempAsset);
            return true;
          };
        };

      };
    };

  };

  func pGetTopPlayers() : TopPlayers {
    var tempTopusers = Map.HashMap<Key, TopPlayer>(0, Text.equal, Text.hash);
    for ((id, user) in userStorage.entries()) {

      if (user.role != #admin) {

        let userAssets = getAssetsOfUserPrivate(id);
        var tempuser : TopPlayer = {
          user with assets = userAssets
        };
        tempTopusers.put(id, tempuser);
      };
    };

    let compareFuncContest = func((_a : Key, a : TopPlayer), (_b : Key, b : TopPlayer)) : Order.Order {
      if (a.assets.contestWon > b.assets.contestWon) {
        return #less;
      } else if (a.assets.contestWon < b.assets.contestWon) {
        return #greater;
      } else {
        if (a.joiningDate < b.joiningDate) {
          return #less;
        } else if (a.joiningDate > b.joiningDate) {
          return #greater;
        } else {
          return #equal;
        };
      };
    };
    // let compareFuncTotalEarning = func((_a : Key, a : TopPlayer), (_b : Key, b : TopPlayer)) : Order.Order {
    //   if (a.assets.rewardsWon > b.assets.rewardsWon) {
    //     return #less;
    //   } else if (a.assets.rewardsWon < b.assets.rewardsWon) {
    //     return #greater;
    //   } else {
    //      if (a.joiningDate < b.joiningDate) {
    // return #less;
    // } else if (a.joiningDate > b.joiningDate) {
    //   return #greater;
    // } else {
    //   return #equal;
    // };
    //   };
    // };

    let tempUserAssets : TopPlayers = Iter.toArray(tempTopusers.entries());
    let sortedusersAssets = Array.sort(tempUserAssets, compareFuncContest);
    // let sortedusersAssets = Array.sort(tempUserAssets, compareFuncTotalEarning);
    return sortedusersAssets;
  };
  /*
    getTopPlayers use to get top plyers of plateform
    @params  {page : Nat;limit : Nat; }
    @return { total : Nat; players : TopPlayers }
  */
  public query ({ caller }) func getTopPlayers(
    props : {
      page : Nat;
      limit : Nat;
      search : Text

    }
  ) : async { total : Nat; players : TopPlayers } {

    if (props.limit > 10) {
      assert not Principal.isAnonymous(caller);
      onlyAdmin(caller);

    };

    var limit = getLimit(props.limit);

    let sortedusersAssets = pGetTopPlayers();
    let totalsortedusersAssets = Array.size(sortedusersAssets);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalsortedusersAssets) {
      return { total = totalsortedusersAssets; players = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalsortedusersAssets) {
      endIndex := totalsortedusersAssets;
    };

    let slicedTrans = Iter.toArray(Array.slice<(Key, TopPlayer)>(sortedusersAssets, startIndex, endIndex));
    return {
      total = totalsortedusersAssets;
      players = slicedTrans;
    };

  };
  /*
    getUserRank use to get User Rank
    @params  {page : Nat;limit : Nat; }
    @return { total : Nat; players : TopPlayers }
  */
  public query ({ caller }) func getUserRank(userId : Key) : async ?MeAsTopPlayer {

    let getUser = userStorage.get(userId);
    switch (getUser) {
      case (null) return null;
      case (?isuser) {
        if (isuser.role == #admin) {
          return null;
        };
        let sortedusersAssets = pGetTopPlayers();
        let iterateAble = Iter.fromArray(sortedusersAssets);

        var tempRank = 1;
        var tempUser : ?MeAsTopPlayer = null;
        label letters for ((key, item) in sortedusersAssets.vals()) {

          if (key == userId) {
            tempUser := ?{ item with rank = tempRank };
            break letters;
          };
          tempRank += 1;
        };
        return tempUser;

      };

    };
  };
  /*
    getContestsWinnerUserByMatchId use to get cantest winner of match
    @params  matchId:Key
    @return ?(Key,User)
  */
  public query func getContestsWinnerUserByMatchId(matchId : Key) : async ?(Key, User) {

    var usersMap = Map.HashMap<Key, User>(participantStorage.size(), Text.equal, Text.hash);
    for ((key, contest) in contestStorage.entries()) {
      if (contest.matchId == matchId) {
        switch (contest.winner) {
          case (null) {};
          case (?isWinner) {
            let tempUser = userStorage.get(isWinner);
            switch (tempUser) {
              case (null) {};
              case (?isUser) {
                usersMap.put(isWinner, isUser);
              };
            };

          };
        };
      };
    };
    let filteredArr = Iter.toArray(usersMap.entries());
    let compareFunc = func((_ka : Key, a : User), (_kb : Key, b : User)) : Order.Order {
      if (a.joiningDate < b.joiningDate) {
        return #less;
      } else if (a.joiningDate > b.joiningDate) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let sortedUsers = Array.sort(filteredArr, compareFunc);
    if (sortedUsers.size() > 0) {
      // let list = Iter.fromArray(sortedUsers);
      return ?sortedUsers[0];
    } else {

      return null;
    };

  };
  func pGetmvpsOFMAtch(matchId : Key) : ?(Key, MVPSPlayers) {
    var usersMap = Map.HashMap<Key, MVPSPlayers>(0, Text.equal, Text.hash);
    let maybeMatch = matchStorage.get(matchId);
    switch (maybeMatch) {
      case (?match) {

        let teamsIds = [match.homeTeam, match.awayTeam];
        for ((key, player) in playerStorage.entries()) {
          for (teamId in teamsIds.vals()) {
            if (player.teamId == teamId) {
              let pointes = pGetPlayerPoints(key, matchId);
              var tempPoints : Int = 0;
              switch (pointes) {
                case (null) {};
                case (?pointes) { tempPoints := pointes };
              };
              let tempUser : MVPSPlayers = {
                name = player.name;
                photo = player.photo;
                number = tempPoints;
              };
              usersMap.put(key, tempUser)

            };
          };
        };
      };
      case (null) {
        return null;
      };
    };
    let filteredArr = Iter.toArray(usersMap.entries());
    let compareFunc = func((_ka : Key, a : MVPSPlayers), (_kb : Key, b : MVPSPlayers)) : Order.Order {
      if (a.number > b.number) {
        return #less;
      } else if (a.number < b.number) {
        return #greater;
      } else {
        return #equal;
      };
    };
    let sortedUsers = Array.sort(filteredArr, compareFunc);
    if (sortedUsers.size() > 0) {
      // let list = Iter.fromArray(sortedUsers);
      return ?sortedUsers[0];
    } else {
      return null;
    };
  };
  /*
    getMVPSOfmatch use to get MVPS winner of match
    @params  matchId:Key
    @return ?(Key,User)
  */
  public query func getMVPSOfmatch(matchId : Key) : async ?(Key, MVPSPlayers) {
    return pGetmvpsOFMAtch(matchId);
  };

  func pGetContestWinner(matchId : Key) : ?(Key, ContestWinner) {
    var usersMap = Map.HashMap<Key, ContestWinner>(participantStorage.size(), Text.equal, Text.hash);

    for ((key, contest) in contestStorage.entries()) {
      if (contest.matchId == matchId) {
        switch (contest.winner) {
          case (null) {};
          case (?isWinner) {
            // topContest.put(key,contest)
            let tempUser = userStorage.get(isWinner);
            switch (tempUser) {
              case (null) {};
              case (?isUser) {
                usersMap.put(isWinner, { isUser with entryFee = contest.entryFee });
              };
            };

          };
        };
      };
    };

    let filteredArr = Iter.toArray(usersMap.entries());
    let compareFunc = func((_ka : Key, a : ContestWinner), (_kb : Key, b : ContestWinner)) : Order.Order {
      if (a.entryFee > b.entryFee) return #less;
      if (a.entryFee < b.entryFee) return #greater;
      if (a.joiningDate < b.joiningDate) return #less;
      if (a.joiningDate > b.joiningDate) return #greater;
      return #equal;
    };
    let sortedUsers = Array.sort(filteredArr, compareFunc);
    if (sortedUsers.size() > 0) {
      // let list = Iter.fromArray(sortedUsers);
      return ?sortedUsers[0];
    } else {

      return null;
    };
  };
  /*
    getContestWinnerOfMatch use to get cantest winner of match
    @params  matchId:Key
    @return ?(Key,User)
  */
  public query func getContestWinnerOfMatch(matchId : Key) : async ?(Key, User) {

    return pGetContestWinner(matchId : Key);

  };
  public query func getMVPSMatches(props : GetProps) : async RMVPSTournamentMatchsList {
    var limit = getLimit(props.limit);
    var matchesBuffer = Buffer.Buffer<RMVPSTournamentMatch>(mvps_matches_ids.size());
    for (matchId in mvps_matches_ids.vals()) {
      let match = pGetMatch(matchId);
      switch (match) {
        case (null) {};
        case (?isMatch) {
          let tempIsContestWinner = pGetContestWinner(matchId);
          switch (tempIsContestWinner) {
            case (null) {

            };
            case (?_isWinner) {
              let mvps = pGetmvpsOFMAtch(matchId);
              let tempmatch : RMVPSTournamentMatch = {
                isMatch with matchId = matchId;
                contestWinner = tempIsContestWinner;
                mvps = mvps;
              };

              matchesBuffer.add(tempmatch);

            };
          };
        };
      };

    };
    let nTotalMatches = matchesBuffer.size();
    let startIndex : Nat = props.page * limit;
    if (startIndex >= nTotalMatches) {
      return { total = nTotalMatches; matches = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > nTotalMatches) {
      endIndex := nTotalMatches;
    };

    let slicedMatches = Iter.toArray(Array.slice<RMVPSTournamentMatch>(Buffer.toArray(matchesBuffer), startIndex, endIndex));
    return {
      total = nTotalMatches;
      matches = slicedMatches;
    };
  };


 
  private func getMatchesCount(startDate : Int, endDate : Int) : Int {
    var tempMatchcount : Int = 0;
    for ((key, match) in matchStorage.entries()) {
      if (match.time >= startDate and match.time <= endDate) {
        tempMatchcount += 1;

      };

    };
    return tempMatchcount;
  };

  public query ({ caller }) func getJoinedMatches(userId : Key) : async {
    matchesCount : Int;
    joinedMatches : Int;
  } {
    let joinedMatches = userJoinedMatchedStorage.get(userId);
    switch (joinedMatches) {
      case (null) {
        return { matchesCount = 0; joinedMatches = 0 };
      };
      case (?isJoinedMatches) {
        let joinedMatchesCount = List.size<Key>(isJoinedMatches.joinedMatches);

        return {
          matchesCount = isJoinedMatches.totalMatches;
          joinedMatches = joinedMatchesCount;
        };

      };
    };

  };




  private func addMatchToJoinedList(matchId : Key, userId : Key) {
    let joinedList = userJoinedMatchedStorage.get(userId);
    switch (joinedList) {
      case (null) {
        let user = userStorage.get(userId);
        switch (user) {
          case (null) {};
          case (?isUser) {
            var startDate : Int = isUser.joiningDate;

            let endDate = Date_In_Miliseconds.november15;
            if (isUser.joiningDate < Date_In_Miliseconds.september15) {
              startDate := Date_In_Miliseconds.september15;
            };
            let matchesCount = getMatchesCount(startDate, endDate);

            let tempJoinedMatches : JoinedMatchesRecord = {

              joinedMatches = List.make(matchId);
              totalMatches = matchesCount;
              isAirDropTaken = false;
            };
            userJoinedMatchedStorage.put(userId, tempJoinedMatches);
          };
        };

      };
      case (?isList) {

        let isAlreadyJoined = List.some<Text>(isList.joinedMatches, func n { n == matchId });
        if (not isAlreadyJoined) {
          let tempJoinedMatches : JoinedMatchesRecord = {

            joinedMatches = List.push(matchId, isList.joinedMatches);
            totalMatches = isList.totalMatches;
            isAirDropTaken = isList.isAirDropTaken;
          };
          let _res = userJoinedMatchedStorage.replace(userId, tempJoinedMatches);
        };

      };
    };
  };
  private func getContestNameById(contestId : Key) : Text {
    let contest = contestStorage.get(contestId);
    switch (contest) {
      case (null) { return "" };
      case (?isContest) {

        return isContest.name;
        //  break contestName;
      };
    };
  };
  private func getTeamsInfo(teamId : Key) : { name : Text; logo : Text } {
    let team = teamStorage.get(teamId);
    switch (team) {
      case (null) {
        return {
          name = "";
          logo = "";
        };
      };
      case (?isTeam) {

        return {
          name = isTeam.name;
          logo = isTeam.logo;
        };
        //  break contestName;
      };
    };
  };
  private func getLeagueNameBySeasonId(seasonId : Key) : Text {
    let season = seasonStorage.get(seasonId);
    switch (season) {
      case (null) { return "" };
      case (?isSeason) {
        let tournament = tournamentStorage.get(isSeason.tournamentId);
        switch (tournament) {
          case (null) { return "" };
          case (?isTournament) {
            return isTournament.name;
          };
        };

        //  break contestName;
      };
    };
  };
  private func getMatchInfoByContestId(contestId : Key) : ?MatchTeamsInfo {
    let contest = contestStorage.get(contestId);
    switch (contest) {
      case (null) { return null };
      case (?isContest) {
        let maybeMatch = matchStorage.get(isContest.matchId);
        switch (maybeMatch) {
          case (null) { return null };
          case (?isMatch) {
            let tournamentName = getLeagueNameBySeasonId(isMatch.seasonId);
            let homeTeam = getTeamsInfo(isMatch.homeTeam);
            let awayTeam = getTeamsInfo(isMatch.awayTeam);

            return ?{
              leagueName = tournamentName;
              matchId = isContest.matchId;
              homeTeamName = homeTeam.name;
              awayTeamName = awayTeam.name;
              awayScore = isMatch.awayScore;
              homeScore = isMatch.homeScore;
              homeTeamLogo = homeTeam.logo;
              awayTeamLogo = awayTeam.logo;
              matchTime = isMatch.time;

            };

          };
        };

        //  break contestName;
      };
    };
  };
  private func getSquadNameById(squadId : Key) : Text {
    let squad = playerSquadStorage.get(squadId);
    switch (squad) {
      case (null) { return "" };
      case (?isSquad) {

        return isSquad.name;
        //  break contestName;
      };
    };
  };
  private func isUpcommingMatch(contestId : Key, currentTime : Int) : Bool {
    let contest = contestStorage.get(contestId);
    switch (contest) {
      case (null) { return false };
      case (?isContest) {
        let maybeMatch = matchStorage.get(isContest.matchId);
        switch (maybeMatch) {
          case (null) { return false };
          case (?isMatch) {
            if (isMatch.time > currentTime) return true else false

          };
        };

        //  break contestName;
      };
    };
  };
  private func isMatchCompleted(contestId : Key) : Bool {
    let contest = contestStorage.get(contestId);
    switch (contest) {
      case (null) { return false };
      case (?isContest) {
        let maybeMatch = matchStorage.get(isContest.matchId);
        switch (maybeMatch) {
          case (null) { return false };
          case (?isMatch) {
            return checkMatchCompleted(isMatch.status);
          };
        };

        //  break contestName;
      };
    };
  };
  public query ({ caller }) func getJoinedTeams(props : GetProps) : async {
    result : [JoinedTeams];
    total : Nat;
  } {

    var limit = getLimit(props.limit);
    let refinedteams = Buffer.Buffer<JoinedTeams>(participantStorage.size());

    let userId = Principal.toText(caller);
    label participantloop for ((key, participant) in participantStorage.entries()) {
      if (userId == participant.userId) {
        let currentTime = getTime();
        if (isUpcommingMatch(participant.contestId, currentTime) or isMatchCompleted(participant.contestId)) {
          continue participantloop;
        };

        let contestName = getContestNameById(participant.contestId);
        let squadName = getSquadNameById(participant.squadId);
        let matchInfo = getMatchInfoByContestId(participant.contestId);
        switch (matchInfo) {
          case (null) {};
          case (?isMatchInfo) {
            let tempResult : JoinedTeams = {
              isMatchInfo with
              contestId = participant.contestId;
              contestName = contestName;
              squadId = participant.squadId;
              squadName = squadName;
              rank = participant.rank;

            };

            refinedteams.add(tempResult)

          };

        };

      };

    };
    let userTeams = Buffer.toArray(refinedteams);

    let compareFunc = func(a : JoinedTeams, b : JoinedTeams) : Order.Order {
      if (a.matchTime < b.matchTime) {
        return #less;
      } else if (a.matchTime > b.matchTime) {
        return #greater;
      } else {
        return #equal;
      };
    };

    let sortedTeams = Array.sort(userTeams, compareFunc);

    let totalJoinedTeams = Array.size(sortedTeams);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalJoinedTeams) {
      return { total = totalJoinedTeams; result = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalJoinedTeams) {
      endIndex := totalJoinedTeams;
    };

    let slicedJoinedTeams = Iter.toArray(Array.slice<JoinedTeams>(userTeams, startIndex, endIndex));
    return {
      total = totalJoinedTeams;
      result = slicedJoinedTeams;
    };

  };



  private func isUserJoinedTheMatch(contestId : Key, matchId : Key, userId : Key) : Result.Result<Text, Text> {
    var isJoined : Bool = false;
    var isWinner : Bool = false;
    label squadLoop for ((key, squad) in playerSquadStorage.entries()) {
      if (squad.matchId == matchId and squad.userId == userId) {

        let maybeParticipant = participantStorage.get(key # contestId);
        switch (maybeParticipant) {
          case (?participant) {
            isJoined := true;
            if (participant.rank == 1) {
              isWinner := true;

              break squadLoop;
            };
          };
          case (null) {

          };
        };

      };

    };

    if (not isJoined) {
      return #err("User has not joined the Contest.");
    };
    if (not isWinner) {
      return #err("User is not winner of Contest.");

    };
    return #ok("User has joined the contest");

  };
 
  public query func getContestReward() : async ?AdminSetting {
    let maybeRewardSetting = adminSettingStorage.get(Types.AdminSettings.contestWinnerReward);
    return maybeRewardSetting;

  };


  private func getTimeWithOutHours(time : Int) : Int {
    let tempTime = time / (24 * 60 * 60 * 1000);
    return tempTime * (24 * 60 * 60 * 1000);
  };
  private func getDayNameByTime(timestampMs : Int) : Text {
    let timestampS = timestampMs / 1000;
    let daysSinceEpoch = (timestampS / 86400) + 4;
    let dayOfWeek = daysSinceEpoch % 7;
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[Int.abs(dayOfWeek)];
    return day;
  };
 




  public shared ({ caller }) func changePaymentMethod() : async () {
    onlyAdmin(caller);
    for ((key, contest) in contestStorage.entries()) {
      let _ = contestStorage.replace(key, { contest with paymentMethod = "0" });
    };
  };
  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_users := Iter.toArray(userStorage.entries());
    stable_matches := Iter.toArray(matchStorage.entries());
    stable_teams := Iter.toArray(teamStorage.entries());
    stable_players := Iter.toArray(playerStorage.entries());
    stable_tournaments := Iter.toArray(tournamentStorage.entries());
    stable_seasons := Iter.toArray(seasonStorage.entries());
    stable_playerSquads := Iter.toArray(playerSquadStorage.entries());
    stable_contests := Iter.toArray(contestStorage.entries());
    stable_participants := Iter.toArray(participantStorage.entries());
    stable_playersStats := Iter.toArray(playersStatsStorage.entries());
    stable_userStats := Iter.toArray(userStatsStorage.entries());
    stable_adminSettings := Iter.toArray(adminSettingStorage.entries());
    stable_contestTypes := Iter.toArray(contestTypeStorage.entries());
    stable_joined_matches := Iter.toArray(userJoinedMatchedStorage.entries());
   

    Debug.print("pre-upgrade finished.");
  };
  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    userStorage := Map.fromIter<Key, User>(stable_users.vals(), stable_users.size(), Text.equal, Text.hash);
    matchStorage := Map.fromIter<Key, Match>(stable_matches.vals(), stable_matches.size(), Text.equal, Text.hash);
    teamStorage := Map.fromIter<Key, Team>(stable_teams.vals(), stable_teams.size(), Text.equal, Text.hash);
    playerStorage := Map.fromIter<Key, Player>(stable_players.vals(), stable_players.size(), Text.equal, Text.hash);
    tournamentStorage := Map.fromIter<Key, Tournament>(stable_tournaments.vals(), stable_tournaments.size(), Text.equal, Text.hash);
    seasonStorage := Map.fromIter<Key, Season>(stable_seasons.vals(), stable_seasons.size(), Text.equal, Text.hash);
    playerSquadStorage := Map.fromIter<Key, PlayerSquad>(stable_playerSquads.vals(), stable_playerSquads.size(), Text.equal, Text.hash);
    contestStorage := Map.fromIter<Key, Contest>(stable_contests.vals(), stable_contests.size(), Text.equal, Text.hash);
    participantStorage := Map.fromIter<Key, Participant>(stable_participants.vals(), stable_participants.size(), Text.equal, Text.hash);
    playersStatsStorage := Map.fromIter<Key, PlayerStats>(stable_playersStats.vals(), stable_playersStats.size(), Text.equal, Text.hash);
    userStatsStorage := Map.fromIter<Key, UserAssets>(stable_userStats.vals(), stable_userStats.size(), Text.equal, Text.hash);
    adminSettingStorage := Map.fromIter<Key, AdminSetting>(stable_adminSettings.vals(), stable_adminSettings.size(), Text.equal, Text.hash);
    contestTypeStorage := Map.fromIter<Key, ContestType>(stable_contestTypes.vals(), stable_contestTypes.size(), Text.equal, Text.hash);
    userJoinedMatchedStorage := Map.fromIter<Key, JoinedMatchesRecord>(stable_joined_matches.vals(), stable_joined_matches.size(), Text.equal, Text.hash);
    
    var index = 0;

    for (id in initAdmins.vals()) {
      let newUser = {
        email = "";
        joiningDate = Time.now() / TIME_DEVISOR;
        name = "admin " # Nat.toText(index);
        role = #admin;
      };
      userStorage.put(id, newUser);
      index += 1;
    };

    stable_users := [];
    stable_matches := [];
    stable_teams := [];
    stable_players := [];
    stable_tournaments := [];
    stable_seasons := [];
    stable_playerSquads := [];
    stable_contests := [];
    stable_participants := [];
    stable_playersStats := [];
    stable_userStats := [];
    stable_adminSettings := [];
    stable_contestTypes := [];
 
    stable_joined_matches := [];

 


    Debug.print("post-upgrade finished.");
  };
};
