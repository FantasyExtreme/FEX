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

  type RMatches = Types.RMatches;
  type Team = Types.Team;

  type ReturnMatches = { matches : RTournamentMatches; total : Nat };
  type ReturnTournaments = { tournaments : Tournaments; total : Nat };

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

  var playerStorage = Map.fromIter<Key, Player>(stable_players.vals(), 0, Text.equal, Text.hash);
  var seasonStorage = Map.fromIter<Key, Season>(stable_seasons.vals(), 0, Text.equal, Text.hash);

  var userStorage = Map.fromIter<Key, User>(stable_users.vals(), 0, Text.equal, Text.hash);
  var matchStorage = Map.fromIter<Key, Match>(stable_matches.vals(), 0, Text.equal, Text.hash);
  var tournamentStorage = Map.fromIter<Key, Tournament>(stable_tournaments.vals(), 0, Text.equal, Text.hash);
  var teamStorage = Map.fromIter<Key, Team>(stable_teams.vals(), 0, Text.equal, Text.hash);
  var adminSettingStorage = Map.fromIter<Key, AdminSetting>(stable_adminSettings.vals(), 0, Text.equal, Text.hash);

  private func getLimit(limit : Nat) : Nat {
    var _l = MAX_LIMIT;
    if (limit < MAX_LIMIT) _l := limit;
    return _l;
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
    // onlyAdmin(caller);

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
    // onlyAdmin(caller);
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
    // onlyAdmin(caller);
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
    // onlyAdmin(caller);
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

  private func pGetMatches(props : GetProps, time : ?Int, tournamentId : ?Key) : RMatches {
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

              if (FantasyStoreHelper.isSameDay(isTime, v.time)) {
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
  public query func getMatchesWithTournamentId(props : GetProps, time : ?Int, tournamentId : ?Key) : async ReturnMatches {

    var limit = getLimit(props.limit);
    let sortedMatches = pGetMatches(props : GetProps, time : ?Int, tournamentId : ?Key);
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

  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_users := Iter.toArray(userStorage.entries());
    stable_players := Iter.toArray(playerStorage.entries());
    stable_matches := Iter.toArray(matchStorage.entries());
    stable_tournaments := Iter.toArray(tournamentStorage.entries());
    stable_seasons := Iter.toArray(seasonStorage.entries());
    stable_teams := Iter.toArray(teamStorage.entries());
    stable_adminSettings := Iter.toArray(adminSettingStorage.entries());

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

    stable_users := [];
    stable_players := [];
    stable_matches := [];
    stable_tournaments:=[];
    stable_seasons:=[];
    stable_teams:=[];
    stable_adminSettings:=[];

    Debug.print("post-upgrade finished.");
  };
};
