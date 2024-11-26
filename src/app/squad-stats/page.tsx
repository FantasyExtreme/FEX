'use client';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import NavBar from '@/components/Components/NavBar';
import Footer from '@/components/Components/Footer';
import Playeraccordian from '@/components/Components/PlayerAccordian';
import shirt5 from '../../assets/old-images/Batch/Shirt-5.png';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { makeFantasyFootballActor } from '@/dfx/service/actor-locator';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import {
  convertMotokoObject,
  convertSquadPlayer,
} from '@/components/utils/convertMotokoObject';
import logger from '@/lib/logger';
import { date, object, string, number } from 'yup';
import { Nav, Navbar, NavDropdown, Spinner, Modal } from 'react-bootstrap';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
  FormikHelpers,
  useFormikContext,
} from 'formik';
import {
  MAX_NAME_CHARACTERS,
  MIN_NAME_CHARACTERS,
  ONLY_ALPHABET,
} from '@/constant/validations';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { usePathname, useRouter } from 'next/navigation';
import { STANDING_ROUTE } from '@/constant/routes';
import {
  FORMATIONS_AND_SUBSTITUTION,
  MAX_PLAYERS,
  Positions,
  initialPlayers,
} from '@/constant/fantasticonst';
import {
  getPlayers,
  groupPlayersByRole,
  isConnected,
  refinePlayer,
  refineSquad,
} from '@/components/utils/fantasy';
import PlayerGround from '@/components/Components/PlayerGround';
import { fromNullable } from '@dfinity/utils';
import RingLoader from 'react-spinners/RingLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import { GroupedPlayers, Player } from '@/types/fantasy';

export default function SquadStats() {
  const urlparama = useSearchParamsHook();
  const path = usePathname();
  const searchParams = new URLSearchParams(urlparama);
  const squadId = searchParams.get('squadId');
  const [players, setPlayers] = useState<GroupedPlayers>();
  const [count, setCount] = useState<any>();
  const [squad, setSquad] = useState<any>();
  const [specialPlayers, setSpecialPlayers] = useState({
    cap: '',
    viceCap: '',
  });

  const [selectedPlayers, setSelectedPlayers] =
    useState<GroupedPlayers>(initialPlayers);
  const [teamFormation, setTeamFormation] = useState({
    goalKeeper: 1,
    defender: 3,
    midfielder: 4,
    forward: 3,
  });
  const navigation = useRouter();
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const [substitution, setSubstitution] = useState({
    goalKeeper: 1,
    defender: 2,
    midfielder: 1,
    forward: 0,
  });

  const togglePlayerSelection = (player: Player, skipFilteer?: boolean) => {
    logger({ player, selectedPlayers }, 'did aaaaa');
    if (
      selectedPlayers?.all?.find((p) => {
        return p.id == player.id;
      })
    ) {
      if (skipFilteer) return;
      const filteredAllPlayers = selectedPlayers.all.filter((p) => {
        return p.id != player.id;
      });
      if (player.positionString == Positions.goalKeeper) {
        const filteredgoalKeeperPlayers = selectedPlayers.goalKeeper.filter(
          (p) => {
            return p.id != player.id;
          },
        );
        setSelectedPlayers({
          ...selectedPlayers,
          goalKeeper: filteredgoalKeeperPlayers,
          all: filteredAllPlayers,
        });
      } else if (player.positionString == Positions.defender) {
        const filtereddefenderPlayers = selectedPlayers.defender.filter((p) => {
          return p.id != player.id;
        });
        setSelectedPlayers({
          ...selectedPlayers,
          defender: filtereddefenderPlayers,
          all: filteredAllPlayers,
        });
      } else if (player.positionString == Positions.midfielder) {
        const filteredmidfielderPlayers = selectedPlayers.midfielder.filter(
          (p) => {
            return p.id != player.id;
          },
        );
        setSelectedPlayers({
          ...selectedPlayers,
          midfielder: filteredmidfielderPlayers,
          all: filteredAllPlayers,
        });
      } else if (player.positionString == Positions.forward) {
        const filteredforwardPlayers = selectedPlayers.forward.filter((p) => {
          return p.id != player.id;
        });
        setSelectedPlayers({
          ...selectedPlayers,
          forward: filteredforwardPlayers,
          all: filteredAllPlayers,
        });
      }

      // setSelectedPlayers({ ...selectedPlayers, all: filteredSelectedPlayers });
    } else {
      const newAllPlayers = selectedPlayers.all;
      newAllPlayers.push(player);
      logger('did aaaaa TRUEEEE');

      if (player.positionString == Positions.goalKeeper) {
        if (
          selectedPlayers.goalKeeper.length >=
          teamFormation.goalKeeper + substitution.goalKeeper
        ) {
          newAllPlayers.pop();
          return;
        }
        logger(player, 'DIS DA PLAYER WE ADDING OK?');
        const newgoalKeeperPlayers = selectedPlayers.goalKeeper;
        newgoalKeeperPlayers.push(player);

        setSelectedPlayers({
          ...selectedPlayers,
          all: newAllPlayers,
          goalKeeper: newgoalKeeperPlayers,
        });
      } else if (player.positionString == Positions.defender) {
        if (
          selectedPlayers.defender.length >=
          teamFormation.defender + substitution.defender
        ) {
          newAllPlayers.pop();
          return;
        }
        const newdefenderPlayers = selectedPlayers.defender;
        newdefenderPlayers.push(player);

        setSelectedPlayers({
          ...selectedPlayers,
          all: newAllPlayers,
          defender: newdefenderPlayers,
        });
      } else if (player.positionString == Positions.midfielder) {
        if (
          selectedPlayers.midfielder.length >=
          teamFormation.midfielder + substitution.midfielder
        ) {
          newAllPlayers.pop();
          return;
        }
        const newmidfielderPlayers = selectedPlayers.midfielder;
        newmidfielderPlayers.push(player);

        setSelectedPlayers({
          ...selectedPlayers,
          all: newAllPlayers,
          midfielder: newmidfielderPlayers,
        });
      } else if (player.positionString == Positions.forward) {
        if (
          selectedPlayers.forward.length >=
          teamFormation.forward + substitution.forward
        ) {
          newAllPlayers.pop();
          return;
        }
        const newforwardPlayers = selectedPlayers.forward;
        newforwardPlayers.push(player);
        setSelectedPlayers({
          ...selectedPlayers,
          all: newAllPlayers,
          forward: newforwardPlayers,
        });
      }
    }
  };

  function handleFormationSelect(
    formmat: typeof teamFormation,
    subs: typeof substitution,
  ) {
    setTeamFormation(formmat);
    setSubstitution(subs);
  }

  function resetPlayers() {
    setSelectedPlayers({
      all: [],
      goalKeeper: [],
      defender: [],
      midfielder: [],
      forward: [],
    });
  }

  async function fetchSquad() {
    const resp: any = fromNullable(await auth.actor.getPlayerSquad(squadId));
    const _squad = refineSquad(resp);
    // resetPlayers();
    if (_squad) {
      _squad.players = _squad?.players?.map((player: any) => {
        let newPlayer = refinePlayer(player);
        togglePlayerSelection(newPlayer, true);
        return newPlayer;
      });
      setSquad(_squad);
    }
  }

  useEffect(() => {
    if (isConnected(auth.state) && squadId) {
      fetchSquad();
    }
  }, [squadId, auth]);
  useEffect(() => {
    if (players?.goalKeeper && players?.goalKeeper?.length >= 0) {
      // fetchSquad();
    }
  }, [players]);
  useEffect(() => {
    logger(selectedPlayers, 'selected');
  }, [selectedPlayers]);
  useEffect(() => {
    resetPlayers();
  }, []);

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
                      <div className='point-board mobile-view'>
                        <h2>Dani</h2>
                        <h6>@CarlaShallFight</h6>
                        <div className='total-panel'>
                          <ul>
                            <li>
                              <p>Budget</p>
                              <h3>100</h3>
                            </li>
                            <li>
                              <p>Selected Players</p>
                              <h5>0</h5>
                            </li>
                            {/* <li>
                              <p>Highest </p>
                              <h5>85555</h5>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                      <div className='player-selection-panel'>
                        <h4>
                          Squad <span>Stats</span>
                        </h4>
                        <Button className='gradient-btn mb-4'>
                          {count ? count?.all : '---'} Players Shown
                        </Button>
                      </div>
                    </Col>
                    <Col xl={{ span: 8, order: 1 }} lg={{ span: 8, order: 1 }}>
                      <div className='point-board web-view'>
                        <div className='custom-title align-items-center my-2'>
                          <h2>{squad?.name ?? ''}</h2>
                          {/* <h2>{userAuth?.name}</h2> */}
                          {/* <h6>@{userAuth?.name}</h6> */}
                          {/* <Link
                            className='custom-btn'
                            href={`/${STANDING_ROUTE}?matchId=${matchId}`}
                          >
                            My Teams
                          </Link> */}
                        </div>
                        <div className='total-panel'>
                          <ul>
                            <li>
                              <p>Points</p>
                              <h3>{squad?.points}</h3>
                            </li>
                            <li>
                              <p>Selected Players</p>
                              <h3>{selectedPlayers.all.length}</h3>
                            </li>
                            {/* <li>
                              <p>Highest points</p>
                              <h5>85555</h5>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                      <div className='spacer-20' />
                      <div className='format-btn-cntnr'>
                        <Form.Label>Player Formation</Form.Label>
                        <div className='flex-div-xs'>
                          <Dropdown>
                            <Dropdown.Toggle disabled id='dropdown-basic'>
                              {`${teamFormation.defender}-${teamFormation.midfielder}-${teamFormation.forward}`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {FORMATIONS_AND_SUBSTITUTION?.map(
                                ({ formation, substitution }, i) => {
                                  return (
                                    <Dropdown.Item
                                      key={i}
                                      onClick={() =>
                                        handleFormationSelect(
                                          formation,
                                          substitution,
                                        )
                                      }
                                    >
                                      {`${formation.defender}-${formation.midfielder}-${formation.forward}`}
                                    </Dropdown.Item>
                                  );
                                },
                              )}
                            </Dropdown.Menu>{' '}
                          </Dropdown>
                          <ul>
                            {/* <li>
                              <Button
                                onClick={resetPlayers}
                                className='reg-btn trans'
                              >
                                Reset
                              </Button>
                            </li>
                            <li>
                              <Button
                                onClick={squadId ? () => saveTeam({name:squad?.name}) : handleShowModal}
                                disabled={saving}
                                className='reg-btn white'
                              >
                               {saving ? 
                               <PulseLoader size={10} />:
                                squadId ? 'Update Team' : 'Save Team'
                               }
                              </Button>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                      {selectedPlayers ? (
                        <PlayerGround
                          selectedPlayers={selectedPlayers}
                          teamFormation={teamFormation}
                          substitution={substitution}
                          // setSelectedPlayers={setSelectedPlayers}
                        />
                      ) : null}
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
