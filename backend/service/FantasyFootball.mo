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
  type ReturnPagContests = {
    contests : Contests;
    total : Nat;
  };
    type RawPlayerSquad = Types.RawPlayerSquad;

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

  type RMatches = Types.RMatches;
  type Team = Types.Team;

  type ReturnMatches = { matches : RTournamentMatches; total : Nat };
  type ReturnTournaments = { tournaments : Tournaments; total : Nat };
  type ReturnTeams = { teams : RawPlayerSquads; total : Nat };

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

    stable_users := [];
    stable_players := [];
    stable_matches := [];
    stable_tournaments:=[];
    stable_seasons:=[];
    stable_teams:=[];
    stable_adminSettings:=[];
    stable_contests:=[];
    stable_participants:=[];
    Debug.print("post-upgrade finished.");
  };
};
