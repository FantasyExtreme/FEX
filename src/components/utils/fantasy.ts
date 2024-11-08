import { Auth, UserAuth } from "@/types/store";
import { toast } from "react-toastify";
import {

  Contest,
  ContestType,
  DetailedMatchContest,
  GetProps,
  GroupedContests,
  GroupedPlayers,
  LoadingState,
  Match,
  MatchesCountType,
  MatchesType,
  MeAsTopPlayers,
  Player,
  RfRefinedPlayerSquad,
  Team,
  TeamCreationErrorType,
  TopPlayers,
  TournamentType,

} from '@/types/fantasy';
import {
  EnvironmentEnum,
  JoinContestText,
  MatchStatusNames,
  MatchStatuses,
  Packages,
  PlayerStatusText,
  PlayerStatuses,

} from '@/constant/variables';
import {
  
  groupContestsByMatch,
  groupMatchesByTournamentId,
  
} from '@/lib/helper';
import { fromNullable, toNullable } from "@dfinity/utils";
import { utcToLocal } from "./utcToLocal";
import { Identity } from "@dfinity/agent";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { convertMotokoObject } from "./convertMotokoObject";

import moment from 'moment';
import logger from "@/lib/logger";
import axios from 'axios';
import { API_ROUTE_GET_USD_RATE } from "@/constant/routes";
import { PackageIcons } from "@/constant/icons";
import { RContestTypes } from "@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did";


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
export async function getContestTypes({
  actor,
  set,
  all,
}: {
  actor: any;
  set: React.Dispatch<React.SetStateAction<RContestTypes | null>>;
  all: boolean;
}) {
  let res = await actor.getContestTypes(all);
  set(res);
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
export async function getContest(
  actor: any,
  id: string,
  set: React.Dispatch<React.SetStateAction<any>>,
) {
  const _contest: any = fromNullable(await actor.getContest(id));

  const contest = {
    ..._contest,
    slots: Number(_contest?.slots),
    slotsUsed: Number(_contest?.slotsUsed),
    minCap: Number(_contest?.minCap),
    teamsPerUser: Number(_contest?.teamsPerUser),
  };
  logger({ _contest, contest }, 'looogogogogo');
  set(contest);
}
interface GetContestProps {
  matchId?: string;
  actor: any;
  setContests?: React.Dispatch<React.SetStateAction<Contest[] | null>>;
  setGroupedContests?: React.Dispatch<
    React.SetStateAction<GroupedContests[] | null>
  >;
  userAuth: UserAuth;
}
/**
 * getcontests with and without matchId
 * @param { GetContestProps } param matchId, actor and set state function
 */
export async function getContests({
  matchId,
  actor,
  setContests,
  setGroupedContests,
  userAuth,
}: GetContestProps) {
  if (!actor) return;
  let response = null;
  if (matchId) {
    response = await actor.getContestsByMatchId(matchId);
  } else {
    response = await actor.getJoinedContests();
  }
  const _contests = response
    ?.map((contest: any) => {
      contest[1].slots = Number(contest[1].slots);
      contest[1].slotsUsed = Number(contest[1].slotsUsed);
      contest[1].teamsPerUser = Number(contest[1].teamsPerUser);

      let slotsLeft = contest[1]?.slots - contest[1]?.slotsUsed;

  
      return {
        ...contest[1],
        id: contest[0],
        slotsLeft,
      };
    })
    .sort((a: Contest, b: Contest) => Number(b.id) - Number(a.id));
  if (setContests) {
    logger(_contests, 'tranchullll');

    setContests(_contests);
  } else if (setGroupedContests) {
    let groupedContests = groupContestsByMatch(_contests);
    setGroupedContests(groupedContests);
  }
}
/**
 * sliceText use to slice text if length is less then maxlength then add dots at the end of text
 *
 * @param start -starting point of slice the text
 * @param maxlength - Max size to slice
 * @returns sliced text
 */
export function sliceText(text: any, start: number, maxlength: number) {
  return text?.length > maxlength
    ? `${text?.slice(start, maxlength)}...`
    : text;
}
/**
 * sliceText use to slice text if length is less then maxlength then add dots at the end of text
 *
 * @param start -starting point of slice the text
 * @param maxlength - Max size to slice
 * @returns sliced text
 */
export function sliceTextFromStartAndEnd(text: any, maxlength: number) {
  return  `${text?.slice(0, maxlength)}...${text?.slice(text.length-maxlength, text.length)}`
}
export function isDev() {
  return process.env.NEXT_PUBLIC_DFX_NETWORK == EnvironmentEnum.dev;
}
export async function getRawPlayerSquads(
  matchId: string,
  actor: any,
  teamsPerUser: number,
  setPlayerSquads: React.Dispatch<React.SetStateAction<any>>,
  setParticipants: React.Dispatch<React.SetStateAction<number | null>>,
  setMaximumParticipated: React.Dispatch<React.SetStateAction<boolean>>,
  contestId: string | null,
) {
  try {
    logger(contestId, 'my contest id is disss');
    //   const resp = await actor.getPlayerSquadsByMatchId(matchId);
    const resp = await actor.getListPlayerSquadsByMatch(
      matchId,
      contestId ? [contestId] : [],
    );
    logger(resp, 'my contest is disss');

    let _participants = 0;
    const _playerSquads = resp
      ?.map((squad: any) => {
        if (squad[1].hasParticipated) _participants++;
        let joinedContestsName = squad[1].joinedContestsName.join(',');
        return {
          ...squad[1],
          id: squad[0],
          points: Number(squad[1].points),
          rank: Number(squad[1].rank),
          joinedContestsName: joinedContestsName,
        };
      })
      ?.sort(
        (squadA: any, squadB: any) =>
          Number(squadB.creation_time) - Number(squadA.creation_time),
      );

    setParticipants(_participants);
    if (_participants >= teamsPerUser) setMaximumParticipated(true);
    setPlayerSquads(_playerSquads);
  } catch (error) {
    logger(error);
  }
}
export function getPackage(text: string): string {
  switch (text.toLowerCase()) {
    case Packages.bronze:
      return Packages.bronze;
    case Packages.gold:
      return Packages.gold;
    case Packages.free:
      return Packages.free;
    default:
      return Packages.free;
  }
}
export function getPackageIcon(text: string) {
  let _package = getPackage(text);
  return PackageIcons[_package];
}
/**
 * use this func to make the text copy able.
 * @param {auth}  - pricipale is require to copy it.
 */
export async function copyId(id: any,msg:string) {
  window.navigator.clipboard.writeText(id);
  toast.success(`${msg} copied to clipboard`, { autoClose: 750 });
}
/**
 * Copy User Account to clipboard
 *  - auth
 */
/**
 * Checks if the given time is in the future.
 *
 * @param time - The time to check. Can be null, a number, or a string.
 * @returns Returns true if the time is in the future, false otherwise.
 */
export function isInFuture(time: null | number | string | undefined): boolean {
  const timeValue = typeof time === 'string' ? Number(time) : time;
  return (timeValue ?? moment().valueOf()) > moment().valueOf();
}
/**
 * Checks if the given time is in the past.
 *
 * @param time - The time to check. Can be null, a number, or a string.
 * @returns Returns true if the time is in the past, false otherwise.
 */
export function isInPast(time: null | number | string | undefined): boolean {
  const timeValue = typeof time === 'string' ? Number(time) : time;
  return (timeValue ?? moment().valueOf()) < moment().valueOf();
}

export function getMatchStatus({ status, time }: any): string {
  let _status = MatchStatuses.upcoming;
  if (isInFuture(time)) {
    _status = MatchStatuses.upcoming;
  } else if (isInPast(time)) {
    if (status === 'Match Finished') {
      _status = MatchStatuses.finished;
    } else if (status === 'Match Postponed') {
      _status = MatchStatuses.postponed;
    } else {
      _status = MatchStatuses.ongoing;
    }
  }
  return _status;
}
interface FetchMatchProps {
  actor: any;
  matchId: string;
  setMatch: React.Dispatch<React.SetStateAction<Match | null>>;
}

/**
 * Get the match and players and store in the states
 * @returns match
 */
export async function fetchMatch({
  actor,
  matchId,
  setMatch,
}: FetchMatchProps): Promise<Match | null> {
  const match: any = fromNullable(await actor.getMatch(matchId));
  if (match) {
    match.homeTeam[1] = fromNullable(match.homeTeam[1]);
    match.awayTeam[1] = fromNullable(match.awayTeam[1]);
    const homeTeam = convertMotokoObject(match.homeTeam);
    const awayTeam = convertMotokoObject(match.awayTeam);
    let newMatch = {
      ...match,
      id: matchId,
      homeTeam,
      awayTeam,
      status: getMatchStatus({ time: match?.time, status: match?.status }),
      time: Number(match.time),
    };

    setMatch(newMatch);
    return newMatch;
  } else {
    return null;
  }
}
/**
 * Retrieves filtered contests based on match and status criteria.
 * @param {string | null} matchId - The ID of the match to filter contests for.
 * @param {any} actor - The actor object used to interact with the backend.
 * @param {UserAuth} userAuth - User authentication information.
 * @param {React.Dispatch<React.SetStateAction<ContestType>> | null} setGroupedContests - Setter function for grouped contests state.
 * @param {GetProps} props - Additional props for filtering contests.
 * @param {React.Dispatch<React.SetStateAction<Contest[] | null>> | null} setContests - Setter function for contests state.
 * @param {React.Dispatch<React.SetStateAction<MatchesCountType>> | null} setMatchesCount - Setter function for matches count state.
 * @param {React.Dispatch<React.SetStateAction<LoadingState>>} setLoadingState - Setter function for loading state.
 */
export async function getFilterdContests(
  matchId: string | null,
  actor: any,
  userAuth: UserAuth,
  setGroupedContests: React.Dispatch<React.SetStateAction<ContestType>> | null,
  props: GetProps,
  setContests: React.Dispatch<React.SetStateAction<Contest[] | null>> | null,
  setMatchesCount: React.Dispatch<React.SetStateAction<MatchesCountType>>,
  setLoadingState?: React.Dispatch<React.SetStateAction<LoadingState>>,
) {
  try {
    if (!actor) {
      switch (props.status) {
        case MatchStatuses.upcoming:
          if (setLoadingState)
            setLoadingState((prev) => ({ ...prev, upcoming: false }));
          break;

        case MatchStatuses.ongoing:
          if (setLoadingState)
            setLoadingState((prev) => ({ ...prev, ongoing: false }));
          break;

        case MatchStatuses.finished:
          if (setLoadingState)
            setLoadingState((prev) => ({ ...prev, finished: false }));
          break;
      }
      return;
    }
    let response = null;
    if (setLoadingState) {
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
    }
    if (matchId) {
      response = await actor.getPaginatedContestsByMatchId(matchId, props);
    } else {
      response = await actor.getFilterdContests(props);
    }
    var totalMatches = Number(response?.total) ?? 0;

    const _contests = response?.contests
      ?.map((contest: any) => {
        // let contestv1 = convertMotokoObject(contest);
        contest[1].slots = Number(contest[1].slots);
        contest[1].slotsUsed = Number(contest[1].slotsUsed);
        contest[1].teamsPerUser = Number(contest[1].teamsPerUser);
        let slotsLeft = contest[1]?.slots - contest[1]?.slotsUsed;
        // let distributees =
        return {
          ...contest[1],
          id: contest[0],
          slotsLeft,
        };
      })
      .sort((a: Contest, b: Contest) => Number(b.id) - Number(a.id));
    if (setContests) {
      setContests(_contests);
    }
    var groupedContests = groupContestsByMatch(_contests);
    const filteredGroupedContests = groupedContests?.filter(
      ([matchId, contestArray]) =>
        contestArray.some((contest) => contest.name.includes(props.search)),
    );

    switch (props.status) {
      case MatchStatuses.upcoming:
        if (setLoadingState)
          setLoadingState((prev) => ({ ...prev, upcoming: false }));
        if (setMatchesCount)
          setMatchesCount((prev: any) => ({ ...prev, upcoming: totalMatches }));

        if (setGroupedContests)
          setGroupedContests((prev: any) => ({
            ...prev,
            upcoming: groupedContests,
          }));
        break;

      case MatchStatuses.ongoing:
        if (setLoadingState)
          setLoadingState((prev) => ({ ...prev, ongoing: false }));
        if (setMatchesCount)
          setMatchesCount((prev: any) => ({ ...prev, ongoing: totalMatches }));

        if (setGroupedContests)
          setGroupedContests((prev: any) => ({
            ...prev,
            ongoing: groupedContests,
          }));
        break;

      case MatchStatuses.finished:
        if (setLoadingState)
          setLoadingState((prev) => ({ ...prev, finished: false }));
        if (setMatchesCount)
          setMatchesCount((prev: any) => ({ ...prev, finished: totalMatches }));

        if (setGroupedContests)
          setGroupedContests((prev: any) => ({
            ...prev,
            finished: groupedContests,
          }));
        break;
    }
  } catch (error) {
    switch (props.status) {
      case MatchStatuses.upcoming:
        if (setLoadingState)
          setLoadingState((prev) => ({ ...prev, upcoming: false }));
        break;

      case MatchStatuses.ongoing:
        if (setLoadingState)
          setLoadingState((prev) => ({ ...prev, ongoing: false }));
        break;

      case MatchStatuses.finished:
        if (setLoadingState)
          setLoadingState((prev) => ({ ...prev, finished: false }));
        break;
    }
  }
}
export async function getIcpRate() {
  try {
    // Make the API call
    const response = await axios.get(API_ROUTE_GET_USD_RATE);

    // Access the USD rate from the response data
    const rate = response.data['internet-computer']?.usd;

    // Log the rate
    return rate.toFixed(2);
    logger(rate, 'errorerror');
  } catch (error) {
    // Log the error
    logger(error, 'errorerror');
    return 0;
  }
}


export function refineSquad(squad: any): RfRefinedPlayerSquad | null {
  if (!squad) return null;
  return {
    ...squad,
    points: Number(squad.points),
    creation_time: Number(squad.creation_time),
    rank: Number(squad?.rank),
  };
}
/**
 * Fetches getMeAsTopplayers use to get user Rank
 * @param actor - The actor object used to fetch  top fantasy player.
 * @param userId - The properties required for fetching  top fantasy player.
 * @param setTopPlayers - State setter function for  top fantasy player.
 * @returns A Promise that resolves once tournaments are fetched and state is updated.
 */
export async function getMeAsTopplayers(
  actor: any,
  userId: string,
  setTopPlayer: React.Dispatch<React.SetStateAction<MeAsTopPlayers | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (actor) {
    setLoading(true);
    var res = await actor.getUserRank(userId);
    if (res) {
      let mapPlayers = res.map((item: any) => {
        let player = item;

        return {
          name: player?.name,
          userId,
          image: player?.image,
          participated: Number(player?.assets?.participated),
          contestWon: Number(player?.assets?.contestWon),
       
          rank: Number(player?.rank),
        };
      });
      setTopPlayer(mapPlayers[0]);
    } else {
      setTopPlayer(null);
    }
    setLoading(false);
  }
}
/**
 * Calls the backend function getAssetsOfUser() and sets the state with the object value.
 *
 * @param actor - The object used to interact with the backend.
 * @param setState - The state setter function.
 */

export async function getUserAssets(
  actor: any,
  userId: string,
  setState: React.Dispatch<React.SetStateAction<any>>,
) {
  let newUser = await actor.getAssetsOfUser(userId);
  if (newUser) {
    let tempAssets = {
      participated: Number(newUser.participated) ?? 0,
      contestWon: Number(newUser.contestWon) ?? 0,

    };
    setState(tempAssets);
  }
}
/**
 * Fetches getTopplayers use to get top fantasy players
 * @param actor - The actor object used to fetch  top fantasy players.
 * @param props - The properties required for fetching  top fantasy players.
 * @param setTopPlayers - State setter function for  top fantasy players.
 * @returns A Promise that resolves once tournaments are fetched and state is updated.
 */
export async function getTopplayers(
  actor: any,
  props: GetProps,
  setTopPlayers: React.Dispatch<React.SetStateAction<TopPlayers[] | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTotallCount: React.Dispatch<React.SetStateAction<number>>,
) {
  try {
    
 
  if (actor) {
    setLoading(true);
    var res = await actor.getTopPlayers(props);
    logger(res,"players")
    if (res) {
      let tempPlayers = res?.players;
      let total = Number(res?.total ?? 0);
      setTotallCount(total);
      let mapPlayers = tempPlayers.map((item: any) => {
        let userId = item[0];
        let player = item[1];

        return {
          name: player?.name,
          userId,
          image: player?.image,
          participated: Number(player?.assets?.participated),
          contestWon: Number(player?.assets?.contestWon),
          rewardsWon: Number(player?.assets?.rewardsWon),
          totalEarning: Number(player?.assets?.totalEarning),
        };
      });

      setTopPlayers(mapPlayers);
    } else {
      setTopPlayers(null);
    }
    setLoading(false);
  }
} catch (error) {
    logger(error,"error while getting players")
    
}
};

export async function getDashboardMatches(
  actor: any,
  setMatches: React.Dispatch<
    React.SetStateAction<DetailedMatchContest[] | null>
  >,
  props: GetProps,
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>,
  setMatchesCount: React.Dispatch<React.SetStateAction<number>> | null,
) {
  try {
    

  setLoadingState(true);
  const resp = await actor.getDetailedMatchesContests(props);
  logger(resp,"gasdjfkasdfasdfasdfadf")
  const matches = resp?.matches;
  let totalMatches = Number(resp?.total) ?? 0;
  const matchesWithTeams = await Promise.all(
    matches?.map(async (match: any) => {
      const homeTeam = await getTeam(match?.homeTeam, actor);
      const awayTeam = await getTeam(match?.awayTeam, actor);
      if (!homeTeam || !awayTeam) {
        return null;
      }
      const newDate = utcToLocal(match.time, 'DD-MM-YYYY');
      const newTime = utcToLocal(match?.time, 'hh:mm A');
      let status = getMatchStatus({ time: match?.time, status: match?.status });
      let totalTeamsPerUser = 0;
      match?.contests.map((cont: any) => {
        totalTeamsPerUser += Number(cont.teamsPerUser);
      });

      return {
        ...match,
        id: match.id,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        location: match?.location,
        teamsCreated: Number(match.teamsCreated),
        teamsJoined: Number(match.teamsJoined),
        status: status,
        date: newDate,
        time: newTime,
        matchTime: Number(match?.time),
        teamsPerUser: totalTeamsPerUser,
        homeScore: Number(match?.homeScore),
        awayScore: Number(match?.awayScore),
       
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
  if (setMatchesCount) setMatchesCount(totalMatches);
  setMatches(filteredMatches);
  setLoadingState(false);
} catch (error) {
  setMatches(null);
  setLoadingState(false);
}
};
interface TeamStatusProps {
  id: string;
  hasParticipated?: boolean;
  Matchstatus: any;
  teamsPerUser: number;
  time: number;
  isParticipating: boolean;
  selectedSquad: string;
  maximumParticipated: boolean;
  participants: number;
}

export function getTeamStatus({
  id,
  hasParticipated,
  Matchstatus,
  teamsPerUser,
  time,
  isParticipating,
  selectedSquad,
  maximumParticipated,
  participants,
}: TeamStatusProps) {
  const loading = isParticipating && id == selectedSquad;
  let status = 'Not joined';
  const kickedOff = isInPast(time);
  let maximum = false;
  let show = false;
  const finished = Matchstatus == MatchStatusNames.finished;
  let buttonText = JoinContestText.upcoming;
  if (kickedOff) buttonText = JoinContestText.ongoing;
  if (finished) buttonText = JoinContestText.finished;
  if (hasParticipated) {
    buttonText = JoinContestText.participated;
    status = JoinContestText.participated;
  }
  if (maximumParticipated && !hasParticipated) {
    maximum = true;
    // getPackage();
    buttonText = `${participants} / ${teamsPerUser} Joined`;
    // status = `${participants} / ${match?.teamsPerUser} Max Joined`;
  }
  const disabled = isParticipating || kickedOff || hasParticipated || maximum;
  return { loading, disabled, status, buttonText };
}
/**
 * Retrieves the key from the MatchStatuses enum based on the given status.
 *
 * @param  status - The status to search for in the MatchStatuses enum.
 * @return  The key corresponding to the given status, or undefined if not found.
 */
export function getKeyFromMatchStatus(status: MatchStatuses): string {
  switch (status) {
    case MatchStatuses.upcoming:
      return 'upcoming';
    case MatchStatuses.ongoing:
      return 'ongoing';
    case MatchStatuses.finished:
      return 'finished';
    case MatchStatuses.postponed:
      return 'postponed';
    default:
      return 'upcoming';
      break;
  }
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
  logger(data,"datadatadata")

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
 * Retrieves teams for a specific tournament.
 *
 * @param actor - The object used to interact with the backend.
 * @param tournamentId - The ID of the tournament to retrieve teams for.
 * @param setTeams - A function to set the state of teams.
 */
export async function getTeamsByTournament(
  actor: any,
  tournamentId: string,
  setTeams: React.Dispatch<React.SetStateAction<Team[] | null>>,
) {
  if (actor) {
    const res = await actor.getTeamsByTournament(tournamentId);
    if (res?.ok) {
      let teams = res?.ok?.[0]?.map((team: any) => convertMotokoObject(team));
      setTeams(teams);
    }
  }
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
/**
 * 
 * @returns offset in miliseconds
 */
export function getTimeZone() {
  const date = new Date();
const timezoneOffset = date.getTimezoneOffset()*60*1_000; 
if(timezoneOffset != 0) return timezoneOffset*-1
else return timezoneOffset

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
  const resp = await actor.getMatchesWithTournamentId(props, time,getTimeZone(), id);
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

/**
 * Handles different types of transfer errors and returns a corresponding message based on the error type.
 *
 * @param error - The transfer error object containing specific error types.
 * @return The corresponding message based on the error type.
 */
export function handleTeamJoingingError(error: TeamCreationErrorType) {
  switch (true) {
    case 'GenericError' in error:
      return error.GenericError.message;
  default:
      return 'Unknown error';
  }
}
