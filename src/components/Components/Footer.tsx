'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import powerimg from '@/assets/images/footer-infinix.png';
import footerammaglogo from '@/assets/images/footer-ammag-logo.png';

import {
  AMMAG_LINK,
  CONTACT_US_ROUTE,
  FANTASY_PLAYER_ROUTE,
  GAMEPLAYRULES_ROUTE,
  MATCHES_ROUTE,
} from '@/constant/routes';

export default function Footer() {
  const [isVisible3, setIsVisible3] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('Footer');
      const rect = element?.getBoundingClientRect();
      if (!rect) return;
      const isVisible3 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible3) {
        setIsVisible3(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* <Container
        fluid
        id='Footer'
        className={isVisible3 == true ? 'animate footer' : 'footer'}
      >
        <div>
          <div className="d-flex justify-content-center align-items-center footer-text">
            <Link className='footer-logo' href='/'>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/logo/footer-logo.png'
                alt='logo'
                width={700}
              />
            </Link>
          </div>

          <h4 className='text-center text-white Nasalization foter-text '>
            Fantasy <span>Extreme</span>
          </h4>
        </div>


        <Row>
          <Col xxl='12' xl='12' lg='12' md='12'>
            <ul className='footer-list'>
              <li>
                <Link href={MATCHES_ROUTE}>Matches</Link>
              </li>
              <li>
                <Link href={FANTASY_PLAYER_ROUTE}>Players</Link>
              </li>
              <li>
                <Link href={MATCHES_ROUTE}>Leagues</Link>
              </li>
              <li>
                <Link href={GAMEPLAYRULES_ROUTE}>Gameplay Rules</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <Container
        style={{ borderTop: "1px solid #FFFFFF33" }}
        fluid
        id='Footer'
        className={isVisible3 == true ? 'animate footer' : 'footer'}
      >
        <Row>
          <Container>
            <Row>
              <Col xl='12'>
                <div className="flex-div-xs align-items-center">
                  <p className='m-0'>Copyright ©2024 Fantasy extreme All rights reserved.</p>
                  <Image src={iconICPpowerd} width={250} height={27} alt="iconICPpowerd" />
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container> */}

      <Container
        fluid
        id='Footer'
        className={isVisible3 == true ? 'animate footer' : 'footer'}
      >
        <Row>
          <Container>
            <Row>
              <Col xxl='12' xl='12' lg='12' md='12'>
                <Link className='footer-logo' href='/'>
                  <img
                    src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/logo/footer-logo.png'
                    alt='logo'
                  />
                </Link>
                <h3>
                  <span>Fantasy</span> Extreme
                </h3>
                <ul className='footer-list'>
                  <li>
                    <Link href={MATCHES_ROUTE}>Match</Link>
                  </li>
                  <li>
                    <Link href={FANTASY_PLAYER_ROUTE}>Players</Link>
                  </li>
                  <li>
                    <Link href={MATCHES_ROUTE}>Leagues</Link>
                  </li>
                  <li>
                    <Link href={GAMEPLAYRULES_ROUTE}>Gameplay Rules</Link>
                  </li>
                  {/* <li>
                    <Link href={CONTACT_US_ROUTE}>Contact Us</Link>
                  </li> */}
                </ul>
                <h6>100% on Chain</h6>
              </Col>
            </Row>
          </Container>
        </Row>
        <div className='footer-bottom'>
          <Container>
            <Col xl='12' lg='12' md='12'>
              <div className='flex-align-panel'>
              <Link href={AMMAG_LINK}>
                 <Image src={footerammaglogo} alt='Ammag' />
                </Link>
                <p>Copyright ©2024 Fantasy extreme All rights reserved.</p>
                <Image src={powerimg} alt='Footer Logo' />
              </div>
            </Col>
          </Container>
        </div>
      </Container>
    </>
  );
}
