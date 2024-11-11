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
import Nat "mo:base/Nat";
import Prim "mo:prim";
import Types "../model/Types";
import FantasyStoreHelper "../helper/FantasyStoreHelper";
import Validation "../model/Validation";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";

shared ({ caller = initializer }) actor class () {

  type Key = Types.Key;
  type User = Types.User;
  type IUser = Types.IUser;
  type Players = Types.Players;
  type Player = Types.Player;
  type PlayerCount = Types.PlayerCount;
  type Position = Types.Position;
  type IPlayer = Types.IPlayer;
  type GetProps = Types.GetProps;
  type RTournamentMatches = Types.RTournamentMatches;
    type ITeamWithPlayers = Types.ITeamWithPlayers;
  type ISeason = Types.ISeason;
  type ITournament = Types.ITournament;
  type InputMatch = Types.InputMatch;
  type IContest = Types.IContest;
  type Contest = Types.Contest;
    type ContestsWithId = Types.ContestsWithId;
  type MatchContests = Types.MatchContests;
  type RMatchContest = Types.RMatchContest;
  type ReturnContests = { contests : MatchContests; total : Nat };
  type Contests = Types.Contests;
  type MatchContest = Types.MatchContest;
  type Participants = Types.Participants;
  type Participant = Types.Participant;
  type IPlayerSquad = Types.IPlayerSquad;
  type PlayerSquad = Types.PlayerSquad;
  type PlayerS = Types.PlayerS;
  type RawPlayerSquads = Types.RawPlayerSquads;
  type ListPlayerSquads = Types.ListPlayerSquads;
    type RefinedPlayerSquadRanking = Types.RefinedPlayerSquadRanking;
  type PlayersStats = Types.PlayersStats;
  type MeAsTopPlayer = Types.MeAsTopPlayer;
  type MVPSPlayers = Types.MVPSPlayers;
  type TopPlayer = Types.TopPlayer;
  type RMVPSTournamentMatch = Types.RMVPSTournamentMatch;
  type ContestArray = Types.ContestArray;
  type ReturnAdminSettings = { settings : AdminSettings; total : Nat };

  type ReturnPagContests = {
    contests : Contests;
    total : Nat;
  };
    type RefinedPlayerSquadRankings = Types.RefinedPlayerSquadRankings;
  type PointsPlayerSquad = Types.PointsPlayerSquad;
  type TopPlayers = Types.TopPlayers;

    type ReturnRankings = {
    rankings : RefinedPlayerSquadRankings;
    userRank : ?(Key, RefinedPlayerSquadRanking);
    total : Nat;
  };
    type RawPlayerSquad = Types.RawPlayerSquad;
   type TransferFromError = Types.TransferFromError;
  type ReturnAddParticipant = Result.Result<Text, TransferFromError>;
  type Match = Types.Match;
  type RMatch = Types.RMatch;
  type Season = Types.Season;
  type Tournaments = Types.Tournaments;
  type Tournament = Types.Tournament;
  type Seasons = Types.Seasons;
  type RTournamentMatch = Types.RTournamentMatch;
  type Teams = Types.Teams;
  type AdminSettings = Types.AdminSettings;
  type AdminSetting = Types.AdminSetting;
  type IAdminSetting = Types.IAdminSetting;
  type Matches = Types.Matches;
  type RefinedMatch = Types.RefinedMatch;
  type PlayerSquads = Types.PlayerSquads;
  type ListPlayerSquad = Types.ListPlayerSquad;
  type UsersAssets = Types.UsersAssets;
  type UserAssets = Types.UserAssets;
  type IPlayerStats = Types.IPlayerStats;
  type PlayerStats = Types.PlayerStats;
  type Points = Types.Points;
  type RPoints = Types.RPoints;
  type RMatches = Types.RMatches;
  type Team = Types.Team;
  type RefinedPlayerSquad = Types.RefinedPlayerSquad;
  type RefinedPlayerSquads = Types.RefinedPlayerSquads;
  type ContestWinner = Types.ContestWinner;
  type RMVPSTournamentMatchs = Types.RMVPSTournamentMatchs;
  type MatchStatus = Types.MatchStatus;

  type ReturnMatches = { matches : RTournamentMatches; total : Nat };
  type ReturnTournaments = { tournaments : Tournaments; total : Nat };
  type ReturnTeams = { teams : RawPlayerSquads; total : Nat };
  type RMVPSTournamentMatchsList = {
    matches : RMVPSTournamentMatchs;
    total : Nat;
  };
  type DetailedMatchContest = Types.DetailedMatchContest;
  type DetailedMatchContests = Types.DetailedMatchContests;
  type ReturnDetailedMatchContests = {
    matches : DetailedMatchContests;
    total : Nat;
  };
  type Users = Types.Users;

  var TIME_DEVISOR = Types.TIME_DEVISOR;
  var MAX_LIMIT = Types.MAX_LIMIT;
  stable var stableUserNameCount : Nat = 200;

  stable var stable_users : Users = [];
  stable var stable_players : Players = [];
  stable var stable_matches : Matches = [];
  stable var stable_tournaments : Tournaments = [];
  stable var stable_seasons : Seasons = [];
  stable var stable_teams : Teams = [];
  stable var stable_adminSettings : AdminSettings = [];
  stable var stable_contests : Contests = [];
  stable var stable_participants : Participants = [];
  stable var stable_playerSquads : PlayerSquads = [];
  stable var stable_userStats : UsersAssets = [];
  stable var stable_playersStats : PlayersStats = [];
  stable var mvps_matches_ids : [Key] = [];

  var playerStorage = Map.fromIter<Key, Player>(stable_players.vals(), 0, Text.equal, Text.hash);
  var seasonStorage = Map.fromIter<Key, Season>(stable_seasons.vals(), 0, Text.equal, Text.hash);

  var userStorage = Map.fromIter<Key, User>(stable_users.vals(), 0, Text.equal, Text.hash);
  var matchStorage = Map.fromIter<Key, Match>(stable_matches.vals(), 0, Text.equal, Text.hash);
  var tournamentStorage = Map.fromIter<Key, Tournament>(stable_tournaments.vals(), 0, Text.equal, Text.hash);
  var teamStorage = Map.fromIter<Key, Team>(stable_teams.vals(), 0, Text.equal, Text.hash);
  var adminSettingStorage = Map.fromIter<Key, AdminSetting>(stable_adminSettings.vals(), 0, Text.equal, Text.hash);
  var contestStorage = Map.fromIter<Key, Contest>(stable_contests.vals(), 0, Text.equal, Text.hash);
  var participantStorage = Map.fromIter<Key, Participant>(stable_participants.vals(), 0, Text.equal, Text.hash);
  var playerSquadStorage = Map.fromIter<Key, PlayerSquad>(stable_playerSquads.vals(), 0, Text.equal, Text.hash);
  var userStatsStorage = Map.fromIter<Key, UserAssets>(stable_userStats.vals(), 0, Text.equal, Text.hash);
  var playersStatsStorage = Map.fromIter<Key, PlayerStats>(stable_playersStats.vals(), 0, Text.equal, Text.hash);
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
  private func getLimit(limit : Nat) : Nat {
    var _l = MAX_LIMIT;
    if (limit < MAX_LIMIT) _l := limit;
    return _l;
  };
  private func getMatchName(isHome : Team, isAway : Team) : Text {
    return isHome.name # " vs " # isAway.name;
  };
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
  private func isInPast(time : Int) : Bool {
    return time < getTime();
  };
  private func isInFuture(time : Int) : Bool {
    return time > getTime();
  };
    private func search({ compare; s } : { compare : Text; s : Text }) : Bool {
    let searchString = Text.map(s, Prim.charToLower);
    let compareString = Text.map(compare, Prim.charToLower);
    if (Text.contains(compareString, #text searchString)) { return true } else {
      return false;
    };
  };
    private func checkMatchCompleted(status : Text) : Bool {
    if (status == "Match Finished") return true else return false;
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
  func onlyUser(id : Principal) {

    assert not Principal.isAnonymous(id);
    let user = userStorage.get(Principal.toText(id));
    switch (user) {
      case (?is) {

      };
      case (null) {
        assert false;
      };
    };
  };
  func thisUser(id : Text, id2 : Text) {
    assert id == id2;
  };
  func onlyAdmin(id : Principal) {
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
  func getTime() : Int {

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
  // Users
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
   public query func getTournaments() : async Tournaments {
    return Iter.toArray(tournamentStorage.entries());
  };
  public shared ({ caller }) func addUser(iUser : IUser) : async Result.Result<(Text, ?User), Text> {
    // Return error if the user already exists
    assert not Principal.isAnonymous(caller);
    let maybeOldUser = userStorage.get(Principal.toText(caller));

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
   public query func getSeasons(tournamentId : Key) : async Seasons {
    let seasonsBuffer = Buffer.Buffer<(Key, Season)>(seasonStorage.size());
    for ((key, season) in seasonStorage.entries()) {
      if (season.tournamentId == tournamentId) {
        seasonsBuffer.add((key, season));
      };
    };
    return Buffer.toArray(seasonsBuffer);
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
        // return #err("Error while getting user");
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
  public query func getMatch(matchId : Key) : async ?RefinedMatch {
    return pGetMatch(matchId);
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

  private func pGetMatches(props : GetProps, time : ?Int,offset:Int, tournamentId : ?Key) : RMatches {
    let currentTime = getTime();
    var isUpcoming : Bool = true;
    var isCompleted : Bool = false;
    var withInThirtyMinutes = false;
    var thirtyMinutes = 30 * 60 * 1000;
    if (props.status == "0") {
      isUpcoming := true;
    } else if (props.status == "1") {
      isUpcoming := false;
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
        if (not ((isUpcoming and v.time > currentTime) or (((not isUpcoming) and v.time < currentTime) or withInThirtyMinutes))) return null;
        if (not ((isCompleted and checkMatchCompleted(v.status)) or (not isCompleted and not checkMatchCompleted(v.status)))) return null;
        if (not ((withInThirtyMinutes and (v.time - currentTime) <= thirtyMinutes) or not withInThirtyMinutes)) return null;

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

               if (FantasyStoreHelper.isSameDayWithOffset(isTime, v.time,offset)) {
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
  
    private func addTournamentInMatch(m : RMatch) : ?RTournamentMatch {
    let season = seasonStorage.get(m.seasonId);
    switch (season) {
      case (?isSeason) {
        let tournament = tournamentStorage.get(isSeason.tournamentId);
        switch (tournament) {
          case (?isTournament) {
            return ?{
              m with tournamentId = isSeason.tournamentId;
              tournamentName = isTournament.name;
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
  // function for filtering the matchws with tournamnet
  public query func getMatchesWithTournamentId(props : GetProps, time : ?Int,offset:Int, tournamentId : ?Key) : async ReturnMatches {

    var limit = getLimit(props.limit);
    let sortedMatches = pGetMatches(props : GetProps, time : ?Int,offset:Int, tournamentId : ?Key);
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
   private func hasUserJoinedTheContest(matchId : Key, userId : Key) : Bool {
    let contestIds = getContestIdsByMatch(matchId);
    var isJoined = false;

    var tempContest : ContestArray = [];
    for (contestId in contestIds.vals()) {
      let maybeContest = contestStorage.get(contestId);

      switch (maybeContest) {
        case (?contest) {
     
         label playerLoop for ((key, squad) in playerSquadStorage.entries()) {
            if (squad.userId == userId and squad.matchId == matchId) {
                isJoined:=true;
                break playerLoop;
            };
          };

        };
        case (null) {

        };
      };
    };
    return isJoined;

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
        let isMatchJoined=hasUserJoinedTheContest(k,userId);
        if(not isMatchJoined) return null;

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

                  // squads.add(squad);
                };
                // if (squads.size() == contest.slots) {
                //   break squadLoop;
                // };
              };
              switch (winner) {
                case (null) {
                  continue contestLoop;
                  // return #err("No winner found");
                };
                case (?isWinner) {       
                  // add match to mvps
                  addMatchToMvps(inputMatch.id);
               
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

    // Utility
  //  get time in miliseconds

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

            // let r = verifyBudget(newSquad.players);
            // switch (r) {
            //   case (#err(error)) {
            //     return #err(error);
            //   };
            //   case (#ok(_)) {};
            // };

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
          slots = inputContest.slots;
          slotsUsed = 0;
          minCap = inputContest.minCap;
          maxCap = inputContest.maxCap;
          providerId = inputContest.providerId;
          teamsPerUser = inputContest.teamsPerUser;
          rules = inputContest.rules;
          winner = null;
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

              let newContest : Contest = {
                creatorUserId = Principal.toText(caller);
                name = inputContest.name;
                matchId = inputContest.matchId;
                slots = inputContest.slots;
                slotsUsed = isContest.slotsUsed;
                minCap = inputContest.minCap;
                maxCap = inputContest.maxCap;
                providerId = inputContest.providerId;
                teamsPerUser = inputContest.teamsPerUser;
                rules = inputContest.rules;
                 winner = isContest.winner;

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
  public query func getContestsByMatchId(matchId : Key) : async Contests {
    let contests = Buffer.Buffer<(Key, Contest)>(contestStorage.size());
    for ((key, contest) in contestStorage.entries()) {
      if (contest.matchId == matchId) {
        contests.add((key, contest));
      };
    };
    return Buffer.toArray(contests);
  };
    public query func getPaginatedContestsByMatchId(matchId : Key, props : GetProps) : async ReturnPagContests {
    let contests = Buffer.Buffer<(Key, Contest)>(contestStorage.size());
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
    
          contests.add((key, contest ));
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
    // PlayerSquads
  public shared ({ caller }) func addPlayerSquad(inputSquad : IPlayerSquad) : async Result.Result<Text, Text> {
    onlyUser(caller);
    // let r = verifyBudget(inputSquad.players);
    let maybeMatch = matchStorage.get(inputSquad.matchId);
    switch (maybeMatch) {
      case (?isMatch) {
        if (isInPast(isMatch.time)) {
          return #err("Time limit exceeded");

          // onlyAdmin(caller);
        };
      };
      case (null) {
        return #err("Match does not exist");
      };
    };
    // switch (r) {
    //   case (#err(error)) {
    //     return #err(error);
    //   };
    //   case (#ok(_)) {};
    // };

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

    private func getStats(playerId : Key, matchId : Key) : ?PlayerStats {
    var player : ?PlayerStats = null;
    for ((_key, playerStats) in playersStatsStorage.entries()) {
      if (playerStats.playerId == playerId and playerStats.matchId == matchId) {
        player := ?playerStats;
      };
    };
    return player;
  };
    private func nRefinePlayerSquad(squad : PlayerSquad, squadId : Key) : Types.RankPlayerSquad {
    let refinedPlayers = Buffer.Buffer<(Key, PlayerS, Bool)>(squad.players.size());
    // var squadPoints : RPoints = 0;
    for ((key, bool) in squad.players.vals()) {
      let player = playerStorage.get(key);
      switch (player) {
        case (?is) {
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

  // --------------- join contest ------------------
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

  // public query func getRankingOfSquads
  // Participant
  public shared ({ caller }) func addParticipant(iContestId : Key, squadId : Key,offset:Int) : async ReturnAddParticipant {
    onlyUser(caller);
    let contest = contestStorage.get(iContestId);
    switch (contest) {
      case (?isContest) {
        let maybeMatch = matchStorage.get(isContest.matchId);
        switch (maybeMatch) {
          case (?isMatch) {
            let userId = Principal.toText(caller);
            if (not isInFuture(isMatch.time)) {
              // onlyAdmin(caller);

              return #err(#GenericError { error_code = 0; message = "Time limit exceeded" });
            };
        
            let newParticipant : Participant = {
              userId;
              squadId = squadId;
              contestId = iContestId;
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

            let newSlotsUsed = isContest.slotsUsed +1;
            let newContest : Contest = {
              creatorUserId = isContest.creatorUserId;
              name = isContest.name;
              matchId = isContest.matchId;
              slots = isContest.slots;
              slotsUsed = newSlotsUsed;
          
              minCap = isContest.minCap;
              maxCap = isContest.maxCap;
              providerId = isContest.providerId;
              teamsPerUser = isContest.teamsPerUser;
              winner = isContest.winner;
             
              rules = isContest.rules;
             
            };
            let _t = contestStorage.replace(iContestId, newContest);
            let _res = pIncreaseParticipant({
              id = userId;
              assetsVal = null;
            });
          
            participantStorage.put(
              squadId # iContestId,
             newParticipant 
            );

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
  
        };
        return tempAsset;
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

  //!! PlayersStats 
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
    private func getMatchId(id : Key) : ?Key {
    var key : ?Key = null;
    for ((_key, match) in matchStorage.entries()) {
      if (match.providerId == id) {
        key := ?_key;
      };
    };
    return key;
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
    private func sortRankingByRank((_ka : Key, a : { rank : Int; creation_time : Int }), (_kb : Key, b : { rank : Int; creation_time : Int })) : Order.Order {
    if (a.rank < b.rank) return #less;
    if (a.rank > b.rank) return #greater;
    if (a.creation_time < b.creation_time) return #less;
    if (a.creation_time > b.creation_time) return #greater;
    return #equal;
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
    private func sortRanking((_ka : Key, a : { points : Int; creation_time : Int }), (_kb : Key, b : { points : Int; creation_time : Int })) : Order.Order {
    if (a.points > b.points) return #less;
    if (a.points < b.points) return #greater;
    if (a.creation_time < b.creation_time) return #less;
    if (a.creation_time > b.creation_time) return #greater;
    return #equal;
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
                usersMap.put(isWinner,  isUser );
              };
            };

          };
        };
      };
    };

    let filteredArr = Iter.toArray(usersMap.entries());
    let compareFunc = func((_ka : Key, a : ContestWinner), (_kb : Key, b : ContestWinner)) : Order.Order {
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

      
   private func getJoinedContestsSquadIds(userId : Key, contestId : ?Key) : [Key] {
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
  private func alreadyContestsCreated(matchId : Key) : Bool
 {
 
var isContestCreated:Bool=false;
    label contestLoop for ((key, contest) in contestStorage.entries()) {
      if (isContestCreated) {
        break contestLoop;
      };
      if (contest.matchId == matchId) {

        if (search({ compare = contest.name; s = "Free" })) isContestCreated := true;
        

      };
    };
    return isContestCreated;
  };
 public shared ({
    caller;
  }) func addDefaultContestsOnMatches() : async Result.Result<(Text), (Text)> {
    onlyAdmin(caller);
    let currentTime = getTime();

    for ((key, match) in matchStorage.entries()) {
              let alreadyContestCreated = alreadyContestsCreated(key);

      if (not alreadyContestCreated and match.time >= currentTime  ) {
     
        let id = Int.toText(Time.now()) # key;
     
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
    };
    return #ok("contest created successfully");
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

  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_users := Iter.toArray(userStorage.entries());
    stable_players := Iter.toArray(playerStorage.entries());
    stable_matches := Iter.toArray(matchStorage.entries());
    stable_tournaments := Iter.toArray(tournamentStorage.entries());
    stable_seasons := Iter.toArray(seasonStorage.entries());
    stable_teams := Iter.toArray(teamStorage.entries());
    stable_adminSettings := Iter.toArray(adminSettingStorage.entries());
    stable_contests := Iter.toArray(contestStorage.entries());
    stable_participants := Iter.toArray(participantStorage.entries());
    stable_userStats := Iter.toArray(userStatsStorage.entries());
    stable_playersStats := Iter.toArray(playersStatsStorage.entries());
    stable_playerSquads := Iter.toArray(playerSquadStorage.entries());


    Debug.print("pre-upgrade finished.");
  };
  
  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    userStorage := Map.fromIter<Key, User>(stable_users.vals(), stable_users.size(), Text.equal, Text.hash);
    playerStorage := Map.fromIter<Key, Player>(stable_players.vals(), stable_players.size(), Text.equal, Text.hash);
    matchStorage := Map.fromIter<Key, Match>(stable_matches.vals(), stable_matches.size(), Text.equal, Text.hash);
    tournamentStorage := Map.fromIter<Key, Tournament>(stable_tournaments.vals(), stable_tournaments.size(), Text.equal, Text.hash);
    seasonStorage := Map.fromIter<Key, Season>(stable_seasons.vals(), stable_seasons.size(), Text.equal, Text.hash);
    teamStorage := Map.fromIter<Key, Team>(stable_teams.vals(), stable_teams.size(), Text.equal, Text.hash);
    adminSettingStorage := Map.fromIter<Key, AdminSetting>(stable_adminSettings.vals(), stable_adminSettings.size(), Text.equal, Text.hash);
    contestStorage := Map.fromIter<Key, Contest>(stable_contests.vals(), stable_contests.size(), Text.equal, Text.hash);
    participantStorage := Map.fromIter<Key, Participant>(stable_participants.vals(), stable_participants.size(), Text.equal, Text.hash);
    userStatsStorage := Map.fromIter<Key, UserAssets>(stable_userStats.vals(), stable_userStats.size(), Text.equal, Text.hash);
    playersStatsStorage := Map.fromIter<Key, PlayerStats>(stable_playersStats.vals(), stable_playersStats.size(), Text.equal, Text.hash);
    playerSquadStorage := Map.fromIter<Key, PlayerSquad>(stable_playerSquads.vals(), stable_playerSquads.size(), Text.equal, Text.hash);


    stable_users := [];
    stable_players := [];
    stable_matches := [];
    stable_tournaments:=[];
    stable_seasons:=[];
    stable_teams:=[];
    stable_adminSettings:=[];
    stable_contests:=[];
    stable_participants:=[];
    stable_userStats:=[];
    stable_playersStats:=[];
    stable_playerSquads:=[];
    Debug.print("post-upgrade finished.");
  };
};
