'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import NavBar from '@/components/Components/NavBar';
import Footer from '@/components/Components/Footer';
import Playeraccordian from '@/components/Components/PlayerAccordian';
import shirt5 from '../../assets/old-images/Batch/Shirt-5.png';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import logger from '@/lib/logger';
import { fromNullable } from '@dfinity/utils';
import {
  CONTESTS_ROUTE,
  MATCH_CONTEST_ROUTE,
  PLAYERS_ROUTE,
} from '@/constant/routes';
import {
  FORMATIONS_AND_SUBSTITUTION,
  initialPlayers,
} from '@/constant/fantasticonst';
import { groupPlayersByRole, isConnected } from '@/components/utils/fantasy';
import PlayerGround from '@/components/Components/PlayerGround';
import { usePathname } from 'next/navigation';

export default function Standing() {
  const [playerSquads, setPlayerSquads] = useState<any[]>([]);
  const [match, setMatch] = useState<Match | null>();
  const [selectedPlayers, setSelectedPlayers] =
    useState<Record<string, Player[]>>(initialPlayers);
  const [selectedSquad, setSelectedSquad] = useState<string>('');
  const [teamFormation, setTeamFormation] = useState({
    goalKeeper: 1,
    defender: 3,
    midfielder: 4,
    forward: 3,
  });
  const [substitution, setSubstitution] = useState({
    goalKeeper: 1,
    defender: 2,
    midfielder: 1,
    forward: 0,
  });
  const path = usePathname();

  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get('matchId');
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));

  async function getMatch() {
    try {
      const resp: any = fromNullable(await auth.actor.getMatch(matchId));
      resp.homeTeam[1] = fromNullable(resp?.homeTeam[1]);
      resp.awayTeam[1] = fromNullable(resp?.awayTeam[1]);
      const homeTeam = {
        ...resp?.homeTeam[1],
        id: resp?.homeTeam[0],
      };
      const awayTeam = {
        ...resp?.awayTeam[1],
        id: resp?.awayTeam[0],
      };
      setMatch({
        awayTeam,
        homeTeam,
        location: resp.location,
        time: resp.time,
      });
      // const match = resp?.map((item)=> fromNullable(item))
      logger({ resp, match }, 'this is the match resp');
    } catch (error) {
      logger(error);
    }
  }
  async function getPlayerSquads() {
    try {
      const resp = await auth.actor.getPlayerSquadsByMatch(matchId);
      const _playerSquads = resp?.map((squad: any) => {
        let newPlayers = squad[1]?.players?.map((player: any) => {
          return {
            id: player[0],
            ...player[1],
          };
        });
        let groupedPlayers = groupPlayersByRole(newPlayers);
        return {
          ...squad[1],
          players: groupedPlayers,
          id: squad[0],
        };
      });
      setPlayerSquads(_playerSquads);
      logger(_playerSquads, 'this is the player resp');
    } catch (error) {
      logger(error);
    }
  }
  async function selectSquad(id: string) {
    const newSquad = playerSquads.find((squad) => {
      return squad.id === id;
    });
    let { 0: d, 1: m, 2: f } = newSquad?.formation?.split('-');
    let newFormNSub = FORMATIONS_AND_SUBSTITUTION.find((formNSub) => {
      if (
        formNSub.formation.defender == d &&
        formNSub.formation.midfielder == m &&
        formNSub.formation.forward == f
      ) {
        setTeamFormation(formNSub.formation);
        setSubstitution(formNSub.substitution);
      }
    });
    // let newFormNSub = FORMATIONS_AND_SUBSTITUTION.find(
    //   (formNSub) =>
    //     formNSub.formation.defender == d &&
    //     formNSub.formation.midfielder == m &&
    //     formNSub.formation.forward == f
    // );
    // setTeamFormation(newFormNSub?.formation);
    // setSubstitution(newFormNSub?.substitution);
    setSelectedSquad(newSquad.id);
    setSelectedPlayers(newSquad.players);
  }

  useEffect(() => {
    if (isConnected(auth.state) && matchId) {
      getPlayerSquads();
      getMatch();
    }
  }, [auth, matchId]);

  return (
    <>
      <Container fluid className='content-pnl'>
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12'>
                <div className='upcoming-match-board shadow'>
                  <Row>
                    <Col xl={{ span: 4, order: 2 }} lg={{ span: 4, order: 2 }}>
                      <div className='point-board mobile-view text-center'>
                        <h2>
                          {match
                            ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
                            : ''}
                          <Link className='reg-btn' href={`/${CONTESTS_ROUTE}`}>
                            Join Contest
                          </Link>
                        </h2>
                        <div className='spacer-20' />
                        <div className='total-panel'>
                          <ul>
                            <li>
                              <p>Rank</p>
                              <h5>0</h5>
                            </li>
                            <li>
                              <p>Total Points</p>
                              <h3>0</h3>
                            </li>
                            <li>
                              <p>Transfers</p>
                              <h5>0</h5>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className='overall-panel'>
                        <div className='overall-head'>
                          <h2>{userAuth?.name}</h2>
                          <h6>@{userAuth?.name}</h6>
                        </div>
                        <div className='overall-body'>
                          <ul className='points-list'>
                            {/* <li>
                              <p>Overall points</p>
                              <p>34</p>
                            </li>
                            <li>
                              <p>Overall rank</p>
                              <p>10,808,868</p>
                            </li>
                            <li>
                              <p>Total players</p>
                              <p>10,883,786</p>
                            </li> */}
                            {playerSquads &&
                              playerSquads?.map((squad) => {
                                return (
                                  <li
                                    onClick={() => selectSquad(squad.id)}
                                    key={squad.id}
                                  >
                                    <p>{squad?.name}</p>
                                    <p>0</p>
                                    <p>0</p>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </Col>
                    <Col xl={{ span: 8, order: 1 }} lg={{ span: 8, order: 1 }}>
                      <div className='point-board web-view text-center'>
                        <h2 className='custom-title'>
                          {match
                            ? `${match.homeTeam.name} vs ${match.awayTeam.name}`
                            : ''}
                          <Link
                            className='custom-btn'
                            href={`/${MATCH_CONTEST_ROUTE}matchId=${matchId}`}
                          >
                            Join Contest
                          </Link>
                          {selectedPlayers?.goalKeeper?.length > 0 && (
                            <Link
                              className='custom-btn'
                              href={`/${PLAYERS_ROUTE}?matchId=${matchId}&squadId=${selectedSquad}`}
                            >
                              Update Team
                            </Link>
                          )}
                        </h2>
                        <div className='spacer-20' />
                        <div className='total-panel'>
                          <ul>
                            <li>
                              <p>Rank</p>
                              <h5>0</h5>
                            </li>
                            <li>
                              <p>Total Points</p>
                              <h3>0</h3>
                            </li>
                            {/* <li>
                              <p>Transfers</p>
                              <h5>0</h5>
                            </li> */}
                          </ul>
                        </div>
                      </div>

                      <PlayerGround
                        selectedPlayers={selectedPlayers}
                        teamFormation={teamFormation}
                        substitution={substitution}
                        // setSelectedPlayers={setSelectedPlayers}
                      />
                      {/* <div className='text-center'>
                        <div className='player-game-section'>
                          <div className='ground'>
                            <ul className='ground-match-list'>
                              <li>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                              </li>
                              <li>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>{' '}
                              </li>
                              <li>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                              </li>
                              <li>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                                <div className='img-pnl'>
                                  <Image src={player} alt='player' />
                                  <h6>
                                    john Doe
                                    <span>56</span>
                                  </h6>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className='goal-postition-pnl'>
                            <ul>
                              <li>
                                <h3>Goalkeeper</h3>
                                <div className='goal-playe-post'>
                                  <Image src={shirt5} alt='shirt5' />
                                  <h5>John Doe</h5>
                                  <h6>145</h6>
                                </div>
                              </li>
                              <li>
                                <h3>Defender</h3>
                                <div className='goal-playe-post'>
                                  <Image src={shirt5} alt='shirt5' />
                                  <Image src={user} alt='Icon' />
                                </div>
                              </li>
                              <li>
                                <h3>Defender</h3>
                                <div className='goal-playe-post'>
                                  <Image src={shirt5} alt='shirt5' />
                                  <Image src={user} alt='Icon' />
                                </div>
                              </li>
                              <li>
                                <h3>Midfielder</h3>
                                <div className='goal-playe-post'>
                                  <Image src={shirt5} alt='shirt5' />
                                  <h5>John Doe</h5>
                                  <h6>145</h6>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div> */}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Footer */}
      {/* Footer */}
    </>
  );
}
