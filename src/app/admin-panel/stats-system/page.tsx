'use client';
import React, { useEffect, useState, useTransition } from 'react';

import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ConnectPlugWalletSlice } from '@/types/store';

import {
  isConnected,
} from '@/components/utils/fantasy';
import PointsEditor from '@/components/Components/PointsEditor';

import { Points } from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';

export default function StatsSystem() {

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
                     
                    </h4>

                    <div className='spacer-30' />
                    {stats && (
                      <PointsEditor actor={auth.actor} points={stats} />
                    )}

                   
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
