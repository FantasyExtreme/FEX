import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Map "mo:base/HashMap";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Prelude "mo:base/Prelude";
import Order "mo:base/Order";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Prim "mo:prim";
import Types "../model/Types";
module FantasyStoreHelper {

  type Key = Types.Key;
  type User = Types.User;
  type Team = Types.Team;
  type Match = Types.Match;
  type InputMatch = Types.InputMatch;
  type Player = Types.Player;
  type Tournament = Types.Tournament;
  type Position = Types.Position;
  type PlayerCount = Types.PlayerCount;
  type PlayerSquad = Types.PlayerSquad;
  type Contest = Types.Contest;
  type Participant = Types.Participant;
  type IPlayerSquad = Types.IPlayerSquad;
  type Users = Types.Users;
  type Matches = Types.Matches;
  type Teams = Types.Teams;
  type Players = Types.Players;
  type Tournaments = Types.Tournaments;
  type PlayerSquads = Types.PlayerSquads;
  type Contests = Types.Contests;
  type Participants = Types.Participants;
  // Constants
  let millisecondsPerDay : Int = 86400000; //24 * 60 * 60 * 1000;

  // Function to extract year, month, and day from a timestamp in milliseconds
  func getDateParts(timestamp : Int) : (Int, Int, Int) {
    // Calculate the total number of days since Unix epoch
    let totalDays = timestamp / millisecondsPerDay;

    // Define a base date (Unix epoch start: 1970-01-01)
    var year = 1970;
    var daysLeft = totalDays;

    // Calculate the year
    label myloop while (daysLeft >= 365) {
      if ((year % 4 == 0 and year % 100 != 0) or year % 400 == 0) {
        // Leap year
        if (daysLeft >= 366) {
          daysLeft -= 366;
          year += 1;
        } else {
          break myloop;
        };
      } else {
        daysLeft -= 365;
        year += 1;
      };
    };

    // Define the number of days in each month
    let daysInMonth = [31, (if (year % 4 == 0 and year % 100 != 0 or year % 400 == 0)  29 else 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Calculate the month
    var month = 1;
    label myForLoop for (days in daysInMonth.vals()) {
      if (daysLeft < days) {
        break myForLoop;
      } else {
        daysLeft -= days;
        month += 1;
      };
    };

    // The remaining days are the day of the month
    let day = daysLeft + 1;

    return (year, month, day);
  };
  // Function to compare two timestamps and return true if they fall on the same day
  public func isSameDay(timestamp1 : Int, timestamp2 : Int) : Bool {
    let (year1, month1, day1) = getDateParts(timestamp1);
    let (year2, month2, day2) = getDateParts(timestamp2);
    return year2 == year1 and month2 == month1 and day2 == day1;
  };
  public func isSameDayWithOffset(timestamp1 : Int, timestamp2 : Int,offset:Int) : Bool {
    let (year1, month1, day1) = getDateParts(timestamp1+offset);
    let (year2, month2, day2) = getDateParts(timestamp2+offset);
    return year2 == year1 and month2 == month1 and day2 == day1;
  };


  // public func searchSortList(array : Map.HashMap<Key, Match>, search : Text, startIndex : Nat, length : Nat) : {
  //     entries : RefinedMatches;
  //     amount : Nat;
  //   } {
  //     let searchString = Text.map(search, Prim.charToLower);
  //     var searchedMatches = Map.HashMap<Key, Match>(0, Text.equal, Text.hash);
  //     for ((key, entry) in array.entries()) {
  //       let title = Text.map(entry.title, Prim.charToLower);
  //       let user = Text.map(entry.userName, Prim.charToLower);
  //       var isTitleSearched = Text.contains(title, #text searchString);
  //       var isUserSearched = Text.contains(user, #text searchString);
  //       if (isTitleSearched or isUserSearched) {
  //         searchedMatches.put(key, entry);
  //       };
  //     };
  //     var searchedMatchesArray : [(Key, Match)] = Iter.toArray(searchedMatches.entries());
  //     let compare = func((keyA : Key, a : Match), (keyB : Key, b : Match)) : Order.Order {
  //       if (a.isPromoted and not b.isPromoted) {
  //         return #less;
  //       } else if (b.isPromoted and not a.isPromoted) {
  //         return #greater;
  //       } else {
  //         if (a.creation_time > b.creation_time) {
  //           return #less;
  //         } else if (a.creation_time < b.creation_time) {
  //           return #greater;
  //         } else {
  //           return #equal;
  //         };
  //       };
  //     };
  //     let sortedEntries = Array.sort(
  //       searchedMatchesArray,
  //       compare,
  //     );
  //     var paginatedArray : [(Key, Match)] = [];
  //     let size = sortedEntries.size();
  //     let amount : Nat = size - startIndex;
  //     let itemsPerPage = 6;
  //     if (size > startIndex and size > (length + startIndex) and length != 0) {
  //       paginatedArray := Array.subArray<(Key, Match)>(sortedEntries, startIndex, length);
  //     } else if (size > startIndex and size > (startIndex + itemsPerPage)) {
  //       if (length != 0) {
  //         paginatedArray := Array.subArray<(Key, Match)>(sortedEntries, startIndex, amount);
  //       } else {
  //         paginatedArray := Array.subArray<(Key, Match)>(sortedEntries, startIndex, itemsPerPage);

  //       };

  //     } else if (size > startIndex and size < (startIndex + itemsPerPage) and size > itemsPerPage) {
  //       Debug.print(debug_show (size, startIndex, amount));
  //       paginatedArray := Array.subArray<(Key, Match)>(sortedEntries, startIndex, amount);

  //     } else if (size > itemsPerPage) {
  //       paginatedArray := Array.subArray<(Key, Match)>(sortedEntries, 0, itemsPerPage);
  //     } else {
  //       paginatedArray := sortedEntries;
  //     };
  //     return { entries = paginatedArray; amount = sortedEntries.size() };
  //   };

};
