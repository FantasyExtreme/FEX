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
import Result "mo:base/Result";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Map "mo:base/HashMap";
import Types "./Types";

module Validation {
  type Player = Types.Player;
  type Formation = {
    goalKeeper : Nat;
    defender : Nat;
    midfielder : Nat;
    forward : Nat;
  };

  type Substitution = {
    goalKeeper : Nat;
    defender : Nat;
    midfielder : Nat;
    forward : Nat;
  };

  type FormationAndSubstitution = {
    formation : Formation;
    substitution : Substitution;
  };

  let FORMATIONS_AND_SUBSTITUTION : [FormationAndSubstitution] = [
    {
      formation = { goalKeeper = 1; defender = 3; midfielder = 4; forward = 3 };
      substitution = {
        goalKeeper = 1;
        defender = 2;
        midfielder = 1;
        forward = 0;
      };
    },
    {
      formation = { goalKeeper = 1; defender = 3; midfielder = 5; forward = 2 };
      substitution = {
        goalKeeper = 1;
        defender = 2;
        midfielder = 0;
        forward = 1;
      };
    },
    {
      formation = { goalKeeper = 1; defender = 4; midfielder = 3; forward = 3 };
      substitution = {
        goalKeeper = 1;
        defender = 1;
        midfielder = 2;
        forward = 0;
      };
    },
    {
      formation = { goalKeeper = 1; defender = 4; midfielder = 4; forward = 2 };
      substitution = {
        goalKeeper = 1;
        defender = 1;
        midfielder = 1;
        forward = 1;
      };
    },
    {
      formation = { goalKeeper = 1; defender = 4; midfielder = 5; forward = 1 };
      substitution = {
        goalKeeper = 1;
        defender = 1;
        midfielder = 0;
        forward = 2;
      };
    },
    {
      formation = { goalKeeper = 1; defender = 5; midfielder = 2; forward = 3 };
      substitution = {
        goalKeeper = 1;
        defender = 0;
        midfielder = 3;
        forward = 0;
      };
    },
    {
      formation = { goalKeeper = 1; defender = 5; midfielder = 3; forward = 2 };
      substitution = {
        goalKeeper = 1;
        defender = 0;
        midfielder = 2;
        forward = 1;
      };
    },
    {
      formation = { goalKeeper = 1; defender = 5; midfielder = 4; forward = 1 };
      substitution = {
        goalKeeper = 1;
        defender = 0;
        midfielder = 1;
        forward = 2;
      };
    },
  ];
   func getFormation(formationString : Text) : ?FormationAndSubstitution {

    //   let parts = Text.split(arg, #char '-');
    var currentFormation = {
      defender = 0;
      midfielder = 0;
      forward = 0;
    };
    var index = 1;
    //     var list = List.nil<Nat>();

    for (chr in Text.toArray(formationString).vals()) {
      if (index == 1) {
        let charToNum = Nat32.toNat(Char.toNat32(chr) -48);

        currentFormation := { currentFormation with defender = charToNum };

      };
      if (index == 3) {
        let charToNum = Nat32.toNat(Char.toNat32(chr) -48);

        currentFormation := { currentFormation with midfielder = charToNum };

      };
      if (index == 5) {
        let charToNum = Nat32.toNat(Char.toNat32(chr) -48);

        currentFormation := { currentFormation with forward = charToNum };

      };
      index += 1;
    };

    var tempFormation : ?FormationAndSubstitution = null;

    label formationloop for (formationSubst in FORMATIONS_AND_SUBSTITUTION.vals()) {
      if (
        formationSubst.formation.defender == currentFormation.defender and formationSubst.formation.midfielder == currentFormation.midfielder and formationSubst.formation.forward == currentFormation.forward
      ) {
        tempFormation := ?formationSubst;
        break formationloop;
      };
    };
    return tempFormation;

  };
  func compareFormations(f1: Formation, f2: Formation): Bool {
    return f1.goalKeeper == f2.goalKeeper
      and f1.defender == f2.defender
      and f1.midfielder == f2.midfielder
      and f1.forward == f2.forward;
  };
// this function check what ever user hs selected player according to formation or not
  public func validateTeamFormation(inputPlayers : [(Text, Bool)], teamFormation : Text, playerStorage : Map.HashMap<Text, Player>) : Result.Result<Text, Text> {

    let _getFormation = getFormation(teamFormation);
    switch (_getFormation) {
      case (null) {
        return #err("Team Formation Not found.");

      };
      case (?isFormation) {
        var playerFormation = {
          goalKeeper = 0;
          defender = 0;
          midfielder = 0;
          forward = 0;
        };
        var substitutionFormation = {
          goalKeeper = 0;
          defender = 0;
          midfielder = 0;
          forward = 0;
        };
        for ((key, isSub) in inputPlayers.vals()) {
          let getPlayer = playerStorage.get(key);
          switch (getPlayer) {
            case (null) {};
            case (?isPlayer) {

              switch (isPlayer.position) {
                case (#goalKeeper) {
                  if (isSub) {
                    substitutionFormation := {
                      substitutionFormation with goalKeeper = substitutionFormation.goalKeeper + 1;
                    }

                  } else {

                    playerFormation := {
                      playerFormation with goalKeeper = playerFormation.goalKeeper + 1;
                    };
                  };
                };
                case (#defender) {
                  if (isSub) {
                    substitutionFormation := {
                      substitutionFormation with defender = substitutionFormation.defender + 1;
                    }

                  } else {

                    playerFormation := {
                      playerFormation with defender = playerFormation.defender + 1;
                    };
                  };
                };
                case (#midfielder) {
                  if (isSub) {
                    substitutionFormation := {
                      substitutionFormation with midfielder = substitutionFormation.midfielder + 1;
                    }

                  } else {

                    playerFormation := {
                      playerFormation with midfielder = playerFormation.midfielder + 1;
                    };
                  };
                };
                case (#forward) {
                  if (isSub) {
                    substitutionFormation := {
                      substitutionFormation with forward = substitutionFormation.forward + 1;
                    }

                  } else {

                    playerFormation := {
                      playerFormation with forward = playerFormation.forward + 1;
                    };
                  };
                };
              };
            };
          };

        };
      
     if(compareFormations(playerFormation, isFormation.formation)  and compareFormations(substitutionFormation, isFormation.substitution)){
      return #ok("formation is correct");

    }else{
        let totalPlayerSelected=playerFormation.goalKeeper+playerFormation.defender+playerFormation.midfielder+playerFormation.forward;
        let totalSubstitutePlayersSelected=substitutionFormation.goalKeeper+substitutionFormation.defender+substitutionFormation.midfielder+substitutionFormation.forward;

        if(totalPlayerSelected != 11){
        return #err("Please select 11 players");
        };
         if(totalSubstitutePlayersSelected != 4){
        return #err("Please select 4 Substitute");
        };
         return #err("Players are not selected according to Formation.");

      }
      };
    };

  };
  // check if user has selected 9 or more then 9 player from single team 
   public func validateSelectedPlayersAreNotFromSingleTeam(inputPlayers : [(Text, Bool)], homeTeamId : Text,awayTeamId : Text, playerStorage : Map.HashMap<Text, Player>) : Result.Result<Text, Text> {
var homeTeamPlayers:Nat=0;
var awayTeamPlayers:Nat=0;

     for ((key, isSub) in inputPlayers.vals()) {
        let player=playerStorage.get(key);
        switch(player) {
            case(null) { };
            case(?isPlayer) {  
               if(isPlayer.teamId==homeTeamId){
                homeTeamPlayers +=1;
               };
                if(isPlayer.teamId==awayTeamId){
                awayTeamPlayers +=1;
               }
            };
        };

     };
     if(homeTeamPlayers > 9 or awayTeamPlayers > 9){
        return #err("You can't select more than 9 players from single team.")
     };
     return #ok("Players are select right ")
  };

  // use to check whatever selected players are 15 or not if substitute and players are not 15 then return error
  public func playersCount(inputPlayers : [(Text, Bool)]) : Result.Result<Text, Text> {
    var playerCount : Nat = 0;
    var substituteCount : Nat = 0;

    for ((_, isSubstitute) in inputPlayers.vals()) {
      if (isSubstitute) {
        substituteCount += 1;
      } else {
        playerCount += 1;
      };
    };

    // Check if there are exactly 11 players and 4 substitutes
    if (playerCount != 11) {

      return #err("There must be exactly 11 players.");
    };
    if (substituteCount != 4) {
      return #err("There must be exactly 4 substitutes.");
    };
    return #ok("15 players are selected");

  };

};
