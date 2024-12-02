'use client';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '@/components/Components/Header';
import { makeFantasyFootballActor } from '@/dfx/service/actor-locator';
import FantasyPlayers from '@/components/Components/FantasyPlayers';
import LatestResult from '@/components/Components/LatestResult';
import moment from 'moment';
import { utcToLocal } from '@/components/utils/utcToLocal';
import { MATCHES_ROUTE, PLAYERS_ROUTE } from '@/constant/routes';
import freeicon from '@/assets/images/icons/icon-free.png'; 
import bronzeicon from '@/assets/images/icons/icon-bronze.png';
import goldicon from '@/assets/images/icons/icon-gold.png';
import coinicon from '@/assets/images/icons/coin-icon.png';
import tethericon from '@/assets/images/icons/tether-icon.png';
import { useRouter } from 'next/navigation';
import { getTeam } from '@/components/utils/fantasy';
import logger from '@/lib/logger';
import BarLoader from 'react-spinners/BarLoader';
import { isConnected, requireAuth } from '@/components/utils/fantasy';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useAuthStore } from '@/store/useStore';
import { QURIES } from '@/constant/variables';
import Image from 'next/image';
import MVPSlider from '../components/Components/MVPSlider';
import VideoLink from '@/components/Components/VideoLink';
import BillionInfo from '@/components/Components/BillionInfo';
import HowItWorksList from '@/components/Components/HowItWorksList';
import HowItWorksSlider from '@/components/Components/HowItWorksSlider';
import useSearchParamsHook from '@/components/utils/searchParamsHook';

export default function HomePage() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const communityId = searchParams.get(QURIES.communityId);

  // Scroll ANimation  MatchResult
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('MatchResult');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // Scroll ANimation  MatchResult

  // Scroll ANimation  howtoplaypnl
  const [isVisible1, setIsVisible1] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('howtoplaypnl');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible1 = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible1) {
          setIsVisible1(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // Scroll ANimation  howtoplaypnl

  // Scroll ANimation  winnermp
  const [isVisible2, setIsVisible2] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('winnermp');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible2 = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible2) {
          setIsVisible2(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // Scroll ANimation  winnermp

  // Scroll ANimation  History
  const [isVisible3, setIsVisible3] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('History');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible3 = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible3) {
          setIsVisible3(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // Scroll ANimation  History

  // Scroll ANimation  Fantasy
  const [isVisible4, setIsVisible4] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('Fantasy');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible4 = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible4) {
          setIsVisible4(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const [isVisible5, setIsVisible5] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('Demo');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible5 = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible5) {
          setIsVisible5(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // useEffect(() => {
  //  if(refferalId){
  //   localStorage.setItem("refferalId",refferalId)

  //  }
  // }, [refferalId]);
  useEffect(() => {
    if(communityId){
     localStorage.setItem("communityId",communityId)
 
    }
   }, [communityId]);
  // Scroll ANimation  Fantasy
  return (
    <>
      {/* Header Panel */}
      <Header />

      {/* Demo Panel */}
      <Container
        fluid
        id='Demo'
        // ref={scrollToDemo}
        className={isVisible5 == true ? 'animate demo' : 'demo'}
      >
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='text-center'>
                  <h2>Demo</h2>
                  <p className='m-0 text-white'>
                    Click to watch the complete demo and experience the thrill
                    of strategic team management in Fantasy Extreme—where every
                    decision counts!
                  </p>
                  {/* Video */}
                  <VideoLink />
                  {/* Video */}
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Demo Panel */}

      {/* How It Works */}
      <Container
        fluid
        id='howtoplaypnl'
        className={
          isVisible1 == true ? 'animate how-to-play-pnl' : 'how-to-play-pnl'
        }
      >
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='text-center'>
                  <h2>
                    HOW IT <span>WORKS</span>
                  </h2>
                </div>
                <HowItWorksList />
                <div className='HowtoPlaySlider'>
                  <HowItWorksSlider />
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* How It Works */}

      {/* History Panel */}
      <Container
        fluid
        id='History'
        className={
          isVisible3 == true ? 'animate history-panel' : 'history-panel'
        }
      >
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='text-panel'>
                  <div className='bg-layer' />
                  <h3 className='text-uppercase'>Our History</h3>
                  <h2>
                    About <span>Fantasy</span>
                  </h2>
                  <p>
                    Take your love for soccer to the next level with fantasy
                    football. Build your own virtual dream team by drafting real
                    footballers. Their performances on the pitch - goals scored,
                    assists made, clean sheets kept - translate into points for
                    your team. You'll compete against friends or online leagues,
                    strategizing your picks, managing injuries, and watching
                    your team rack up. It's a fun and engaging way to experience
                    the beautiful game, combining the thrill of real-world
                    soccer with the challenge of building and managing your own
                    champion squad.
                  </p>
                  <div className='mobile-view-center'>
                  <Link href={MATCHES_ROUTE} className='reg-btn mid'>
                    Play Now
                  </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* History Panel */}

      {/* Latest Result Panel */}
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
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='text-center'>
                  <h2>
                    Latest <span>Results</span>
                  </h2>
                </div>
                <div className='spacer-30' />
                <LatestResult />
                <div className='spacer-10' />
                <div className='flex-div justify-content-end'>
                  <Link
                    href={`${MATCHES_ROUTE}?${QURIES.matchTab}=2`}
                    className='simple-link'
                  >
                    View All <i className='fa fa-arrow-right' />
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Latest Result Panel */}

      {/* Top Fantasy Player */}
      <Container
        fluid
        id='Fantasy'
        className={
          isVisible4 == true
            ? 'animate top-fantasy-panel pb-0'
            : 'top-fantasy-panel pb-0'
        }
      >
        <div className='bg-layer' />
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='flex-div'>
                  <h2>
                    Top Fantasy <span>Players</span>
                  </h2>
                  <Link className='simple-link mb-3' href='/fantasyplayer'>
                    View All{' '}
                    <i className='fa fa-arrow-right' aria-hidden='true'></i>
                  </Link>
                </div>
              </Col>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='spacer-50' />
              </Col>
              <FantasyPlayers />
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Top Fantasy Player */}

      {/* Winners MPVs Panel */}
      <Container
        fluid
        id='winnermp'
        className={`${isVisible2 == true ? 'animate' : ''} winner-mp winner-mvpscls mb-5`}
      >
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='text-center'>
                  <h2>
                    WINNERS <span>& Man of the match</span>
                  </h2>
                </div>
                <div className='spacer-10' />
                <div className='mvpsMain'>
                  <MVPSlider />
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Winners MPVs Panel */}

      {/* Market Value */}
      <Container fluid id='MarketValue' className='market-value'>
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='text-center'>
                  <h2>
                    Market <span>Value</span>
                  </h2>
                  <p className='whitecolor'>
                    Fantasy Extreme is poised for continuous growth by
                    attracting millions of passionate players and fans
                    worldwide. See the explosive growth of fantasy sports below
                  </p>
                  <div className='spacer-30' />
                </div>
                <div className='text-right'>
                  <h2>4 Billion People</h2>
                </div>
                <BillionInfo />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Market Value */}
    </>
  );
}
