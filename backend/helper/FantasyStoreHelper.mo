
import Int "mo:base/Int";
module FantasyStoreHelper {

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
  // Function to compare two timestamps and return true if they fall on the same dayisSameDay
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

};
