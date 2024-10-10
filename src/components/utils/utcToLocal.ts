import moment from 'moment';
import numeral from 'numeral';
import { toast } from 'react-toastify';

const utcToLocal = (date: BigInt, format: string): string => {
  if (!date) {
    return moment.utc().local().format(format);
  } else {
    return moment(parseInt(date.toString())).local().format(format);
  }
};
const commentTime = (creatDate: any) => {
  moment.locale('en-au');
  const stillUtc = moment.utc(parseInt(creatDate)).toDate();
  let tempCreation = moment(stillUtc).local().fromNow();
  return tempCreation;
};
function formatLikesCount(likes: any) {
  if (likes >= 1000000000) {
    return numeral(likes).format('0.0a').toUpperCase();
  } else if (likes >= 1000000 && likes < 1000000000) {
    return numeral(likes).format('0.0a').toUpperCase();
  } else if (likes >= 1000 && likes < 1000000) {
    return numeral(likes).format('0.0a').toUpperCase();
  } else {
    return likes.toString();
  }
}
/**
 * Formats a number into a human-readable format (e.g., "100M", "10K").
 *
 * @param {number} value - The number to format.
 * @returns {string} The formatted number string.
 */
function formatNumber(value: number): string {
  return value < 1000
    ? numeral(value).format('0a').toUpperCase()
    : numeral(value).format('0.0a').toUpperCase();
}


export { utcToLocal, formatLikesCount, commentTime,formatNumber };