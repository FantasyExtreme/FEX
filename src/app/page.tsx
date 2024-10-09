'use client';
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import matchbg3 from '../assets/old-images/bg/bg-trans-3.png';
import team1 from '../assets/images/teams/team-bestfoot-club.png';
import team2 from '../assets/images/teams/team-soccer-club.png';


import Header from '@/components/Components/Header';
import { makeFantasyFootballActor } from '@/dfx/service/actor-locator';
import LatestResult from '@/components/Components/LatestResult';

import { useRouter } from 'next/navigation';

import { ConnectPlugWalletSlice } from '@/types/store';
import { useAuthStore } from '@/store/useStore';

export default function HomePage() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById('MatchResult');
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible) {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isVisible1, setIsVisible1] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById('History');
      const rect = element.getBoundingClientRect();
      const isVisible1 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible1) {
        setIsVisible1(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isVisible2, setIsVisible2] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById('Fantasy');
      const rect = element.getBoundingClientRect();
      const isVisible2 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible2) {
        setIsVisible2(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const fantasyFootball = makeFantasyFootballActor({});
  const navigation = useRouter();

  
  const [isVisible4, setIsVisible4] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById('Fantasy');
      const rect = element.getBoundingClientRect();
      const isVisible4 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible4) {
        setIsVisible4(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <>
      <Header />

      {/* matches Result Panel */}
      <Container
        fluid
        id='MatchResult'
        className={
          isVisible == true
            ? 'animate matches-result-panel'
            : 'matches-result-panel'
        }
      >
        <Row>
          <Container>
            <Row className='d-flex flex-column '>
              <Col xl='8' lg='8' md='12' sm='12'>
                <div className='flex-div-xs'>
                  <h4 className='text-white'>Latest Result</h4>
             
                </div>
                <div className='spacer-20' />
              
              </Col>
              <Col  sm='12'>
                <LatestResult />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* matches Result Panel */}

      {/* History Panel */}
      <Container
        fluid
        id='History'
        className={
          isVisible1 == true ? 'animate history-panel' : 'history-panel'
        }
      >
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12' className='text-white'>
                <h3>Our History</h3>
                <h2>
                  About <span>Fantasy</span>
                </h2>
                <p>
                  Take your love for soccer to the next level with fantasy
                  football,Build your own virtual dream team by drafting real
                  footballers. Their performances on the pitch - goals scored,
                  assists made, clean sheets kept - translate into points for
                  your team. You'll compete against friends or online leagues,
                  strategizing your picks, managing injuries, and watching your
                  team rack up. It's a fun and engaging way to experience the
                  beautiful game, combining the thrill of real-world soccer with
                  the challenge of building and managing your own champion
                  squad.
                </p>
                <Link href='#' className='reg-btn mid'>
                  About More <i className='fa fa-arrow-right' />
                </Link>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* History Panel */}

      {/* Top Fantasy Player */}
    
      {/* Top Fantasy Player */}
    </>
  );
}
