'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import logo from '../../assets/images/logo/logo.png';
export default function Footer() {
  const [isVisible3, setIsVisible3] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('Footer');
      const rect = element.getBoundingClientRect();
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
      <Container
        fluid
        id='Footer'
        className={isVisible3 == true ? 'animate footer' : 'footer'}
      >
        <div className='bg-layer' />
        <Row>
          <Container>
            <Row>
              <Col xl='3' lg='3' md='12'>
                <Image src={logo} alt='Logo' />
              </Col>
              <Col xl='6' lg='6' md='12'>
                <ul className='footer-list'>
                  <li>
                    <Link href='/upcomingmatches'>Matches</Link>
                  </li>
                  <li>
                    <Link href='#'>About us</Link>
                  </li>
                  <li>
                    <Link href='#'>Schedule</Link>
                  </li>
                  <li>
                    <Link href='/playerselection'>Players</Link>
                  </li>
                  <li>
                    <Link href='#'>The Club</Link>
                  </li>
                  <li>
                    <Link href='#'>Media</Link>
                  </li>
                  <li>
                    <Link href='#'>Member</Link>
                  </li>
                  <li>
                    <Link href='#'>Shop</Link>
                  </li>
                  <li>
                    <Link href='#'>News</Link>
                  </li>
                  <li>
                    <Link href='#'>Contact</Link>
                  </li>
                </ul>
              </Col>
              <Col
                xl='12'
                lg='12'
                md='12'
                className='footer-bottom text-center'
              >
                <p>
                  Copyright © 2010-2024 Fantasy extreme All rights reserved.
                </p>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </>
  );
}
