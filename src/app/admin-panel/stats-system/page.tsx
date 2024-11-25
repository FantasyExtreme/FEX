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
  Stats,
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
import { toast } from 'react-toastify';
import PointsEditor from '@/components/Components/PointsEditor';
import { Points } from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';

export default function StatsSystem() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const navigation = useRouter();
  const [stats, setStats] = useState<Points | null>(null);

  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  async function getStats() {
    const resp = await auth.actor.getStatsSystem();
    setStats(resp);
  }
  useEffect(() => {
    if (!isConnected(auth.state)) return;
    getStats();
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
                      <span>Stats System</span>
                      {/* <Button
                        // onClick={handleShowModal}
                        className='reg-btn mid text-capitalize'
                      >
                        Create Contest
                      </Button> */}
                    </h4>

                    <div className='spacer-30' />
                    {stats && (
                      <PointsEditor actor={auth.actor} points={stats} />
                    )}

                    {/* <Button
                      onClick={saveTeam}
                      disabled={!players || loading}
                      className='reg-btn trans-white mid text-capitalize mx-3'
                    >
                      {loading ? <Spinner size='sm' /> : 'Save'}
                    </Button> */}
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
