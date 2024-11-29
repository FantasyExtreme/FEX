'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Table,
  Spinner,
  Button,
  Form,
} from 'react-bootstrap';
import Image from 'next/image';
import FantasyPlayers from '@/components/Components/FantasyPlayers';
import player from '@/assets/images/Players/player-5.png';
import player1 from '@/assets/images/Players/player-1.png';
import player2 from '@/assets/images/Players/player-2.png';
import player3 from '@/assets/images/Players/player-3.png';
import player4 from '@/assets/images/Players/player-4.png';

import CupSvg from '@/components/Icons/CupSvg';
import GiftSvg from '@/components/Icons/GiftSvg';
import LeaderBoardSvg from '@/components/Icons/LeaderboardSvg';
import userSvg from '@/assets/images/icons/icon-users.png';
import DashboardSvg from '@/components/Icons/DashboardSvg';
import PrincipalSvg from '@/components/Icons/PrincipalSvg';
import UserSvg from '@/components/Icons/Userrsvg';
import { getMeAsTopplayers, getTopplayers } from '@/components/utils/fantasy';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { GetProps, MeAsTopPlayers, TopPlayers } from '@/types/fantasy';
import { TOP_FANTASY_PLAYERS_PAGE_ITEMSPERPAGE } from '@/constant/variables';
import logger from '@/lib/logger';
import MatchesPagination from '@/components/Components/MatchesPagination';
import PaginatedList from '@/components/Components/Pagination';
import { E8S } from '@/constant/fantasticonst';
import { fromE8S } from '@/lib/ledger';
// import CupSvg from '@/assets/images/icons/icon-trophy-small.png';
// import GiftSvg from '@/assets/images/icons/icon-gift.png';
// import LeaderBoardSvg from '@/assets/images/icons/icon-ranks.png';

export default function fantasyplayer() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const [topPlayersProps, setTopPlayersProps] = useState<GetProps>({
    page: 0,
    limit: TOP_FANTASY_PLAYERS_PAGE_ITEMSPERPAGE,
    search: '',
    status: '',
  });
  const [offset, setOffset] = useState<number>(0);
  const [totallCount, setTotallCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [meLoading, setMeLoading] = useState<boolean>(true);

  const [topPlayer, setPlayer] = useState<MeAsTopPlayers | null>(null);

  const [topPlayers, setPlayers] = useState<TopPlayers[] | null>(null);
  /**
   * pageClicked use to get items of selected page
   * @param pageNumber
   * @returns
   */
  function pageClicked(pageNumber: number) {
    if (!auth.actor) return;
    setOffset(pageNumber);
    logger(pageNumber, 'pageNumber');
    getTopplayers(
      auth.actor,
      { ...topPlayersProps, page: pageNumber },
      setPlayers,
      setLoading,
      setTotallCount,
    );
  }
  useEffect(() => {
    getTopplayers(
      auth.actor,
      topPlayersProps,
      setPlayers,
      setLoading,
      setTotallCount,
    );
    if (!auth.isLoading && auth.state === 'anonymous') {
      setPlayer(null);
      setMeLoading(false);
    } else {
      if (auth?.identity) {
        let userPincipal = auth?.identity?.getPrincipal().toString();
        getMeAsTopplayers(auth.actor, userPincipal, setPlayer, setMeLoading);
      } else {
        setMeLoading(false);
      }
    }
  }, [auth.state]);

  return (
    <>
      <Container fluid className='inner-page pb-0'>
        {!meLoading && topPlayer && (
          <Row>
            <Container>
              <Row>
                <Col xl='12' lg='12' md='12' sm='12'>
                  <h2>
                    Your <span>Rank</span>
                  </h2>
                  <div className='spacer-20' />
                </Col>
                {meLoading ? (
                  <div className='flex-center'>
                    {' '}
                    <Spinner animation='border' />
                  </div>
                ) : (
                  topPlayer && (
                    <Col xl='12' lg='12' md='12' sm='12'>
                      <div className='single-playerdetail-pnl active'>
                        <div className='img-pnl-main text-center'>
                          <div className='img-pnl'>
                            <img
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/profileplaceholder.png'
                              alt='Profile Pic'
                            />
                          </div>
                          <ul>
                            <li>
                              <h3 className='Nasalization whitecolor mt-2 text-uppercase'>
                                {topPlayer?.name ?? ''}
                              </h3>
                            </li>
                            <li>
                              <h3 className='Nasalization whitecolor mt-2 text-uppercase'>
                                Rank :{' '}
                                <span className='color'>
                                  {topPlayer?.rank ?? 0}
                                </span>
                              </h3>
                            </li>
                          </ul>
                        </div>
                        <div className='txt-pnl'>
                          <div className='text-right web-tablet-view'>
                            <h2 className='Nasalization whitecolor m-0'>
                              Rank{' '}
                              <span className='color'>
                                {topPlayer?.rank ?? 0}
                              </span>
                            </h2>
                          </div>
                          <ul className='total-player-win-list'>
                            <li>
                              <h6>Total Participated Contests.</h6>
                              <div className='stat-container'>
                                <span>
                                  <UserSvg />
                                </span>
                                <span>{topPlayer?.participated}</span>
                              </div>
                            </li>
                            <li>
                              <h6>Total Won Contests</h6>
                              <div className='stat-container'>
                                <span>
                                  {' '}
                                  <CupSvg />
                                </span>
                                <span>{topPlayer?.contestWon}</span>
                              </div>
                            </li>
                            {/* <li>
                    <h6>Total Contests with Rewards</h6>
                    <div className='stat-container'>
                      <span>
                        <GiftSvg />
                      </span>
                      <span>8</span>
                    </div>
                  </li> */}
                            <li>
                              <h6>Total Rewards.</h6>
                              <div className='stat-container'>
                                <span>
                                  <LeaderBoardSvg />
                                </span>
                                <span>
                                  {fromE8S(topPlayer?.totalEarning, true)} ICP
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                  )
                )}
              </Row>
            </Container>
          </Row>
        )}
        <Row>
          <Container fluid id='Fantasy' className='top-fantasy-panel'>
            <div className='bg-layer' />
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <h2 className='text-left'>
                      Fantasy <span>Players</span>
                    </h2>
                    <div className='spacer-20' />
                  </Col>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    {loading ? (
                      <div className='flex-center'>
                        {' '}
                        <Spinner animation='border' />
                      </div>
                    ) : topPlayers && topPlayers.length !== 0 ? (
                      topPlayers.map((player, index) => {
                        let rankCount =
                          offset * TOP_FANTASY_PLAYERS_PAGE_ITEMSPERPAGE +
                          index +
                          1;
                        return (
                          <div className='single-playerdetail-pnl'>
                            <div className='img-pnl-main text-center'>
                              <div className='img-pnl'>
                                <img
                                  src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/profileplaceholder.png'
                                  alt='Profile Pic'
                                />
                              </div>
                              <ul>
                                <li>
                                  <h3 className='Nasalization whitecolor mt-2 text-uppercase'>
                                    {player?.name}
                                  </h3>
                                </li>
                                <li>
                                  <h3 className='Nasalization whitecolor mt-2 text-uppercase'>
                                    Rank :{' '}
                                    <span className='color'> {rankCount}</span>
                                  </h3>
                                </li>
                              </ul>
                            </div>
                            <div className='txt-pnl'>
                              <div className='text-right web-tablet-view'>
                                <h2 className='Nasalization whitecolor m-0'>
                                  Rank{' '}
                                  <span className='color'>{rankCount}</span>
                                </h2>
                              </div>
                              <ul className='total-player-win-list'>
                                <li>
                                  <h6>Total Participated Contests.</h6>
                                  <div className='stat-container'>
                                    <span>
                                      <UserSvg />
                                    </span>
                                    <span>{player?.participated ?? 0}</span>
                                  </div>
                                </li>
                                <li>
                                  <h6>Total Won Contests</h6>
                                  <div className='stat-container'>
                                    <span>
                                      {' '}
                                      <CupSvg />
                                    </span>
                                    <span>{player?.contestWon ?? 0}</span>
                                  </div>
                                </li>
                                {/* <li>
                            <h6>Total Contests with Rewards</h6>
                            <div className='stat-container'>
                              <span>
                                <GiftSvg />
                              </span>
                              <span>8</span>
                            </div>
                          </li> */}
                                <li>
                                  <h6>Total Rewards.</h6>
                                  <div className='stat-container'>
                                    <span>
                                      <LeaderBoardSvg />
                                    </span>
                                    <span>
                                      {fromE8S(player?.totalEarning ?? 0, true)}{' '}
                                      ICP
                                    </span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='text-center text-white'>
                        No Player Found
                      </div>
                    )}{' '}
                  </Col>
                </Row>
              </Container>
            </Row>
            {totallCount > TOP_FANTASY_PLAYERS_PAGE_ITEMSPERPAGE && (
              <Row>
                <Container>
                  <Row>
                    <Col className='flex-end my-3'>
                      <PaginatedList
                        itemsPerPage={TOP_FANTASY_PLAYERS_PAGE_ITEMSPERPAGE}
                        count={totallCount}
                        offset={offset}
                        pageChange={pageClicked}
                      />
                    </Col>
                  </Row>
                </Container>
              </Row>
            )}
          </Container>
        </Row>
      </Container>
    </>
  );
}
