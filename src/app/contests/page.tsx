'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  Contest,
  ContestType,
  GroupedContest,
  GroupedContests,
  LoadingState,
  Match,
  MatchesCountType,
  MatchesType,
} from '@/types/fantasy';
import {
  getAllParticipants,
  fetchMatch,
  getFilterdContests,
  isConnected,
  isInPast,
  getIcpRate,
  getContest,
  getContestWithMatch,
} from '@/components/utils/fantasy';
import {
  DEFAULT_MATCH_STATUS,
  Intervals,
  MATCHES_ITEMSPERPAGE,
  MATCHES_ITEMS_LIMIT,
  MatchStatusNames,
  MatchStatuses,
  QURIES,
  QueryParamType,
} from '@/constant/variables';
import ContestRow from '@/components/Components/ContestRow';
import logger from '@/lib/logger';
import JoinContest from '@/components/Components/JoinContest';
import RankingModal from '@/components/Components/Ranking';
import MatchesPagination from '@/components/Components/MatchesPagination';
import { match } from 'assert';
import ContestGroupedRow from '@/components/Components/ConstestGroupedRow';
import ContestItem from '@/components/Components/ContestItem';
import Countdown from 'react-countdown';
import CountdownRender from '@/components/Components/CountdownRenderer';
import { TEAM_CREATION_ROUTE } from '@/constant/routes';
import { debounce } from 'lodash';

export default function Contests() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get('matchId');
  const contestId = searchParams.get('contestId');
  const type = searchParams.get('type');
  const [contests, setContests] = useState<Contest[] | null>(null);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [showRanking, setShowRanking] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [noResults, setNoResults] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [icpRate, setIcpRate] = useState(0);
  const [simpleLoading, setSimpleLoading] = useState(true);

  const [timeleft, setTimeLeft] = useState('');
  const [matchTab, setMatchTab] = useState<string>(DEFAULT_MATCH_STATUS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    page: 0,
    search: '',
    limit: MATCHES_ITEMS_LIMIT,
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

  async function getStatusContests(status: string | null, loader: boolean) {
    if (!matchId) {
      // getContests({ userAuth,actor: auth.actor , setGroupedContests });
      getFilterdContests(
        null,
        auth.actor,
        userAuth,
        setGroupedContests,
        { ...matchProps, status, page: 0, search: searchString },
        null,
        setPageCount,
        loader ? setLoadingState : undefined,
      );
    }
    // getContests({ matchId, userAuth, actor: auth.actor, setContests });
    else if (matchId && matchId != null)
      await getFilterdContests(
        matchId,
        auth.actor,
        userAuth,
        null,
        { ...matchProps, status, page: 0, search: searchString },
        setContests,
        setPageCount,
        loader ? setLoadingState : undefined,
      );
  }
  function changeTab(tab: string | null) {
    setNoResults(false);
    if (!tab) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set(QURIES.matchTab, tab);
    window.history.pushState(null, '', `?${params.toString()}`);

    if (tab == MatchStatuses.upcoming && !groupedContests?.upcoming) {
      getStatusContests(MatchStatuses.upcoming, true);
    } else if (tab == MatchStatuses.ongoing && !groupedContests?.ongoing) {
      getStatusContests(MatchStatuses.ongoing, true);
    } else if (tab == MatchStatuses.finished && !groupedContests?.finished) {
      getStatusContests(MatchStatuses.finished, true);
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
    // setMatch(null);
    setShowSelect(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function pageClicked(pageNumber: number) {
    if (!auth.actor) return;
    setNoResults(false);
    changeOffset(pageNumber);
    if (!matchId) {
      // getContests({ userAuth,actor: auth.actor , setGroupedContests });
      getFilterdContests(
        null,
        auth.actor,
        userAuth,
        setGroupedContests,
        {
          ...matchProps,
          status: matchTab,
          page: pageNumber,
          search: searchString,
        },
        null,
        setPageCount,
        setLoadingState,
      );
    } else if (matchId && matchId != null) {
      // getContests({ matchId, userAuth, actor: auth.actor, setContests });
      getFilterdContests(
        matchId,
        auth.actor,
        userAuth,
        null,
        {
          ...matchProps,
          status: matchTab,
          page: pageNumber,
          search: searchString,
        },
        setContests,
        setPageCount,
        setLoadingState,
      );
    }
  }
  const debouncedSearch = useCallback(
    debounce((value: string) => setSearchString(value.trim()), 1000),
    [],
  );

  useEffect(() => {
    if (!isConnected(auth.state)) {
      if (!auth.isLoading)
        setLoadingState({ upcoming: false, ongoing: false, finished: false });
      return;
    }

    let tempTab = searchParams.get(QURIES.matchTab);
    if (tempTab) setMatchTab(tempTab);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial fetch
    getStatusContests(tempTab ?? DEFAULT_MATCH_STATUS, true);
  }, [auth, searchString, matchId]);

  useEffect(() => {
    if (!matchId) return;
    fetchMatch({
      matchId: matchId,
      actor: auth.actor,
      setMatch,
    });
  }, [matchId]);
  useEffect(() => {
    if (!contestId || !auth.actor) return;
    getContestWithMatch(
      auth.actor,
      contestId,
      setSimpleLoading,
      setContests,
      setMatch,
    );
  }, [contestId, auth.actor]);
  useEffect(() => {
    if (searchString) {
      getStatusContests(matchTab, true).then(() => {
        if (contests?.length === 0 || !contests) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      });
    } else {
      setNoResults(false);
    }
  }, [searchString]);

  useEffect(() => {
    if (!auth.isLoading && auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [auth]);
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
                <div className='gray-panel'>
                  <h4 className='animeleft whitecolor Nasalization fw-normal'>
                    <span>Contests</span>
                  </h4>
                  <div className='spacer-30' />

                  <div className='spacer-10' />
                  {type == QueryParamType.simple ? (
                    <>
                      {match && (
                        <div className='contests_name_div'>
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
                                className='underlined reg-btn reg-custom-btn empty text-capitalize text-white'
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
                              className='reg-btn trans-white mid text-capitalize btn btn-primary'
                              href={
                                isConnected(auth.state)
                                  ? `${TEAM_CREATION_ROUTE}?matchId=${matchId}`
                                  : '#'
                              }
                              // onClick={() => {
                              //   if (!isConnected(auth.state)) {
                              //     handleShowConnect();

                              //     setPath(`${TEAM_CREATION_ROUTE}?matchId=${matchId}`);
                              //   }
                              // }}
                            >
                              Create Team
                            </Link>
                          ) : (
                            <span></span>
                          )}
                        </div>
                      )}

                      {/* {contests?.map((contest: Contest) => (
                        <ContestRow
                          timeleft={timeleft}
                          handleSelectSquad={handleSelectSquad}
                          handleShowRanking={handleShowRanking}
                          contest={contest}
                          selectedContest={selectedContest}
                          match={match}
                          key={
                            contest.slots +
                            contest.prizePool +
                            (match?.status ?? '')
                          }
                        />
                      ))} */}
                      <Container fluid>
                        <Row>
                          <Container>
                            <Row>
                              {simpleLoading ? (
                                <Col xl='12' lg='12' md='12'>
                                  {' '}
                                  <p className='text-center'>
                                    <Spinner />
                                  </p>
                                </Col>
                              ) : (
                                <Col xl='12' lg='12' md='12'>
                                  <div className='package-contest-big'>
                                    {!contests || contests?.length == 0 ? (
                                      <p className='text-center text-white'>
                                        Contest Not Found
                                      </p>
                                    ) : (
                                      contests?.map((contest: Contest) => (
                                        <ContestItem
                                          timeleft={timeleft}
                                          handleSelectSquad={handleSelectSquad}
                                          handleShowRanking={handleShowRanking}
                                          contest={contest}
                                          selectedContest={selectedContest}
                                          match={match}
                                          key={contest.id}
                                          setSelectedContest={
                                            setSelectedContest
                                          }
                                          icpRate={icpRate}
                                        />
                                      ))
                                    )}
                                  </div>
                                </Col>
                              )}
                            </Row>
                          </Container>
                        </Row>
                      </Container>
                    </>
                  ) : type == QueryParamType.grouped ? (
                    <>
                      <div className='tabs-search-container'>
                        <Form
                          onSubmit={(e) => e.preventDefault()}
                          className='search-form'
                        >
                          <Form.Group>
                            <Form.Label>Search</Form.Label>
                            <Form.Control
                              type='search'
                              placeholder='Search for Contests...'
                              onChange={(e) => debouncedSearch(e.target.value)}
                            />
                          </Form.Group>
                        </Form>
                        <Tabs
                          activeKey={matchTab}
                          onSelect={changeTab}
                          className='mb-5 mobile-small-tabs tabbb'
                        >
                          <Tab
                            eventKey={MatchStatuses.upcoming}
                            title='Upcoming'
                          >
                            {loading.upcoming ? (
                              <p className='text-center'>
                                <Spinner />
                              </p>
                            ) : groupedContests.upcoming &&
                              groupedContests?.upcoming?.length > 0 ? (
                              <ContestGroupedRow
                                loading={loading.upcoming}
                                tab={matchTab}
                                groupMatches={groupedContests?.upcoming}
                                handleSelectSquad={handleSelectSquad}
                                handleShowRanking={handleShowRanking}
                                selectedContest={selectedContest}
                                match={match}
                                timeleft={timeleft}
                              />
                            ) : (
                              <tr className='d-flex justify-content-center'>
                                <td className='no-bg ' colSpan={6}>
                                  <div className='d-flex justify-content-center team-message'>
                                    <p className='me-2'>
                                      {noResults
                                        ? 'Contest does not exist'
                                        : 'No Upcoming Contest'}{' '}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Tab>
                          <Tab
                            eventKey={MatchStatuses.ongoing}
                            title='In Progress'
                          >
                            {loading.ongoing ? (
                              <p className='text-center'>
                                <Spinner />
                              </p>
                            ) : groupedContests.ongoing &&
                              groupedContests?.ongoing?.length > 0 ? (
                              <ContestGroupedRow
                                loading={loading.ongoing}
                                tab={matchTab}
                                groupMatches={groupedContests?.ongoing}
                                handleSelectSquad={handleSelectSquad}
                                handleShowRanking={handleShowRanking}
                                selectedContest={selectedContest}
                                match={match}
                                timeleft={timeleft}
                              />
                            ) : (
                              <tr className='d-flex justify-content-center'>
                                <td className='no-bg ' colSpan={6}>
                                  <div className='d-flex justify-content-center team-message'>
                                    <p className='me-2'>
                                      {noResults
                                        ? 'Contest does not exist'
                                        : ' No Contest In Progress'}{' '}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Tab>
                          <Tab
                            eventKey={MatchStatuses.finished}
                            title='Completed'
                          >
                            {loading.finished ? (
                              <p className='text-center'>
                                <Spinner />
                              </p>
                            ) : groupedContests.finished &&
                              groupedContests?.finished?.length > 0 ? (
                              <ContestGroupedRow
                                loading={loading.finished}
                                tab={matchTab}
                                groupMatches={groupedContests?.finished}
                                handleSelectSquad={handleSelectSquad}
                                handleShowRanking={handleShowRanking}
                                selectedContest={selectedContest}
                                match={match}
                                timeleft={timeleft}
                              />
                            ) : (
                              <tr className='d-flex justify-content-center'>
                                <td className='no-bg ' colSpan={6}>
                                  <div className='d-flex justify-content-center team-message'>
                                    <p className='me-2'>
                                      {noResults
                                        ? 'Contest does not exist'
                                        : 'No Finished Contest'}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Tab>
                        </Tabs>
                      </div>
                    </>
                  ) : null}

                  {/* Contest Post */}

                  <MatchesPagination
                    LimitParam={MATCHES_ITEMS_LIMIT}
                    matchTab={matchTab}
                    pageCount={pageCount}
                    offset={offset}
                    pageClicked={pageClicked}
                  />
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

      <Modal show={show} centered size='lg' onHide={handleClose}>
        <Modal.Body>
          <Button className='btn-close' onClick={handleClose}>
            <i className='fa fa-close' />
          </Button>
          <h5 className='Nasalization text-white'>
            My <span>Teams</span>
          </h5>
          <ul className='join-contest-list'>
            <li>
              <div className='grey-pnl'>
                <h5>Team Name</h5>
                <Link href='#'>
                  <i className='fa fa-eye' />
                </Link>
              </div>
              <Button className='reg-btn trans-white mid text-capitalize mx-3 btn btn-primary'>
                Join Contest
              </Button>
            </li>
            <li>
              <div className='grey-pnl'>
                <h5>Team Name</h5>
                <Link href='#'>
                  <i className='fa fa-eye' />
                </Link>
              </div>
              <Button className='reg-btn trans-white mid text-capitalize mx-3 btn btn-primary'>
                Join Contest
              </Button>
            </li>
            <li>
              <div className='grey-pnl'>
                <h5>Team Name</h5>
                <Link href='#'>
                  <i className='fa fa-eye' />
                </Link>
              </div>
              <Button className='reg-btn trans-white mid text-capitalize mx-3 btn btn-primary'>
                Join Contest
              </Button>
            </li>
            <li>
              <div className='grey-pnl'>
                <h5>Team Name</h5>
                <Link href='#'>
                  <i className='fa fa-eye' />
                </Link>
              </div>
              <Button className='reg-btn trans-white mid text-capitalize mx-3 btn btn-primary'>
                Join Contest
              </Button>
            </li>
            <li>
              <div className='grey-pnl'>
                <h5>Team Name</h5>
                <Link href='#'>
                  <i className='fa fa-eye' />
                </Link>
              </div>
              <Button className='reg-btn trans-white mid text-capitalize mx-3 btn btn-primary'>
                Join Contest
              </Button>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}
