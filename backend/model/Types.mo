import Time "mo:base/Time";
import Int "mo:base/Int";
import Text "mo:base/Text";


module Types {
  public let TIME_DEVISOR = 1_000_000;
  public let MAX_LIMIT = 10;

  public type Key = Text;
 
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
  
  public type Users = [(Key, User)];


  public func generateNewRemoteObjectId() : Key {
    return Int.toText(Time.now());
  };
};
