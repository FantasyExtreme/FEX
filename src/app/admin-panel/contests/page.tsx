'use client';
import React, { useEffect, useState } from 'react';

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
  GroupedContest,
  GroupedContests,
  Match,
} from '@/types/fantasy';

import {
  fetchMatch,
  getContests,
  handleTransferError,
  isConnected,
  isDev,
} from '@/components/utils/fantasy';
import {
  DefaultContest,
  EnvironmentEnum,
  QueryParamType,
} from '@/constant/variables';
import ContestRow from '@/components/Components/ContestRow';
import AddContest from '@/components/Components/AddContest';
import JoinContest from '@/components/Components/JoinContest';
import RankingModal from '@/components/Components/Ranking';
import { toast } from 'react-toastify';
import logger from '@/lib/logger';
import ContestItem from '@/components/Components/ContestItem';
import { TEAM_CREATION_ROUTE } from '@/constant/routes';

import Countdown from 'react-countdown';
import CountdownRender from '@/components/Components/CountdownRenderer';
import ConnectModal from '@/components/Components/ConnectModal';

export default function Contests() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get('matchId');
  const type = searchParams.get('type');
  const [match, setMatch] = useState<Match | null>(null);
  const [timeLeft, setTimeLeft] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [updateId, setUpdateId] = useState<null | string>(null);
  const navigation = useRouter();
  const [showConnect, setShowConnect] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  const router = useRouter();
  const { auth, userAuth,icpRate } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    icpRate: (state as ConnectPlugWalletSlice).icpRate,
  }));

  const handleShowModal = () => {
    setShowModal(true);
    setUpdateId(null);
  };
  const handleShowUpdateModal = (id: string) => {
    setShowModal(true);
    setUpdateId(id);
  };

  const handleCloseModal = () => {
    if (matchId)
      getContests({ matchId, userAuth, actor: auth.actor, setContests });

    setShowModal(false);
    setUpdateId(null);
  };

  const [contests, setContests] = useState<Contest[] | null>(null);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [groupedContests, setGroupedContests] = useState<
    GroupedContests[] | null
  >(null);

  const [showRanking, setShowRanking] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleShowRanking = (contest: Contest) => {
    setSelectedContest(contest);
    setShowRanking(true);
  };
  const handleCloseRanking = () => {
    setShowRanking(false);
  };
  const handleSelectSquad = (contest: Contest) => {
    setSelectedContest(contest);
    setShowSelect(true);
  };
  const handleCloseSelect = () => {
    setShowSelect(false);
  };
  let handleShowConnect = () => {
    setShowConnect(true);
  };

  async function addDefaultContest() {
    if (!matchId) return toast.error('No match');
    setLoading(true);
    try {
      let resp = await auth.actor.addContest({ ...DefaultContest, matchId });
      if (resp?.ok) {
        toast.success('Default Contest added');
        if (matchId)
          getContests({ matchId, userAuth, actor: auth.actor, setContests });
      } else {
        logger(resp?.err);
        toast.error('error while adding');
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  }
  /**
   * Asynchronously distributes rewards for a match.
   *
   * @throws {Error} If there is no match ID.
   */
  async function distributeReward() {
    if (!matchId) return toast.error('No match');
    setLoading(true);
    try {
      let resp = await auth.actor.distributeRewards(matchId);
      if (resp?.ok) {
        toast.success('Reward Distrbuted');
      } else {
        logger(resp?.err);
        toast.error(handleTransferError(resp?.err));
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!isConnected(auth.state)) return;
    if (!matchId) {
      getContests({ userAuth, actor: auth.actor, setGroupedContests });
    } else {
      getContests({ matchId, userAuth, actor: auth.actor, setContests });
    }

    if (!matchId) return;
    fetchMatch({
      matchId: matchId,
      actor: auth.actor,
      setMatch,
    });
  }, [auth, matchId]);
 
  useEffect(() => {
    if (isConnected(auth.state)) {
      if (!userAuth.userPerms?.admin) {
        navigation.replace('/');
      }
    }
  }, [auth.state]);

  return (
    <>
      {userAuth.userPerms?.admin && (
        <Container fluid className='inner-page'>
          <Row>
            <Container>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <div className='gray-panel'>
                    <h4 className='animeleft d-flex justify-content-between whitecolor Nasalization fw-normal'>
                      <span>Contests</span>
                      <div className='d-flex gap-5'>
                        <Button
                          id='create_contests'
                          onClick={handleShowModal}
                          className='reg-btn  text-capitalize'
                        >
                          Create Contest
                        </Button>
                        <Button
                          id='Add_Default_Contest'
                          onClick={addDefaultContest}
                          disabled={loading}
                          className='reg-btn  text-capitalize'
                        >
                          {loading ? (
                            <Spinner size='sm' />
                          ) : (
                            'Add Default Contest'
                          )}
                        </Button>{' '}
                        <Button
                          id='Add_Default_Contest'
                          onClick={distributeReward}
                          disabled={
                            loading ||
                            (contests && contests?.length > 0
                              ? contests[0].isDistributed
                              : false)
                          }
                          className='reg-btn  text-capitalize'
                        >
                          Distribute Reward
                        </Button>
                        {isDev() && (
                          <Button
                            id='Add_Default_Contest'
                            onClick={() => {
                              const matchStarted = auth.actor.testingStartMatch(
                                matchId,
                                5,
                              );
                              logger(matchStarted);
                            }}
                            disabled={
                              loading ||
                              (contests && contests?.length > 0
                                ? contests[0].isDistributed
                                : false)
                            }
                            className='reg-btn  text-capitalize'
                          >
                            Start match
                          </Button>
                        )}
                      </div>
                    </h4>

                    <div className='spacer-30' />
                    <h5 className='whitecolor Nasalization'>
                      League <span> Name</span>
                    </h5>
                    <div className='spacer-20' />

                    {contests && contests.length > 0 ? (
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
                                <span> Remaining untill the match starts</span>
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
                          <span> </span>
                        )}
                      </div>
                    ) : (
                      <div className='no-contests spacer-20'>
                        <p className='text-center text-white'>
                          No Contest Found
                        </p>
                      </div>
                    )}

                    <div className='spacer-20' />
                    <Container fluid>
                      <Row>
                        <Container>
                          <Row>
                            <Col xl='12' lg='12' md='12'>
                              <div className='package-contest-big'>
                                {type == QueryParamType.simple
                                  ? contests?.map((contest) => (
                                      // <ContestRow
                                      //   handleSelectSquad={handleSelectSquad}
                                      //   handleShowRanking={handleShowRanking}
                                      //   contest={contest}
                                      //   handleShowUpdateModal={handleShowUpdateModal}
                                      //   match={match}
                                      //   isDashboard={true}
                                      // />
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
                                        isAdminPannel={true}
                                        handleShowUpdateModal={
                                          handleShowUpdateModal
                                        }
                                      />
                                    ))
                                  : null}
                              </div>
                            </Col>
                          </Row>
                        </Container>
                      </Row>
                    </Container>
                  </div>
                </Col>
              </Row>
            </Container>
          </Row>
        </Container>
      )}
      <AddContest
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        updateId={updateId}
        handleShowModal={handleShowModal}
        matchId={matchId}
      />
      {/* {selectedContest && (
        <JoinContest
          handleCloseModal={handleCloseSelect}
          showModal={showSelect}
          contestId={selectedContest?.id}
          matchId={selectedContest?.matchId}
          match={null}
        />
      )} */}
      {selectedContest && (
        <RankingModal
          handleCloseModal={handleCloseRanking}
          showModal={showRanking}
          contestId={selectedContest?.id}
          match={null}
        />
      )}
    </>
  );
}
