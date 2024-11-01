'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import tethericon from '@/assets/images/icons/tether-icon.png';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  Contest,
  ContestType,
  LoadingState,
  Match,
  MatchesCountType,
} from '@/types/fantasy';
import {
  fetchMatch,
  getFilterdContests,
  isConnected,
  getIcpRate,
} from '@/components/utils/fantasy';

import {
  DEFAULT_MATCH_STATUS,
  Intervals,
  MATCHES_ITEMSPERPAGE,
  MatchStatusNames,
  MatchStatuses,
  QURIES,
  QueryParamType,
} from '@/constant/variables';
import ContestItem from '@/components/Components/ContestItem';
import Countdown from 'react-countdown';
import CountdownRender from '@/components/Components/CountdownRenderer';
import { TEAM_CREATION_ROUTE } from '@/constant/routes';
import ConnectModal from '@/components/Components/ConnectModal';
import RankingModal from '@/components/Components/Ranking';

export default function Contests() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get('matchId');
  const type = searchParams.get('type');
  const [contests, setContests] = useState<Contest[] | null>(null);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const router = useRouter();
  const [matchTab, setMatchTab] = useState<string>(DEFAULT_MATCH_STATUS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [icpRate, setIcpRate] = useState(0);
  const [showConnect, setShowConnect] = useState(false);
  const [path, setPath] = useState<string | null>(null);

  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    page: 0,
    search: '',
    limit: MATCHES_ITEMSPERPAGE,
  };
  const [loading, setLoadingState] = useState<LoadingState>({
    upcoming: true,
    ongoing: true,
    finished: true,
  });
  const [pageCount, setPageCount] = useState<MatchesCountType>({
    upcoming: 1,
    ongoing: 1,
    finished: 1,
  });
  const [offset, setOffset] = useState<MatchesCountType>({
    upcoming: 0,
    ongoing: 0,
    finished: 0,
  });
  const [groupedContests, setGroupedContests] = useState<ContestType>({
    upcoming: null,
    ongoing: null,
    finished: null,
  });

  /**
   * Fetches contests based on a given status and other match properties.
   *
   * @async
   * @function getStatusContests
   * @param status - The status of the contests to filter by. Can be a string representing the status or null.
   * @returns A promise that resolves when the contests are fetched and state is updated.
   */
  async function getStatusContests(status: string | null, loader: boolean) {
    if (matchId && matchId != null)
      await getFilterdContests(
        matchId,
        auth.actor,
        userAuth,
        null,
        { ...matchProps, status, page: 0 },
        setContests,
        setPageCount,
        loader ? setLoadingState : () => {},
      );
  }

  /**
   * Handle the selection of a contest.
   *
   * @param {Contest} contest - The selected contest
   */
  const handleSelectContest = (contest: Contest) => {
    setSelectedContest(contest);
    fetchMatch({
      matchId: contest.matchId,
      actor: auth.actor,
      setMatch,
    });
  };
  /**
   * Handles showing the ranking for a specific contest.
   *
   * @param {Contest} contest - The contest for which the ranking is to be shown.
   * @return {void} No return value.
   */
  const handleShowRanking = (contest: Contest) => {
    handleSelectContest(contest);
    setShowRanking(true);
  };
  /**
   * Closes the ranking and resets the match state.
   *
   * @return {void} No return value.
   */
  const handleCloseRanking = () => {
    // setMatch(null);
    setShowRanking(false);
  };
  /**
   * Handles the selection of a squad.
   *
   * @param {Contest} contest - The contest to select.
   * @return {void}
   */
  const handleSelectSquad = (contest: Contest) => {
    handleSelectContest(contest);
    setShowSelect(true);
  };
  /**
   * A function to handle closing the selection and resetting the match.
   *
   * @return {void} No return value
   */
  const handleCloseSelect = () => {
    setMatch(null);
    setShowSelect(false);
  };
  let handleShowConnect = () => {
    setShowConnect(true);
  };
  function handleHideConnect() {
    setShowConnect(false);
  }
  const handleClose = () => setShow(false);
  /**
   * clickRef use as a callback route user connection modal should route after connection
   */
  let clickRef = () => {
    if (path) {
      router.push(path);
    }
  };
  useEffect(() => {
    // if (!isConnected(auth.state)) return;
    if (!auth.actor) return;
    let tempTab = searchParams.get(QURIES.matchTab);
    if (tempTab) setMatchTab(tempTab);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Initial fetch
    getStatusContests(tempTab ?? DEFAULT_MATCH_STATUS, true);

    // Set up new interval
    intervalRef.current = setInterval(() => {
      if (matchId) {
        fetchMatch({
          matchId: matchId,
          actor: auth.actor,
          setMatch,
        });
      }
      getStatusContests(tempTab ?? DEFAULT_MATCH_STATUS, false);
    }, Intervals.contest);
    // Initial fetch

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [auth, matchId]);
  useEffect(() => {
    if (!matchId || !auth.actor) return;
    fetchMatch({
      matchId: matchId,
      actor: auth.actor,
      setMatch,
    });
  }, [auth, matchId]);
  let getLatestIcpRate = async () => {
    let rate = await getIcpRate();
    setIcpRate(rate);
  };
  useEffect(() => {
    getLatestIcpRate();
  }, []);
  return (
    <>
      <Container fluid className='inner-page'>
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='gray-panel web-view-trans'>
                  <h4 className='animeleft whitecolor tablet-view-none Nasalization fw-normal'>
                    <span>Contests</span>
                  </h4>
                  <small className='text-white tablet-view-none Nasalization'>
                    {' '}
                    Create team and join contest
                  </small>
                  <div className='spacer-30 tablet-view-none' />

                  <div className='spacer-10 tablet-view-none' />
                  {type == QueryParamType.simple ? (
                    loading.upcoming ? (
                      <p className='text-center'>
                        <Spinner />
                      </p>
                    ) : contests && contests?.length != 0 ? (
                      <>
                        <div className='contests_name_div nam'>
                          {match && Number(match.time) > Date.now() ? (
                            <OverlayTrigger
                              placement='top'
                              overlay={
                                <Tooltip
                                  id='tooltip-top'
                                  className='Nasalization text-white'
                                >
                                  Time{' '}
                                  <span>
                                    {' '}
                                    Remaining untill the match starts
                                  </span>
                                </Tooltip>
                              }
                            >
                              <Link
                                href={''}
                                className='underlined  tablet-view-none reg-btn reg-custom-btn empty text-capitalize text-white'
                              >
                                <Countdown
                                  date={match?.time}
                                  renderer={CountdownRender}
                                />
                                {/* <h6 className='timer text-white'>{timeleft}</h6> */}
                              </Link>
                            </OverlayTrigger>
                          ) : (
                            <span></span>
                          )}
                          <h5 className='whitecolor molde-div'>
                            <span>
                              {match?.homeTeam.name}
                              &nbsp;
                              <img
                                src={match?.homeTeam.logo}
                                width={30}
                                alt='homeTeamlogo'
                              />{' '}
                            </span>
                            {match && Number(match.time) < Date.now() ? (
                              <p className='rank mx-3'>
                                {Number(match?.homeScore)} -{' '}
                                {Number(match?.awayScore)}{' '}
                              </p>
                            ) : (
                              <p className='mt-4 mx-4 w_rank'>VS</p>
                            )}
                            <span>
                              <img
                                src={match?.awayTeam.logo}
                                alt='awayTeamlogo'
                                width={30}
                              />
                              &nbsp;{match?.awayTeam.name}{' '}
                            </span>
                          </h5>
                          {match && Number(match.time) > Date.now() ? (
                            <Link
                              className='reg-btn trans-white mid text-capitalize btn btn-primary tablet-view-none'
                              href={'#'}
                              // href={
                              //   isConnected(auth.state)
                              //     ? `${TEAM_CREATION_ROUTE}?matchId=${matchId}`
                              //     : '#'
                              // }
                              onClick={(e) => {
                                e.preventDefault();
                                if (!isConnected(auth.state)) {
                                  handleShowConnect();

                                  setPath(
                                    `${TEAM_CREATION_ROUTE}?matchId=${matchId}`,
                                  );
                                } else {
                                  router.push(
                                    `${TEAM_CREATION_ROUTE}?matchId=${matchId}`,
                                  );
                                }
                              }}
                            >
                              Create Team
                            </Link>
                          ) : (
                            <span></span>
                          )}
                        </div>

                        {/* {contests?.map((contest: Contest) => (
                          <ContestRow
                            timeleft={timeLeft}
                            handleSelectSquad={handleSelectSquad}
                            handleShowRanking={handleShowRanking}
                            contest={contest}
                            selectedContest={selectedContest}
                            match={match}
                            key={contest.id}
                            setSelectedContest={setSelectedContest}
                          />
                        ))} */}
                        <Container fluid>
                          <Row>
                            <Container>
                              <Row>
                                <Col xl='12' lg='12' md='12'>
                                  <div className='spacer-50' />
                                  <div className='package-contest-big'>
                                    {contests?.map((contest: Contest) => (
                                      <ContestItem
                                        timeleft={timeLeft}
                                        handleSelectSquad={handleSelectSquad}
                                        handleShowRanking={handleShowRanking}
                                        contest={contest}
                                        selectedContest={selectedContest}
                                        match={match}
                                        key={contest.id}
                                        setSelectedContest={setSelectedContest}
                                        icpRate={icpRate}
                                      />
                                    ))}
                                  </div>
                                </Col>
                              </Row>
                            </Container>
                          </Row>
                        </Container>
                      </>
                    ) : (
                      <p className='text-center text-white'>No Contest Found</p>
                    )
                  ) : null}
                  {/* Contest Post */}
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {selectedContest && (
        <RankingModal
          handleCloseModal={handleCloseRanking}
          showModal={showRanking}
          contestId={selectedContest?.id}
          match={match}
        />
      )}
      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
    </>
  );
}
