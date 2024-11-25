'use client';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Table,
  Tabs,
  Tab,
  Button,
  Modal,
  Form,
  Spinner,
} from 'react-bootstrap';
import Innerheader from '@/components/Components/Innerheader';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import {
  Formation,
  GroupedPlayers,
  GroupedSquad,
  LoadingState,
  Match,
  MatchesCountType,
  MatchesType,
  PlayerSquad,
  SelectSquadProps,
  Team,
  TeamsType,
} from '@/types/fantasy';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import logger from '@/lib/logger';
import { convertMotokoObject } from '@/components/utils/convertMotokoObject';
import {
  fetchMatch,
  fetchSquad,
  getFilter,
  getPlayerSquadsByMatch,
  isConnected,
} from '@/components/utils/fantasy';
import PlayerSquadRow from '@/components/Components/PlayerSquadRow';
import { CONTESTS_ROUTE, MATCHES_ROUTE } from '@/constant/routes';
import {
  DEFAULT_MATCH_STATUS,
  MATCHES_ITEMSPERPAGE,
  MatchStatuses,
  QURIES,
  QueryParamType,
} from '@/constant/variables';
import PlayerGroupedRow from '@/components/Components/PlayerGroupedRow';
import MatchesPagination from '@/components/Components/MatchesPagination';

export default function Yourteams() {
  const urlparama = useSearchParamsHook();
  const [matchTab, setMatchTab] = useState<string>(DEFAULT_MATCH_STATUS);
  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get(QURIES.matchId);
  const squadId = searchParams.get(QURIES.squadId);
  const contestId = searchParams.get(QURIES.contestId);
  const type = searchParams.get('type');
  const [playerSquads, setPlayerSquads] = useState<PlayerSquad[] | null>(null);

  const [match, setMatch] = useState<Match | null>(null);
  const [matchnSquadId, setMatchnSquadId] = useState({ matchId, squadId });
  const [selectedSquad, setSelectedSquad] = useState<PlayerSquad | null>(null);
  const [groupedSquads, setGroupedSquads] = useState<GroupedSquad[] | null>(
    null,
  );

  const [selectedPlayers, setSelectedPlayers] = useState<GroupedPlayers | null>(
    null,
  );
  const [selectedSubstitudePlayers, setSelectedSubstitudePlayers] =
    useState<GroupedPlayers | null>(null);
  const [teamFormation, setTeamFormation] = useState<Formation>({
    goalKeeper: 1,
    defender: 3,
    midfielder: 4,
    forward: 3,
  });
  const [substitution, setSubstitution] = useState<Formation>({
    goalKeeper: 1,
    defender: 2,
    midfielder: 1,
    forward: 0,
  });
  const [offset, setOffset] = useState<MatchesCountType>({
    upcoming: 0,
    ongoing: 0,
    finished: 0,
  });

  const [pageCount, setPageCount] = useState<MatchesCountType>({
    upcoming: 0,
    ongoing: 0,
    finished: 0,
  });
  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: MATCHES_ITEMSPERPAGE,
  };
  const [loading, setLoadingState] = useState<LoadingState>({
    upcoming: true,
    ongoing: true,
    finished: true,
  });
  const [teams, setTeams] = useState<TeamsType>({
    upcoming: null,
    ongoing: null,
    finished: null,
  });
  const router = useRouter();
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  /**
   * Select squad and show in the ground
   * @param param iSquadId and iMatchId to get the players from squad and store in state
   */
  function selectSquad({ iSquadId, iMatchId }: SelectSquadProps) {
    // squadId = iSquadId;
    // matchId = iMatchId;
    // const params = new URLSearchParams(searchParams.toString());

    searchParams.set(QURIES.matchId, iMatchId);
    searchParams.set(QURIES.squadId, iSquadId);
    window.history.pushState(null, '', `?${searchParams.toString()}`);
    setMatchnSquadId({
      matchId: iMatchId,
      squadId: iSquadId,
    });
  }
  async function getTeamsByStatus(status: string) {
    // getPlayerSquadsByMatch({ actor: auth.actor,matchProps , setGroupedSquads });
    getFilter({
      actor: auth.actor,
      setTeams,
      props: { ...matchProps, status, page: 0 },
      setTeamsCounts: setPageCount,
      setLoadingState,
      setPlayerSquads: null,
    });
    if (type == QueryParamType.simple && matchId)
      // getPlayerSquadsByMatch({ matchId, actor: auth.actor, setPlayerSquads });
      getFilter({
        matchId: matchId,
        actor: auth.actor,
        setTeams: null,
        props: matchProps,
        setTeamsCounts: null,
        setLoadingState,
        setPlayerSquads,
      });
  }
  function changeTab(tab: string | null) {
    if (!tab) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(QURIES.matchTab, tab);
    window.history.pushState(null, '', `?${params.toString()}`);

    if (tab == MatchStatuses.upcoming && !teams.upcoming) {
      getTeamsByStatus(MatchStatuses.upcoming);
    } else if (tab == MatchStatuses.ongoing && !teams.ongoing) {
      getTeamsByStatus(MatchStatuses.ongoing);
    } else if (tab == MatchStatuses.finished && !teams.finished) {
      getTeamsByStatus(MatchStatuses.finished);
    }
    setMatchTab(tab);
  }
  function changeOffset(pageNumber: number) {
    switch (matchTab) {
      case MatchStatuses.upcoming:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          upcoming: pageNumber,
        }));
        break;
      case MatchStatuses.ongoing:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          ongoing: pageNumber,
        }));
        break;
      case MatchStatuses.finished:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          finished: pageNumber,
        }));
        break;
      default:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          upcoming: pageNumber,
        }));
        break;
    }
  }
  /**
   * pageClicked use to get items of selected page
   * @param pageNumber
   * @returns
   */
  function pageClicked(pageNumber: number) {
    changeOffset(pageNumber);
    getFilter({
      actor: auth.actor,
      setTeams,
      props: {
        ...matchProps,
        status: matchTab,
        page: pageNumber,
      },
      setTeamsCounts: setPageCount,
      setLoadingState,
      setPlayerSquads: null,
    });
  }
  useEffect(() => {
    if (!isConnected(auth.state)) return;
    let tempTab = searchParams.get(QURIES.matchTab);
    if (tempTab) setMatchTab(tempTab);
    getTeamsByStatus(tempTab ?? DEFAULT_MATCH_STATUS);
  }, [auth, matchId]);

  useEffect(() => {
    if (!isConnected(auth.state)) return;
    if (matchnSquadId.squadId) {
      fetchSquad({
        actor: auth.actor,
        squadId: matchnSquadId.squadId,
        setSelectedPlayers,
        setSubstitution,
        setTeamFormation,
        setMatch,
        setSelectedSquad,
        setSelectedSubstitudePlayers,
      });
    } else if (squadId) {
      fetchSquad({
        actor: auth.actor,
        squadId: squadId,
        setSelectedPlayers,
        setSubstitution,
        setTeamFormation,
        setSelectedSquad,
        setMatch,
        setSelectedSubstitudePlayers,
        contestId,
      });
    }
  }, [matchnSquadId, squadId, auth]);

  return (
    <>
      <Innerheader
        match={match}
        squadPoints={selectedSquad?.points}
        selectedPlayers={selectedPlayers ?? undefined}
        substitution={substitution}
        teamFormation={teamFormation}
        squadRank={selectedSquad?.rank}
        selectedSubstitudePlayers={selectedSubstitudePlayers ?? undefined}
      />
    </>
  );
}
