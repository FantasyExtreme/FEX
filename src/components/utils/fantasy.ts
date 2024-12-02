import logger from '@/lib/logger';
import { Auth, UserAuth } from '@/types/store';
import { convertMotokoObject, convertSquadPlayer } from './convertMotokoObject';
import { toast } from 'react-toastify';
import { Actor, ActorSubclass, Identity } from '@dfinity/agent';
import { utcToLocal } from './utcToLocal';
import { fromNullable, toNullable } from '@dfinity/utils';
import {
  Contest,
  ContestType,
  DetailedMatchContest,
  Formation,
  GetProps,
  GroupedContest,
  GroupedContests,
  GroupedPlayers,
  GroupedSquad,
  LoadingState,
  Match,
  MatchesCountType,
  MatchesType,
  MeAsTopPlayers,
  Player,
  PlayerSquad,
  RawPlayer,
  RewardDistribution,
  RfRefinedPlayerSquad,
  RfRewardDistribution,
  Team,
  TeamsType,
  TopPlayers,
  Tournament,
  TournamentType,
  WinnersAndMvps,
} from '@/types/fantasy';
import {
  RContestTypes,
  RefinedPlayerSquad,
  TransferFromError,
} from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';
import {
  DEFAULT_MATCH_STATUS,
  EnvironmentEnum,
  JoinContestText,
  MatchStatusNames,
  MatchStatuses,
  Packages,
  PlayerStatusText,
  PlayerStatuses,
} from '@/constant/variables';
import moment from 'moment';
import {
  groupContestsByMatch,
  groupMatchesByTournamentId,
  groupSquadsByMatchId,
} from '@/lib/helper';
import ConnectModal from '../Components/ConnectModal';
import { FORMATIONS_AND_SUBSTITUTION, GAS_FEE } from '@/constant/fantasticonst';
import { approveTokens, fromE8S, toE8S } from '@/lib/ledger';
import React from 'react';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { PackageIcons } from '@/constant/icons';
import axios from 'axios';
import { API_ROUTE_GET_USD_RATE } from '@/constant/routes';
// import { PlayerSquad, RefinedPlayerSquad } from "@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did";
// import { RfRefinedPlayerSquad } from "@/types/fantasy";

type Grouped<T> = {
  [key: string]: T[];
};

declare global {
  interface Array<T> {
    groupBy<K extends keyof any>(keyFunction: (item: T) => K): Grouped<T>;
  }
}

if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function <T, K extends keyof any>(
    this: T[],
    keyFunction: (item: T) => K,
  ): Grouped<T> {
    return this.reduce((result, item) => {
      const key = keyFunction(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {} as Grouped<T>);
  };
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
/**
 *
 * @returns offset in miliseconds
 */
export function getTimeZone() {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1_000;
  if (timezoneOffset != 0) return timezoneOffset * -1;
  else return timezoneOffset;
}
interface TeamId {
  id: string;
  name: string;
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
  logger(ids, 'got aids');
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
export function isConnected(state: string): boolean {
  return state == 'initialized';
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

export async function getTeam(teamId: string, actor: any) {
  const team = fromNullable(await actor.getTeamById(teamId));
  if (team) return { id: teamId, ...team };
  else return null;
}
/**
 * Get the contest winner of finished match
 * @param actor auth.actor from the global state
 * @param matchId id of matched to get contest winner
 * @returns  user who win the contest
 *
 */
export async function getContestWinnerOfMatch(matchId: string, actor: any) {
  const winner = fromNullable(await actor.getContestWinnerOfMatch(matchId));
  if (winner && Array.isArray(winner)) {
    let id = winner[0];
    let user = winner[1];

    return { userId: id, ...user };
  } else return null;
}
/**
 * Get the contest MVPS PLAYER of finished match
 * @param actor auth.actor from the global state
 * @param matchId id of matched to get MVPS PLAYER
 * @returns  MVPS PLAYER
 *
 */
export async function getMVPSOfmatchfn(matchId: string, actor: any) {
  const winner = fromNullable(await actor.getMVPSOfmatch(matchId));
  if (winner && Array.isArray(winner)) {
    let id = winner[0];
    let user = winner[1];

    return { userId: id, ...user };
  } else return null;
}
/**
 * Get the upcoming matches from the canister
 * @param actor auth.actor from the global state
 * @param setUpcomingMatches the setState method that will be used to store matches
 * @param {GetProps} props -  pagination props
 *
 */
export async function getUpcomingMatches(
  actor: any,
  setUpcomingMatches: React.Dispatch<React.SetStateAction<any>>,
  props: GetProps,
  time: number[] | [],
) {
  const resp = await actor.getMatches(props, time, getTimeZone());
  const matches = resp?.matches;
  const matchesWithTeams = await Promise.all(
    matches?.map(async (match: any) => {
      const homeTeam = await getTeam(match?.homeTeam, actor);
      const awayTeam = await getTeam(match?.awayTeam, actor);
      if (!homeTeam || !awayTeam) return null;

      const newDate = utcToLocal(match.time, 'DD-MM-YYYY');
      // moment
      //   .unix(Number(match?.time))
      //   .format('mm-dd-yyyy');
      const newTime = utcToLocal(match?.time, 'hh:mm A');
      //  moment.unix(Number(match?.time)).format('hh:mm A');
      return {
        matchId: match.id,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        location: match?.location,
        date: newDate,
        time: newTime,
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
  setUpcomingMatches(filteredMatches);
}

/**
 * Store upcoming,ongoing and completed matches in a state
 * @param actor auth.actor from the global state
 * @param setMatches the setState method that will be used to store matches with different states
 * @param {GetProps} props -  pagination props
 *
 */
// export async function getFilterPlayerSquadsByMatch({
//   matchId,
//   actor,
//   props,
//   setLoadingState,
//   setPlayerSquads,
//   setGroupedSquads,
// }: GetTeamsProps) {
//   try {
//     let id = toNullable(matchId);
//     console.log("ihoihoihoihoh")
//     // Set loading state based on props.status
//     switch (props.status) {
//       case MatchStatuses.upcoming:
//         setLoadingState((prev) => ({ ...prev, upcoming: true }));
//         break;
//       case MatchStatuses.ongoing:
//         setLoadingState((prev) => ({ ...prev, ongoing: true }));
//         break;
//       case MatchStatuses.finished:
//         setLoadingState((prev) => ({ ...prev, finished: true }));
//         break;
//     }

//     // Fetch filtered player squads from backend
//     const resp = await actor.getRawPlayerSquadsByMatch(id);
//     console.log(resp, "oihouihouihoiuhoihouhouh")
//     const playerSquads = resp?.map((data: any) => {
//       const squad = convertMotokoObject(data);
//       return {
//         ...squad,
//         creation_time: Number(squad?.creation_time),
//         points: Number(squad?.points),
//       };
//     });

//     // Handle setting player squads or grouped squads based on availability of setters
//     if (setPlayerSquads) {
//       setPlayerSquads(playerSquads);
//     } else if (setGroupedSquads) {
//       const groupedSquads = groupSquadsByMatchId(playerSquads); // Implement groupSquadsByMatchId if needed
//       setGroupedSquads(groupedSquads);
//     }

//     logger(playerSquads, 'Received player squads'); // Logging or further processing as needed
//   } catch (error) {
//     logger(error, 'Error fetching player squads'); // Logging error for debugging purposes
//   }
// }

/**
 * check it match on friday
 * @param bigintMilliseconds
 * @returns
 */
function isFriday(bigintMilliseconds: BigInt) {
  // Convert BigInt to Number for the Date constructor
  const date = new Date(Number(bigintMilliseconds));
  return date.getDay() === 5; // 5 represents Friday
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

  const resp = await actor.getMatchesWithTournamentId(
    props,
    time,
    getTimeZone(),
    id,
  );

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
        groupId: match.tournamentId + newDate + newTime,
        isRewardable: match.isRewardable,
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
      contest[1].entryFee = fromE8S(contest[1].entryFee);
      contest[1].slots = Number(contest[1].slots);
      contest[1].slotsUsed = Number(contest[1].slotsUsed);
      contest[1].teamsPerUser = Number(contest[1].teamsPerUser);

      let percentage = userAuth?.rewardPercentage / 100;
      let prizePool =
        percentage * (contest[1]?.entryFee * contest[1]?.slotsUsed);
      let slotsLeft = contest[1]?.slots - contest[1]?.slotsUsed;
      let firstPrize = 0;
      let newRD: RfRewardDistribution[] = contest[1].rewardDistribution?.map(
        (rd: RewardDistribution): RfRewardDistribution => {
          let _rd = {
            to: Number(rd.to),
            from: Number(rd.from),
            amount: Number(rd.amount),
          };
          let rangeSize = _rd.to - _rd.from + 1;
          if (_rd.from == 1) {
            let firstPrizePercentage = _rd.amount / 100; // percentage get ka
            // firstPrize = (prizePool * firstPrizePercentage) / rangeSize;
          }
          let percentage = _rd.amount / 100;
          let prize = (prizePool * percentage) / rangeSize;
          return {
            from: _rd.from,
            to: _rd.to,
            amount: prize,
            percentage: _rd.amount,
          };
        },
      );
      let rewardableUsers = newRD[newRD.length - 1]?.to;
      let rewardableUserPercentage = (
        (rewardableUsers / contest[1].slots) *
        100
      ).toFixed(1);
      // let distributees =

      return {
        ...contest[1],
        id: contest[0],
        rewardDistribution: newRD,
        prizePool: prizePool.toFixed(4),
        slotsLeft,
        firstPrize: fromE8S(contest[1].firstPrize),
        rewardableUserPercentage,
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
        contest[1].entryFee = fromE8S(contest[1].entryFee);
        contest[1].slots = Number(contest[1].slots);
        contest[1].slotsUsed = Number(contest[1].slotsUsed);
        contest[1].teamsPerUser = Number(contest[1].teamsPerUser);
        let percentage = userAuth?.rewardPercentage / 100;
        let prizePool =
          percentage * (contest[1]?.entryFee * contest[1]?.slotsUsed);
        let slotsLeft = contest[1]?.slots - contest[1]?.slotsUsed;
        let firstPrize = 0;
        let newRD: RfRewardDistribution[] = contest[1].rewardDistribution?.map(
          (rd: RewardDistribution): RfRewardDistribution => {
            let _rd = {
              to: Number(rd.to),
              from: Number(rd.from),
              amount: Number(rd.amount),
            };
            let rangeSize = _rd.to - _rd.from + 1;
            if (_rd.from == 1) {
              // let firstPrizePercentage = _rd.amount / 100; // percentage get ka
              // firstPrize = (prizePool * firstPrizePercentage) / rangeSize;
            }
            let percentage = _rd.amount / 100;
            let prize = (prizePool * percentage) / rangeSize;
            return {
              from: _rd.from,
              to: _rd.to,
              amount: prize,
              percentage: _rd.amount,
            };
          },
        );
        let rewardableUsers = newRD[newRD.length - 1]?.to;
        let rewardableUserPercentage = (
          (rewardableUsers / contest[1].slots) *
          100
        ).toFixed(1);
        // let distributees =
        logger(contest, 'tranchullll');
        return {
          ...contest[1],
          id: contest[0],
          rewardDistribution: newRD,
          prizePool: prizePool.toFixed(2),
          slotsLeft,
          firstPrize: fromE8S(contest[1].firstPrize),
          rewardableUserPercentage,
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

export async function getContest(
  actor: any,
  id: string,
  set?: React.Dispatch<React.SetStateAction<any>>,
) {
  const _contest: any = fromNullable(await actor.getContest(id));
  const newRD = _contest?.rewardDistribution?.map(
    (rd: RewardDistribution): RfRewardDistribution => {
      return {
        to: Number(rd.to),
        from: Number(rd.from),
        amount: Number(rd.amount),
        percentage: Number(rd.amount),
      };
    },
  );
  const contest = {
    ..._contest,
    slots: Number(_contest?.slots),
    slotsUsed: Number(_contest?.slotsUsed),
    minCap: Number(_contest?.minCap),
    teamsPerUser: Number(_contest?.teamsPerUser),
    entryFee: Number(_contest?.entryFee),
    rewardDistribution: newRD,
  };
  logger({ _contest, contest }, 'looogogogogo');
  if (set) set(contest);
  return contest;
}
/**
 * Get get contest and match with contest id

 * @param  {setSimpleLoading} loading state
 * @param  {setContests} set set contest to state
 * @param  {setMatch} set set setMatch to state
 * @returns {id}  id of contest
 */
export async function getContestWithMatch(
  actor: any,
  id: string,
  setSimpleLoading: React.Dispatch<React.SetStateAction<any>>,
  setContests: React.Dispatch<React.SetStateAction<any>>,
  setMatch: React.Dispatch<React.SetStateAction<any>>,
) {
  try {
    setSimpleLoading(true);

    const { contest: _contest, match }: any = fromNullable(
      await actor.getContestWithMatch(id),
    );
    const newRD = _contest?.rewardDistribution?.map(
      (rd: RewardDistribution): RfRewardDistribution => {
        return {
          to: Number(rd.to),
          from: Number(rd.from),
          amount: Number(rd.amount),
          percentage: Number(rd.amount),
        };
      },
    );
    const contest = {
      ..._contest,
      slots: Number(_contest?.slots),
      slotsUsed: Number(_contest?.slotsUsed),
      minCap: Number(_contest?.minCap),
      teamsPerUser: Number(_contest?.teamsPerUser),
      entryFee: fromE8S(_contest?.entryFee),
      rewardDistribution: newRD,
    };
    if (match) {
      let matchEntry = match[0];
      matchEntry.homeTeam[1] = fromNullable(matchEntry.homeTeam[1]);
      matchEntry.awayTeam[1] = fromNullable(matchEntry.awayTeam[1]);
      const homeTeam = convertMotokoObject(matchEntry.homeTeam);
      const awayTeam = convertMotokoObject(matchEntry.awayTeam);
      let newMatch = {
        ...matchEntry,
        homeTeam,
        awayTeam,
        status: getMatchStatus({
          time: matchEntry?.time,
          status: matchEntry?.status,
        }),
        time: Number(matchEntry.time),
      };

      setMatch(newMatch);
    }
    setContests([contest]);
    setSimpleLoading(false);
  } catch (error) {
    setSimpleLoading(false);
  }
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
export function refineSquad(squad: any): RfRefinedPlayerSquad | null {
  if (!squad) return null;
  return {
    ...squad,
    points: Number(squad.points),
    creation_time: Number(squad.creation_time),
    rank: Number(squad?.rank),
  };
}
export function refinePlayer(player: RawPlayer): Player {
  let newPlayer = convertSquadPlayer(player);
  newPlayer.positionString = Object.keys(newPlayer.position)[0];
  newPlayer.points = Number(newPlayer.points);
  return newPlayer;
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

interface GetTeamsProps {
  contestId?: string;
  matchId?: string;
  setTeams: React.Dispatch<React.SetStateAction<TeamsType>> | null;
  actor: any;
  props: GetProps;
  setTeamsCounts: React.Dispatch<React.SetStateAction<MatchesCountType>> | null;
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState>>;
  setPlayerSquads?: React.Dispatch<
    React.SetStateAction<PlayerSquad[] | null>
  > | null;
  setGroupedSquads?: React.Dispatch<
    React.SetStateAction<GroupedSquad[] | null>
  >;
}
/**
 * Get player squads by matchId and store them inside a state
 * @param {GetTeamsProps} param matchId to get the playersquads from, actor to call the method from and set state to store the data inside of
 */
export async function getPlayerSquadsByMatch({
  matchId,
  contestId,
  actor,
  setPlayerSquads,
  setGroupedSquads,
}: GetTeamsProps) {
  try {
    let id = toNullable(matchId);
    let tempcontestId = toNullable(contestId);

    const resp = await actor.getRawPlayerSquadsByMatch(id, tempcontestId);
    const playerSquads = resp?.map((data: any) => {
      const team = convertMotokoObject(data);
      return {
        ...team,
        creation_time: Number(team?.creation_time),
        points: Number(team?.points),
      };
    });

    if (setPlayerSquads) setPlayerSquads(playerSquads);
    else if (setGroupedSquads) {
      const groupedSquads = groupSquadsByMatchId(playerSquads);
      setGroupedSquads(groupedSquads);
    }
    logger(playerSquads, 'we got these');
  } catch (error) {
    logger(error, 'error getting playerSquads');
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
 * use this func to make the text copy able.
 * @param {auth}  - pricipale is require to copy it.
 */
export async function copyId(id: any, msg: string) {
  window.navigator.clipboard.writeText(id);
  toast.success(`${msg} copied to clipboard`, { autoClose: 750 });
}
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
 * Copy User refferal link
 *  - auth
 */
export async function copyRefferalLink(identity: Identity) {
  if (!identity) return;
  window.navigator.clipboard.writeText(
    window.location.host + '?refferalId=' + identity.getPrincipal().toString(),
  );
  toast.success('Refferal link copied to clipboard', { autoClose: 750 });
}
/**
 * Copy User refferal link
 *  - auth
 */
export async function copyCommunityLink(id: string) {
  if (!id) return;
  window.navigator.clipboard.writeText(
    window.location.host + '?communityId=' + id,
  );
  toast.success('Community Link  copied to clipboard', { autoClose: 750 });
}
/**
 * Retrieves filtered player squads based on match and status criteria.
 * @param {GetTeamsProps} options - Options object containing matchId, actor, and various setters.
 */
export async function getFilter({
  contestId,
  matchId,
  actor,
  setTeams,
  props,
  setTeamsCounts,
  setLoadingState,
  setPlayerSquads,
}: GetTeamsProps) {
  try {
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
    let id = toNullable(matchId);
    let tempcontestId = toNullable(contestId);

    const resp = await actor.getFilterdRawPlayerSquadsByMatch(
      id,
      tempcontestId,
      props,
    );

    let totalMatches = Number(resp?.total) ?? 0;
    var playerSquads = resp?.teams?.map((data: any) => {
      const team = convertMotokoObject(data);
      return {
        ...team,
        creation_time: Number(team?.creation_time),
        points: Number(team?.points),
        rank: Number(team?.rank),
      };
    });
    if (setPlayerSquads) setPlayerSquads(playerSquads);
    else if (setTeams) {
      var groupedSquads = groupSquadsByMatchId(playerSquads);

      switch (props.status) {
        case MatchStatuses.upcoming:
          setLoadingState((prev) => ({ ...prev, upcoming: false }));
          logger(resp, 'upcoming count');
          if (setTeamsCounts)
            setTeamsCounts((prev) => ({ ...prev, upcoming: totalMatches }));

          setTeams((prev) => ({ ...prev, upcoming: groupedSquads }));
          break;
        case MatchStatuses.ongoing:
          setLoadingState((prev) => ({ ...prev, ongoing: false }));
          if (setTeamsCounts)
            setTeamsCounts((prev) => ({ ...prev, ongoing: totalMatches }));

          setTeams((prev) => ({ ...prev, ongoing: groupedSquads }));
          break;
        case MatchStatuses.finished:
          setLoadingState((prev) => ({ ...prev, finished: false }));
          if (setTeamsCounts)
            setTeamsCounts((prev) => ({ ...prev, finished: totalMatches }));

          setTeams((prev) => ({ ...prev, finished: groupedSquads }));
          break;
      }
    }
  } catch (error) {}
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

interface AdminAddContestProps {
  actor: any;
  userAuth: UserAuth;
}
/**
 * An admin function to add a contest
 * @param param actor and userAuth from global store
 */
async function adminAddContest({ actor, userAuth }: AdminAddContestProps) {}

interface FetchSquadProps {
  actor: any;
  squadId: string;
  setSelectedPlayers: React.Dispatch<
    React.SetStateAction<GroupedPlayers | null>
  >;
  setTeamFormation: React.Dispatch<React.SetStateAction<Formation>>;
  setSubstitution: React.Dispatch<React.SetStateAction<Formation>>;
  setMatch: React.Dispatch<React.SetStateAction<Match | null>>;
  setSelectedSquad: React.Dispatch<React.SetStateAction<PlayerSquad | null>>;
  setSelectedSubstitudePlayers: React.Dispatch<
    React.SetStateAction<GroupedPlayers | null>
  >;
  contestId?: string | null;
}

/**
 * Function to get squad using its id
 * @param param actor , squadId and setstate function
 */

export async function fetchSquad({
  actor,
  squadId,
  setSelectedPlayers,
  setSubstitution,
  setTeamFormation,
  setSelectedSquad,
  setMatch,
  setSelectedSubstitudePlayers,
  contestId,
}: FetchSquadProps) {
  const _squad: any = fromNullable(await actor.getPlayerSquad(squadId));
  let rankArr = _squad?.ranks?.find((rank: any) => {
    return rank[0] == contestId;
  });
  let rank = 0;
  if (rankArr) {
    rank = Number(rankArr[1]);
  }

  // resetPlayers();
  if (_squad) {
    let { 0: d, 1: m, 2: f } = _squad?.formation?.split('-');
    FORMATIONS_AND_SUBSTITUTION.map((formNSub) => {
      if (
        formNSub.formation.defender == d &&
        formNSub.formation.midfielder == m &&
        formNSub.formation.forward == f
      ) {
        setTeamFormation(formNSub.formation);
        setSubstitution(formNSub.substitution);
      }
    });
    const match: any = fromNullable(await actor.getMatch(_squad.matchId));
    let newMatch = null;
    if (match) {
      match.homeTeam[1] = fromNullable(match.homeTeam[1]);
      match.awayTeam[1] = fromNullable(match.awayTeam[1]);
      const homeTeam = convertMotokoObject(match.homeTeam);
      const awayTeam = convertMotokoObject(match.awayTeam);
      newMatch = {
        ...match,
        homeTeam,
        awayTeam,
        time: Number(match.time),
      };

      setMatch(newMatch);
    }
    const ids = [
      { id: newMatch?.homeTeam.id, name: newMatch?.homeTeam.name },
      { id: newMatch?.awayTeam.id, name: newMatch?.awayTeam.name },
    ];
    const players = _squad?.players
      ?.map((player: any) => {
        let newPlayer = convertSquadPlayer(player);
        newPlayer.positionString = Object.keys(newPlayer.position)[0];
        // togglePlayerSelection(newPlayer, true);
        return {
          ...newPlayer,
          creation_time: Number(newPlayer.creation_time),
          fantasyPrice: Number(newPlayer.fantasyPrice),
          points: fromNullable(newPlayer.points) ? Number(newPlayer.points) : 0,
          teamName: getTeamName(ids, newPlayer.teamId),
          number: Number(newPlayer.number),
          isSubsituteSelected: player[2],
        };
      })
      ?.sort((a: any, b: any) =>
        a.number === 0 && b.number !== 0
          ? 1
          : b.number === 0 && a.number !== 0
            ? -1
            : a.number - b.number,
      );
    let filterSubstitude = players.filter(
      (item: any) => item.isSubsituteSelected,
    );
    let filterNoneSubstitude = players.filter(
      (item: any) => !item.isSubsituteSelected,
    );

    const groupedPlayers = groupPlayersByRole(filterNoneSubstitude);
    const groupedSubstitudePlayers = groupPlayersByRole(filterSubstitude);

    setSelectedSquad({
      ..._squad,
      players: null,
      points: Number(_squad.points),
      rank: Number(rank),
    });
    let allNoneSubstites = Object.values(groupedPlayers)?.flat() ?? [];
    let allSubstites = Object.values(groupedSubstitudePlayers)?.flat() ?? [];
    setSelectedSubstitudePlayers({
      ...groupedSubstitudePlayers,
      all: allSubstites,
    });
    setSelectedPlayers({ ...groupedPlayers, all: allNoneSubstites });
  }
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
 * Retrieves all participants using the provided actor.
 * @param {any} actor The actor object used to retrieve participants.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating success.
 */
export async function getAllParticipants(actor: any): Promise<boolean> {
  /**
   * @typedef {Object} Participant
   * @property {any} 0 The first property of the participant.
   */

  try {
    const resp = await actor.getAllParticipants(); // Retrieve all participants
    logger(resp, 'getting participants'); // Log the response

    // Process each participant asynchronously
    resp?.map(async (par: any) => {
      var participants = await par[0]; // Assuming par is an array and you want the first element
      // Additional processing can be done here
    });

    return resp?.ok; // Return the 'ok' property of resp if it exists
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error; // Throw the error to be handled by the caller
  }
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
 * Generate a random user Name.
 *
 * @returns A four-digit string starting with 'User'.
 * @throws No exceptions are thrown in this function.
 */
export function generateRandomName(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `User${randomNumber.toString().padStart(4, '0')}`;
}
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
  if (actor) {
    setLoading(true);
    var res = await actor.getTopPlayers(props);
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
          rewardsWon: Number(player?.assets?.rewardsWon),
          totalEarning: Number(player?.assets?.totalEarning),
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
 * Fetches getUserTransactions use to get Transactions of user
 * @param actor - The actor object used to fetch  top fantasy players.
 * @param page - The page number of page
 * @param fantasyTransactionActor - The fantasyTransactionActor object used to fetch Transactions of user
 * @param limit - The limit  of the page
 * @param contestId - The contestId  get transactions on base of contest
 * @returns A Promise that resolves once tournaments are fetched and state is updated.
 */
export async function getUserTransactions({
  actor,
  fantasyTransactionActor,
  page,
  limit,
  contestId,
}: {
  actor: any;
  fantasyTransactionActor: any;
  page: number;
  limit: number;
  contestId: string[];
}) {
  let props = {
    page,
    contestId,
    limit,
  };
  try {
    const resp = await fantasyTransactionActor.getMyTransactions(props);
    if (resp) {
      let tempTransactions = resp?.transaction;
      let total = Number(resp?.total ?? 0);
      let contestids: any = [];
      const newArra = await Promise.all(
        tempTransactions.map(async (tempTrans: any) => {
          let trans = tempTrans[1];
          let id = tempTrans[0];

          let amount = Number(trans?.amount);
          let tmepDate = BigInt(Number(trans?.created_at_time ?? 0));

          let date = utcToLocal(tmepDate, 'DD-MM-YYYY');
          let time = utcToLocal(tmepDate, 'hh:mm A');
          let transaction_type = Object.keys(trans?.transaction_type)[0] ?? '';
          contestids.push(trans?.contestId);
          return {
            amount,
            id,
            date,
            time,
            transaction_type,
            contestId: trans?.contestId,
            title: trans?.title,
          };
        }),
      );
      let contestNamesList = await actor.getContestNames(contestids);
      let contestMap = await actor.getContestsByIds(contestids);
      logger(contestMap, 'contest map');
      if (contestMap) {
        contestMap = new Map(contestMap.map((c: Contest) => [c?.id, c]));
      }
      logger(contestMap, 'contest map v2');

      if (contestNamesList) {
        type KeyValuePair = [string, string];

        contestNamesList = contestNamesList.reduce(
          (acc: Record<string, string>, [key, value]: KeyValuePair) => {
            acc[key] = value;
            return acc;
          },
          {},
        );
      }
      let transactions = newArra.map((trans: any) => {
        return {
          ...trans,
          contestName: contestMap.get(trans?.contestId)?.name,
          paymentMethod: contestMap.get(trans?.contestId)?.paymentMethod,
        };
      });
      logger(transactions, 'transactions map v2');

      return {
        total,
        transactions: transactions,
      };
    } else {
      return {
        total: 0,
        transactions: [],
      };
    }
  } catch (error) {
    logger(error, 'error during transactions ');
  }
}
/**
 * use to get joined teams in contest
 * @param actor - The actor object used to fetch  top fantasy players.
 * @param {GetProps} props -  pagination props
 */
export async function getJoinedTeamsOfUser({
  actor,
  props,
}: {
  actor: any;
  props: GetProps;
}) {
  try {
    const resp = await actor.getJoinedTeams(props);

    if (resp) {
      let results = resp?.result;
      let total = Number(resp?.total ?? 0);
      let tempResult = results.map((item: any) => ({
        ...item,
        rank: Number(item.rank),
        homeScore: Number(item.homeScore),
        awayScore: Number(item.awayScore),
      }));
      return {
        total,
        results: tempResult,
      };
    } else {
      return {
        total: 0,
        results: [],
      };
    }
  } catch (error) {
    return {
      total: 0,
      results: [],
    };
  }
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
export async function getMatchWinnerAndMVPS(
  actor: any,
  setWinnerAndMvps: React.Dispatch<
    React.SetStateAction<null | WinnersAndMvps[]>
  >,
  props: GetProps,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  time: number[] | [],
  tournamentId: string | null,
) {
  setIsLoading(true);

  const resp = await actor.getMVPSMatches(props);

  const matches = resp?.matches;
  let totalMatches = Number(resp?.total) ?? 0;
  const matchesWithTeams = await Promise.all(
    matches?.map(async (match: any) => {
      const newDate = utcToLocal(match.time, 'MMM  D, YY');
      const newTime = utcToLocal(match?.time, 'hh:mm A');
      return {
        contestWinner: { ...match.contestWinner[0][1] },
        mvps: { ...match.mvps[0][1] },
        match: {
          id: match.matchId,
          homeTeam: { ...match.homeTeam[1][0] },
          awayTeam: { ...match.awayTeam[1][0] },
          location: match?.location,
          date: newDate,
          time: newTime,
          tournamentId: match.tournamentId,
          tournamentName: match.tournamentName,
          homeScore: Number(match?.homeScore),
          awayScore: Number(match?.awayScore),
        },
      };
    }),
  );

  if (matchesWithTeams) {
    setWinnerAndMvps((prev) => matchesWithTeams);
  }
  setIsLoading(false);
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
      rewardsWon: Number(newUser.rewardsWon) ?? 0,
      totalEarning: Number(newUser.totalEarnin) ?? 0,
    };
    setState(tempAssets);
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
  return `${text?.slice(0, maxlength)}...${text?.slice(text.length - maxlength, text.length)}`;
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
 * Handles different types of transfer errors and returns a corresponding message based on the error type.
 *
 * @param error - The transfer error object containing specific error types.
 * @return The corresponding message based on the error type.
 */
export function handleTransferError(error: TransferFromError) {
  switch (true) {
    case 'GenericError' in error:
      return error.GenericError.message;
      break;
    case 'TemporarilyUnavailable' in error:
      return 'Service is temporarily unavailable.';
      break;
    case 'InsufficientAllowance' in error:
      return `Allowance: ${Number(error.InsufficientAllowance.allowance)}`;
      break;
    case 'BadBurn' in error:
      return `Minimum burn amount: ${Number(error.BadBurn.min_burn_amount)}`;
      break;
    case 'Duplicate' in error:
      return `Duplicate of block index: ${error.Duplicate.duplicate_of}`;
      break;
    case 'BadFee' in error:
      return `Expected fee: ${Number(error.BadFee.expected_fee)}`;
      break;
    case 'CreatedInFuture' in error:
      return `Ledger time: ${error.CreatedInFuture.ledger_time}`;
      break;
    case 'TooOld' in error:
      return 'The transaction is too old.';
      break;
    case 'InsufficientFunds' in error:
      return `Insufficient funds. Balance: ${Number(error.InsufficientFunds.balance)}`;
      break;
    default:
      return 'Unknown error';
  }
}

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
        let status = getMatchStatus({
          time: match?.time,
          status: match?.status,
        });
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
          entryFee: fromE8S(match?.entryFee),
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
// export async function addParticipant({
//   setLoading,
//   identity,
//   actor,
//   entryFee,
//   teamsPerUser,
//   participants,
//   selectedSquad,
//   setSquads,
//   setMaximumParticipated,
//   setParticipants,
//   handleHideConfirm,
//   handleGetAssets,
//   setSelectedSquad,
// }: {
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   identity: Identity;
//   actor: any;
//   entryFee: number;
//   teamsPerUser: number;
//   participants: number;
//   selectedSquad: null | string;
//   setSquads: React.Dispatch<React.SetStateAction<PlayerSquad[]>>;
//   setMaximumParticipated: React.Dispatch<React.SetStateAction<boolean>>;
//   setParticipants: React.Dispatch<React.SetStateAction<number>>;
//   handleHideConfirm: () => void;
//   handleGetAssets?: () =>void;
//   setSelectedSquad?: React.Dispatch<React.SetStateAction<null| string>>
// }) {
//   setLoading(true);
//   try {
//     logger({ entry: entryFee, GAS_FEE, identity }, 'apprinving');
//     if (entryFee !== 0) {
//       let approve = await approveTokens(
//         toE8S(entryFee) + GAS_FEE,
//         identity,
//       );
//       if (!approve) {
//         return toast.error('Unexpected Error');
//       }
//     }

//     const added: { err?: TransferFromError; ok?: string } =
//       await actor.addParticipant(id, selectedSquad,getTimeZone());

//     if (added?.ok) {
//       toast.success('Joined Successfully');
//       if (participants && participants + 1 >= teamsPerUser)
//         setMaximumParticipated(true);
//       setParticipants((prev) => (prev ? prev++ : prev));
//       .teamsJoined++;

//       // let newSquads = playerSquads.filter(())
//       setSquads((prev: any) => {
//         return prev.map((squad: any) => {
//           if (squad.id == selectedSquad) {
//             return {
//               ...squad,
//               hasParticipated: true,
//             };
//           }
//           return squad;
//         });
//       });
//       handleHideConfirm();
//       if (handleGetAssets) {
//         handleGetAssets();
//       }
//     } else if (added?.err) {
//       toast.error(handleTransferError(added?.err));
//     }
//     logger(added);
//   } catch (error) {
//     toast.error('Unexpected Error');
//     logger(error);
//   }
//   setSelectedSquad(null);
//   setLoading(false);
// }

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
export function isDev() {
  return process.env.NEXT_PUBLIC_DFX_NETWORK == EnvironmentEnum.dev;
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

export function getPrizePool(
  number: number,
  percentage: number,
  participants: number,
): number {
  return parseFloat((((number * percentage) / 100) * participants).toFixed(4));
}
export async function getIcpRate() {
  try {
    // Make the API call
    logger('requet', 'ersadfasdfasdrorerror');

    const response = await axios.get(API_ROUTE_GET_USD_RATE);

    // Access the USD rate from the response data
    const rate = response.data['internet-computer']?.usd;

    // Log the rate
    return rate.toFixed(2);
  } catch (error) {
    // Log the error
    logger(error, 'errorerror');
    return 0;
  }
}

// debounce.ts
type DebounceFunction = (...args: any[]) => void;

export function debounce<T extends DebounceFunction>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}
export async function getRewardsTable({
  actor,
  set,
  props,
  setPageCount,
  setLoading,
  entryFee,
  slotsUsed,
}: {
  actor: any;
  set: React.Dispatch<React.SetStateAction<null | [bigint, bigint][]>>;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  entryFee: number;
  slotsUsed: number;
  props: GetProps;
}) {
  try {
    if (entryFee == null || slotsUsed == null) return;
    setLoading(true);
    const resp = await actor.getRewardsTable({
      entryFee: toE8S(entryFee),
      slotsUsed,
      props,
    });
    const { total, map } = resp;
    let pageCount = Number(total);
    setPageCount(pageCount);
    set(map);
  } catch (error) {
    logger(error, 'error rewards table ');
  }
  setLoading(false);
}
/**
 * Determines whether a reward package should be shown based on its name.
 *
 * @param {string} name - The name of the reward package.
 *
 * The function checks the name of the reward package and returns true if the package is either
 * Bronze or Gold, and false if the package is Free.
 */
export function shouldShowROI(name: string): boolean {
  switch (name.toLowerCase()) {
    case Packages.bronze:
      return true;
    case Packages.gold:
      return true;
    case Packages.free:
      return false;
    default:
      return false;
  }
}


export const joinDiscordChannel = async (code: string,userId:string): Promise<boolean> => {
  try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}joindiscord`;
      const res = await axios.post(url, { code,userId });
      logger(res, "asdasdasdasdasdas");

      if(res?.status==200){

        return true;
      }else{
        return false; 
      }
   
  } catch (error) {
      logger(error, "asdasdasdasdasdas");
      return false; 
  }
};

const generateAuthUrl = () => {
  const codeChallenge = 'your-code-challenge'; // Generate a code challenge
  const authUrl = `https://twitter.com/i/oauth2/authorize?` +
    `response_type=code&` +
    `client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URL ?? "")}&` +
    `scope=follows.write tweet.read users.read&` +
    `state=${process.env.NEXT_PUBLIC_STATE}&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=s256`;

  return authUrl;
};