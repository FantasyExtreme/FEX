'use client';
import React, { useEffect, useState, useTransition } from 'react';

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
} from 'react-bootstrap';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  Contest,
  GroupedContest,
  GroupedContests,
  GroupedPlayers,
  Player,
  Team,
  TournamentType,
} from '@/types/fantasy';
import {
  getContests,
  getPlayers,
  getTeamsByTournament,
  getTournaments,
  isConnected,
} from '@/components/utils/fantasy';
import { DEAFULT_PROPS, QueryParamType } from '@/constant/variables';
import ContestRow from '@/components/Components/ContestRow';
import JoinContest from '@/components/Components/JoinContest';
import RankingModal from '@/components/Components/Ranking';
import { toast } from 'react-toastify';

export default function PlayerPoints() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const [tournaments, setTournaments] = useState<TournamentType | null>(null);
  const [selected, setSelected] = useState({
    team: null,
    tournament: null,
  });
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [defaultPrice, setDefaultPrice] = useState(6);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState<any>();
  const navigation = useRouter();

  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  /**
   * Select a tournament to get teams of that tournament
   *
   * @param  tournamentId - description of tournamentId parameter
   * @return description of return value
   */
  function selectTournament(tournamentId: string) {
    getTeamsByTournament(auth.actor, tournamentId, setTeams);
  }
  /**
   * Select a team to get the player of that team
   *
   * @param  id - description of id parameter
   * @param  name - description of name parameter
   * @return  description of return value
   */
  function selectTeam({ id, name }: { id: string; name: string }) {
    getPlayers({
      auth: auth,
      setCount,
      setSinglePlayers: setPlayers,
      ids: [{ id, name }],
    });
  }
  /**
   * Change the price of a player.
   *
   * @param {number} price - The new price for the player
   * @param {string} playerId - The unique identifier of the player
   */
  function changePlayerPrice(price: number, playerId: string) {
    if (!players) return;
    if (price < 0) return;
    const newPlayers = players.map((player) => {
      if (player.id === playerId) {
        return { ...player, fantasyPrice: price };
      }
      return player;
    });
    setPlayers(newPlayers);
  }

  /**
   * A function that saves the team by updating player prices.
   */
  async function saveTeam() {
    if (!players) return;

    try {
      setLoading(true);
      const prices = players.map((player) => ({
        fantasyPrice: player.fantasyPrice,
        id: player.id,
      }));
      const resp = await auth.actor.updatePlayerPrices(prices);
      toast.success('Price update successfully');
    } catch (error) {
      toast.error('Error updating price');
    }
    setLoading(false);
  }

  /**
   * A function that updates all players of the team to have a default price.
   */
  function deaultTeamPrice() {
    if (!players) return;
    const newPlayers = players.map((player) => ({
      ...player,
      fantasyPrice: defaultPrice,
    }));
    setPlayers(newPlayers);
  }

  useEffect(() => {
    if (!isConnected(auth.state)) return;
    getTournaments(auth.actor, DEAFULT_PROPS, setTournaments);
  }, [auth]);

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
                      <span>Player Points</span>
                      {/* <Button
                        // onClick={handleShowModal}
                        className='reg-btn mid text-capitalize'
                      >
                        Create Contest
                      </Button> */}
                    </h4>

                    <div className='spacer-30' />
                    <div className='d-flex gap-5'>
                      <Form.Select
                        className='button-select large'
                        onChange={(e) => selectTournament(e.target.value)}
                      >
                        <option>Select Tournament</option>
                        {tournaments?.map(([id, tournament], i) => {
                          return (
                            <option key={id} value={id}>
                              {tournament.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Form.Select
                        className='button-select large'
                        onChange={(e) =>
                          selectTeam({
                            id: e.target.value.split(',')[0],
                            name: e.target.value.split(',')[1],
                          })
                        }
                      >
                        <option>Select Team</option>
                        {teams?.map((team, i) => {
                          return (
                            <option key={team.id} value={[team.id, team.name]}>
                              {team.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Button
                        id='deafult_price'
                        onClick={deaultTeamPrice}
                        disabled={!players || loading}
                        className='reg-btn trans-white mid text-capitalize mx-3'
                      >
                        Deafult Price
                      </Button>
                      <input
                        value={defaultPrice}
                        disabled={!players || loading}
                        onChange={(e) =>
                          setDefaultPrice(Number(e.target.value))
                        }
                        type='number'
                      />
                    </div>
                    <div className='spacer-30' />
                    <Table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players?.map((player, i) => (
                          <tr key={player.id}>
                            <td>{player.name}</td>
                            <td>{player.positionString}</td>
                            <td>
                              <input
                                type='number'
                                onChange={(e) =>
                                  changePlayerPrice(
                                    Number(e.target.value),
                                    player.id,
                                  )
                                }
                                value={player.fantasyPrice}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Button
                      onClick={saveTeam}
                      disabled={!players || loading}
                      className='reg-btn trans-white mid text-capitalize mx-3'
                    >
                      {loading ? <Spinner size='sm' /> : 'Save'}
                    </Button>
                  </div>
                </Col>
                <Col xl='12' lg='12' md='12'></Col>
              </Row>
            </Container>
          </Row>
        </Container>
      )}
    </>
  );
}
