'use client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useRouter } from 'next/navigation';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import BeatLoader from 'react-spinners/BeatLoader';
import { getContests, isConnected } from '@/components/utils/fantasy';
import Contest from '@/components/Components/Contest';
import axios from 'axios';
import { toast } from 'react-toastify';
import PulseLoader from 'react-spinners/PulseLoader';
import logger from '@/lib/logger';
import Tippy from '@tippyjs/react';

export default function UploadLeague() {
  const [leagueId, setLeagueId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [airdropInfoLoading, setAirdropInfoLoading] = useState(false);


  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));

  const navigation = useRouter();
  const updateLeague = async () => {
    if (!leagueId) {
      return toast.error('please add a league id');
    }
    setLoading(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: ``,
    };

    try {
      const response = await axios.request(config);
    } catch (error) {
      logger(
        { leagueId, error },
        'Error fetching league details for leagueId:',
      );
      return null; // Return null in case of error
    }
    setLoading(false);
  };

  /**
   * Handles the transfer process for the given league ID.
   *
   */

  const handleTransfers = async () => {
    if (!leagueId) {
      return toast.error('please add a league id');
    }
    setLoading(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_URL}uploadTransfer?leagueId=${leagueId}`,
    };

    try {
      const response = await axios.request(config);
      toast.success('Transfers added successfully');
      setLoading(false);
    } catch (error) {
      toast.error('Error during transfers');
      setLoading(false);
      logger({ leagueId, error }, 'Error transfering:');
      return null; // Return null in case of error
    }
  };


  useEffect(() => {
    if (isConnected(auth.state)) {
      if (!userAuth.userPerms?.admin) {
        navigation.replace('/');
      }else{
      
      }
    }
  }, [auth.state]);

  return (
    <>
      {userAuth.userPerms?.admin && (
        <Container fluid className='inner-page'>
          <Row>
            <Container>
            
            
            <div className='spacer-30'/>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <div className='gray-panel'>
                    <h4 className='animeleft d-flex justify-content-between whitecolor Nasalization fw-normal'>
                      <span>Manage League and Transfers</span>
                      {/* <Button
                        // onClick={handleShowModal}
                        className='reg-btn mid text-capitalize'
                      >
                        Create Contest
                      </Button> */}
                    </h4>
                    <div className='d-flex'>
                      <input
                        value={leagueId}
                        onChange={(e) => setLeagueId(e.target.value)}
                        placeholder='League Id'
                        className='p-2'
                      />
                      <Button
                        disabled={loading}
                        className='reg-btn ms-3'
                        onClick={updateLeague}
                        id='updateLeague'
                      >
                        {loading ? <PulseLoader size={10} /> : 'Add'}
                      </Button>
                      <Tippy content='Handle transfers from 8th of August 2024 to today'>
                        <Button
                          disabled={loading}
                          className='reg-btn ms-3'
                          onClick={handleTransfers}
                          id='updateLeague'
                        >
                          {loading ? (
                            <PulseLoader size={10} />
                          ) : (
                            'Handle Transfers'
                          )}
                        </Button>
                      </Tippy>
                    </div>
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
