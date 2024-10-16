import { Auth } from "@/types/store";
import { toast } from "react-toastify";
import {

  GetProps,
  GroupedPlayers,
  LoadingState,
  Match,
  MatchesCountType,
  MatchesType,
  Player,
  TournamentType,

} from '@/types/fantasy';
import {
  MatchStatusNames,
  MatchStatuses,
  PlayerStatusText,
  PlayerStatuses,

} from '@/constant/variables';
import {
  
  groupMatchesByTournamentId,
  
} from '@/lib/helper';
import { fromNullable, toNullable } from "@dfinity/utils";
import { utcToLocal } from "./utcToLocal";
import { Identity } from "@dfinity/agent";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { convertMotokoObject } from "./convertMotokoObject";

import moment from 'moment';


export function isConnected(state: string): boolean {
  return state == 'initialized';
}
interface TeamId {
  id: string;
  name: string;
}
export function requireAuth(state: string): boolean {
  if (isConnected(state)) {
    return true;
  } else {
    toast.error(
      'Please Connect with Internet Identity to perform this action',
      { autoClose: 3000 },
    );
    return false;
  }
}
/**
 * Calculates the points for a substitute player.
 *
 * @param points - The total points earned by the player
 * @return The points earned by the substitute player
 */
export function getSubstitutePoints(points: number) {
  return Math.floor(points / 2);
}
/**
 * take position string and rename it as the postion abriviation
 * @param ps postionString of player
 * @returns renamed postion abriviation
 */

export function renamePosition(ps: string) {
  switch (ps) {
    case 'goalKeeper':
      return 'GK';
      break;
    case 'midfielder':
      return 'MD';
      break;
    case 'forward':
      return 'FWD';
      break;
    case 'defender':
      return 'DFD';
      break;

    default:
      return '----';
      break;
  }
}
/**
 * Generates a random team name by combining a random adjective and a random noun.
 * @returns {string} A random team name.
 */
export function generateTeamName(): string {
  const adjectives: string[] = [
    'Mighty',
    'Brave',
    'Swift',
    'Fierce',
    'Valiant',
    'Clever',
    'Bold',
    'Fearless',
    'Noble',
    'Daring',
  ];

  const nouns: string[] = [
    'Lions',
    'Eagles',
    'Wolves',
    'Tigers',
    'Dragons',
    'Warriors',
    'Knights',
    'Panthers',
    'Titans',
    'Rangers',
  ];

  const randomAdjective: string =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun: string = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
}
/**
 * Calls the backend function getBudget() and sets the state with the text value.
 *
 * @param actor - The object used to interact with the backend.
 * @param setState - The state setter function.
 */
export async function getBudget(
  actor: any,
  setState: React.Dispatch<React.SetStateAction<number | null>>,
  setState1?: React.Dispatch<React.SetStateAction<number | null>>,
): Promise<void> {
  const res = fromNullable(await actor.getBudget());
  if (res) {
    setState(Number(res));
    if (setState1) setState1(Number(res));
  }
}
interface GetPlayerProps {
  auth: Auth;
  setCount: React.Dispatch<React.SetStateAction<any>>;
  setPlayers?: React.Dispatch<React.SetStateAction<GroupedPlayers | null>>;
  ids: TeamId[];
  setSinglePlayers?: React.Dispatch<React.SetStateAction<Player[] | null>>;
}
export function getTeamName(ids: TeamId[], id: string) {
  return ids.find((team) => team?.id == id)?.name;
}
export function groupPlayersByRole(
  players: Player[],
): Record<string, Player[]> {
  const playersByRole: Record<string, Player[]> = {};

  for (const player of players) {
    // Extract role from position, handle potential missing role key
    const role = Object.keys(player.position).find(
      (key) => key !== 'undefined',
    ); // Ensures role is defined

    if (!role) {
      console.warn(`Skipping player with missing role: ${player.name}`);
      continue;
    }

    if (!playersByRole[role]) {
      playersByRole[role] = [];
    }
    player.positionString = role as any;
    playersByRole[role].push(player);
  }

  return playersByRole;
}
export async function getPlayers({
  auth,
  setCount,
  setPlayers,
  setSinglePlayers,
  ids,
}: GetPlayerProps) {
  // const ids = teams.ids;
  if (!ids) return;
  const refinedIds = ids.map((team) => {
    if (team) return team.id;
  });
  const data = await auth.actor.getPlayersByTeamIds(refinedIds);

  const playersData = data?.ok ? data?.ok[0] : null;
  const playersCountData = data?.ok ? data?.ok[1] : null;
  let playersCount: any = {
    d: 0,
    m: 0,
    g: 0,
    f: 0,
    all: 0,
  };
  for (const key in playersCountData) {
    playersCount[key] = Number(playersCountData[key]); // Parse bigint to number
    playersCount['all'] = Number(playersCountData[key]) + playersCount['all'];
  }
  setCount(playersCount);
  const players = playersData
    ?.map((playerData: any) => {
      return {
        ...convertMotokoObject(playerData),
        fantasyPrice: Number(playerData[1].fantasyPrice),
        teamName: getTeamName(ids, playerData[1].teamId),
        points: fromNullable(playerData[1].points)
          ? Number(playerData[1].points)
          : 0,
        number: Number(playerData[1].number),
      };
    })
    ?.sort((a: any, b: any) =>
      a.number === 0 && b.number !== 0
        ? 1
        : b.number === 0 && a.number !== 0
          ? -1
          : a.number - b.number,
    );
  if (setSinglePlayers) {
    setSinglePlayers(players);
    return players;
  }
  const groupedPlayers = groupPlayersByRole(players);
  if (setPlayers) {
    setPlayers(groupedPlayers);
    return players;
  }
}
/**
 * Get the status of the player
 * @param {Player} player Player you want to get the status of
 * @param  {number} time The unix timestamp in milliseconds of the match the player is playing in.
 * @returns {string} The status of Player
 */
export const getPlayerStatus = (
  player: Player,
  time: number,
): { status: string; showStatus: string | null } => {
  let playerStatus = '';
  let now = moment();
  const temMinutesFromNow = moment().add(10, 'minutes');
  const matchTime = moment(time);
  const isWithinNext10Minutes = matchTime.isBetween(now, temMinutesFromNow);
  let showStatus = null;
  if (player.isPlaying && !player.isSub) {
    showStatus = PlayerStatusText.playing;
    playerStatus = PlayerStatuses.playing;
  } else if (player.isPlaying && player.isSub) {
    showStatus = PlayerStatusText.substitute;
    playerStatus = PlayerStatuses.substitute;
  } else if (isWithinNext10Minutes) {
    showStatus = PlayerStatusText.notPlaying;
    playerStatus = PlayerStatuses.notPlaying;
  } else {
    showStatus = null;
    playerStatus = PlayerStatuses.waiting;
  }

  return { status: playerStatus, showStatus };
};

/**
 * Copy User Account to clipboard
 *  - auth
 */
export async function copyAccount(identity: Identity) {
  if (!identity) return;
  window.navigator.clipboard.writeText(
    AccountIdentifier.fromPrincipal({
      principal: identity.getPrincipal(),
      // subAccount: identity.getPrincipal(),
    }).toHex(),
  );
  toast.success('Wallet Address copied to clipboard', { autoClose: 750 });
}
/**
 * Formats an email address by shortening the local part to the first three characters followed by ellipsis.
 *
 * @param {string} email - The email address to format.
 * @returns {string} The formatted email address.
 */
export function formatEmail(email: string): string {
  const [localPart, domain] = email?.split('@');
  if (!localPart || !domain) {
    return '';
  }
  const slicedLocalPart = localPart.slice(0, 3);
  return `${slicedLocalPart}...@${domain}`;
}
/**
 * Fetches tournaments using the provided actor and updates the state with the fetched data.
 * @param actor - The actor object used to fetch tournaments.
 * @param props - The properties required for fetching tournaments.
 * @param setTournaments - State setter function for tournaments.
 * @returns A Promise that resolves once tournaments are fetched and state is updated.
 */
export async function getTournaments(
  actor: any,
  props: GetProps,
  setTournaments: React.Dispatch<React.SetStateAction<TournamentType | null>>,
) {
  if (actor) {
    var res = await actor.getTournamentsN(props);
    setTournaments(res?.tournaments);
  }
  // var tournaments = res?.tournaments?.map((data: any) => {
  //   return convertMotokoObject(data);
  // });
  // if (setTournaments) setTournaments(tournaments);
}
/**
 * Generate a random user Name.
 *
 * @returns A four-digit string starting with 'User'.
 * @throws No exceptions are thrown in this function.
 */
export function generateRandomName(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `User${randomNumber.toString().padStart(4, '0')}`;
}

export async function getTeam(teamId: string, actor: any) {
  const team = fromNullable(await actor.getTeamById(teamId));
  if (team) return { id: teamId, ...team };
  else return null;
}
export async function getMatches(
  actor: any,
  setMatches: React.Dispatch<React.SetStateAction<MatchesType>>,
  props: GetProps,
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState>>,
  setMatchesCount: React.Dispatch<
    React.SetStateAction<MatchesCountType>
  > | null,
  time: number[] | [],
  tournamentId: string | null,
  flatten?: boolean,
) {
  switch (props.status) {
    case MatchStatuses.upcoming:
      setLoadingState((prev) => ({ ...prev, upcoming: true }));
      break;
    case MatchStatuses.ongoing:
      setLoadingState((prev) => ({ ...prev, ongoing: true }));
      break;
    case MatchStatuses.finished:
      setLoadingState((prev) => ({ ...prev, finished: true }));
      break;
  }
  let id = toNullable(tournamentId);
  const resp = await actor.getMatchesWithTournamentId(props, time, id);
const matches = resp?.matches;
  let totalMatches = Number(resp?.total) ?? 0;
  const matchesWithTeams = await Promise.all(
    matches?.map(async (match: any) => {
      const homeTeam = await getTeam(match?.homeTeam, actor);
      const awayTeam = await getTeam(match?.awayTeam, actor);
      if (!homeTeam || !awayTeam) {
        return null;
      }
      const newDate = utcToLocal(match.time, 'MMM  D, YY');
      // moment
      //   .unix(Number(match?.time))
      //   .format('mm-dd-yyyy');
      const newTime = utcToLocal(match?.time, 'hh:mm A');
      //  moment.unix(Number(match?.time)).format('hh:mm A');
      let isPostpond = MatchStatusNames.postpond == match.status;

      return {
        id: match.id,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        location: match?.location,
        date: newDate,
        time: newTime,
        tournamentId: match.tournamentId,
        tournamentName: match.tournamentName,
        homeScore: Number(match?.homeScore),
        awayScore: Number(match?.awayScore),
        status: match.status,
        isPostpond,
        groupId: match.tournamentId + newDate+newTime,
        isRewardable: match.isRewardable
      
      };
    }),
  );
  const filteredMatches = matchesWithTeams.filter((match: any) => {
    if (match != null) {
      return true;
    } else {
      return false;
    }
  });
  let groupedResult = groupMatchesByTournamentId(filteredMatches);
  const combineSequentialMatches = (data: null | [string, Match[]][]) => {
    if (data == null) return null;
    const result = [];
    let currentCombinedArray: [string, Match[]][] = [];
    let currentId = null;

    for (let i = 0; i < data.length; i++) {
      const [currentKey, currentValue] = data[i];
      const nextKey = i + 1 < data?.length ? data[i + 1][0] : null;
      const currentItemId = currentKey.match(/^\d+/)[0];
      const nextItemId = nextKey ? nextKey.match(/^\d+/)[0] : null;

      if (currentId === null) {
        currentId = currentItemId;
      }

      if (currentId === currentItemId) {
        currentCombinedArray = [...currentCombinedArray, ...currentValue];
      }

      if (currentItemId !== nextItemId) {
        result.push([currentKey, currentCombinedArray]);
        currentCombinedArray = [];
        currentId = null;
      } else {
        currentId = nextItemId;
      }
    }

    return result;
  };
  const matchGroup = combineSequentialMatches(groupedResult);

  switch (props.status) {
    case MatchStatuses.upcoming:
      setLoadingState((prev) => ({ ...prev, upcoming: false }));
      if (setMatchesCount)
        setMatchesCount((prev) => ({ ...prev, upcoming: totalMatches }));
      if (flatten) {
        setMatches((prev) => ({ ...prev, upcoming: filteredMatches }));
      } else {
        setMatches((prev) => ({ ...prev, upcoming: matchGroup }));
      }
      break;
    case MatchStatuses.ongoing:
      setLoadingState((prev) => ({ ...prev, ongoing: false }));
      if (setMatchesCount)
        setMatchesCount((prev) => ({ ...prev, ongoing: totalMatches }));

      setMatches((prev) => ({ ...prev, ongoing: matchGroup }));
      break;
    case MatchStatuses.finished:
      setLoadingState((prev) => ({ ...prev, finished: false }));
      if (setMatchesCount)
        setMatchesCount((prev) => ({ ...prev, finished: totalMatches }));
      if (flatten) {
        setMatches((prev) => ({ ...prev, finished: filteredMatches }));
      } else {
        setMatches((prev) => ({ ...prev, finished: matchGroup }));
      }
      break;
  }
}
/**
 * use this func to make the text copy able.
 * @param {auth}  - pricipale is require to copy it.
 */
export async function copyPrincipal(auth: any) {
  window.navigator.clipboard.writeText(auth.identity.getPrincipal().toString());
  toast.success('Principal copied to clipboard', { autoClose: 750 });
}