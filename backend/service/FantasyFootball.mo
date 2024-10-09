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
import Prim "mo:prim";
import Types "../model/Types";

shared ({ caller = initializer }) actor class () {

  type Key = Types.Key;
  type User = Types.User;
  type IUser = Types.IUser;
  
  type Users = Types.Users;
  
  var TIME_DEVISOR = Types.TIME_DEVISOR;
  var MAX_LIMIT = Types.MAX_LIMIT;

  stable var stable_users : Users = [];


  var userStorage = Map.fromIter<Key, User>(stable_users.vals(), 0, Text.equal, Text.hash);


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
  // Users
  public shared ({ caller }) func addUser(iUser : IUser) : async Result.Result<(Text, ?User), Text> {
    // Return error if the user already exists
    assert not Principal.isAnonymous(caller);
    let maybeOldUser = userStorage.get(Principal.toText(caller));
    switch maybeOldUser {
      case (?user) {
        var tempUser : User = {
          name = iUser.name;
          joiningDate = getTime();
          role = #user;
          email = iUser.email;
        };

        let newUser = userStorage.replace(Principal.toText(caller), tempUser);
        // return #ok("User added successfuly", tempUser);
        return #ok("Already a User", newUser);
      };
      case (null) {
        // return #err("Error while getting user");
        var tempUser : User = {
          name = iUser.name;
          joiningDate = getTime();
          email = iUser.email;
          role = #user;
        };

        userStorage.put(Principal.toText(caller), tempUser);
        return #ok("User added successfuly", ?tempUser);
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

  system func preupgrade() {
    Debug.print("Starting pre-upgrade hook...");
    stable_users := Iter.toArray(userStorage.entries());
    Debug.print("pre-upgrade finished.");
  };
  system func postupgrade() {
    Debug.print("Starting post-upgrade hook...");
    userStorage := Map.fromIter<Key, User>(stable_users.vals(), stable_users.size(), Text.equal, Text.hash);

    stable_users := [];

    Debug.print("post-upgrade finished.");
  };
};
