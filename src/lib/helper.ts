import {

  Contest,
    Match,
    matchWithGroupedId,
  } from '@/types/fantasy';
  import _ from 'lodash';
  export function getFromLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  }
  
  export function getFromSessionStorage(key: string): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(key);
    }
    return null;
  }
  /**
 * Groupe Contests by match
 * @param {null | Contest[]} contests
 * @returns {GroupedContests}  [string,Match]
 */
export function groupContestsByMatch(
  contests: null | Contest[],
): null | [string, Contest[]][] {
  if (!contests) return null;

  // Use lodash's groupBy function
  const grouped = _.groupBy(contests, (contest) => contest.matchId);

  // Convert the grouped object into an array of key-value pairs
  return Object.entries(grouped);
}
  /**
   *
   * @param {null| Match[]} matches
   * @returns {[string,Match]}  [string,Match]
   */
  export function groupMatchesByTournamentId(
    matches: null | matchWithGroupedId[],
  ): null | [string, Match[]][] {
    if (!matches) return null;
  
    // Use lodash's groupBy function groupId
    const grouped = _.groupBy(
      matches,
      (match: { groupId: any }) => match.groupId,
    );
  
    // Convert the grouped object into an array of key-value pairs
    return Object.entries(grouped);
  }
 
 
  // utils/smoothScroll.ts
  export const smoothScrollTo = (
    target: HTMLElement,
    duration: number = 10000,
  ) => {
    // 10 seconds duration
    const startPosition = window.pageYOffset;
    const targetPosition = target.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;
  
    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Clamp progress to 1
      const run = easeInOutQuad(progress, startPosition, distance, 1);
      window.scrollTo(0, run);
      if (progress < 1) requestAnimationFrame(animation);
    };
  
    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };
  
    requestAnimationFrame(animation);
  };
  