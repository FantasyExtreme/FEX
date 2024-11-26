'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import calculatoricon from '@/assets/images/icons/calculator.png';
import rankingicon from '@/assets/images/icons/rankingicon.png';
import iconhome from '@/assets/images/icons/icon-home.png';
import iconfootball from '@/assets/images/icons/icon-football.png';
import iconuser from '@/assets/images/icons/usericon.png';
import {
  DASHBOARD_ROUTE,
  FANTASY_PLAYER_ROUTE,
  GAMEPLAYRULES_ROUTE,
  MATCHES_ROUTE,
} from '@/constant/routes';
import { Nav } from 'react-bootstrap';
import ConnectModal from './ConnectModal';
import { isConnected } from '../utils/fantasy';
import { useRouter } from 'next/navigation';

export default function BottomNav({
  handleShowROI,
  location,
  auth
}: {
  handleShowROI: any;
  location: string;
  auth:any
}) {
  const [showConnect, setShowConnect] = useState(false);

  function handleShowConnect() {
    setShowConnect(true);
  }
  function handleHideConnect() {
    setShowConnect(false);
  }
  const router = useRouter();
  return (
    <>
      <ul className='Bottom-nav'>
        <li className={`${location == MATCHES_ROUTE && 'active'}`}>
          <Nav.Link as={Link} href={MATCHES_ROUTE}>
            <Image src={iconfootball} alt='Icon Ball'  style={{ height: '35px', width: '34px' }} />
          </Nav.Link>
        </li>
        <li className={`${location == DASHBOARD_ROUTE && 'active'}`}>
          <Nav.Link as={Link} href={DASHBOARD_ROUTE} onClick={(e)=>{
            e.preventDefault();
            if(isConnected(auth.state)){
              router.push(DASHBOARD_ROUTE)
            }else{

              handleShowConnect()
            }
          }}>
            <Image
              src={iconuser}
              alt='Icon USER'
              style={{ height: '35px', width: '43px' }}
            />
          </Nav.Link>
        </li>
        <li className={`${location == '/' && 'active'}`}>
          <Nav.Link as={Link} href='/'>
            <Image src={iconhome} alt='Icon Home' style={{ height: '35px', width: '35px' }}/>
          </Nav.Link>
        </li>
        <li>
          <Nav.Link
            as={Link}
            href='/'
            onClick={(e) => {
              e.preventDefault();
              handleShowROI();
            }}
          >
            <Image src={calculatoricon} alt='calculatoricon' style={{ height: '35px', width: '43px' }} />
          </Nav.Link>
        </li>
        <li className={`${location == FANTASY_PLAYER_ROUTE && 'active'}`}>
          <Nav.Link
            as={Link}
            href={FANTASY_PLAYER_ROUTE}
            active={location == FANTASY_PLAYER_ROUTE}
          >
            <Image src={rankingicon} alt='rankingicon ' style={{ height: '35px', width: '34px' }} />
          </Nav.Link>
        </li>
      </ul>
      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={() => {  router.push(DASHBOARD_ROUTE)}}
      />
    </>
  );
}
