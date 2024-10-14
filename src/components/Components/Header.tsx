'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  Button,
  Container,
  Row,
  Table,
  Spinner,
} from 'react-bootstrap';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { PLAYERS_ROUTE } from '@/constant/routes';
import logger from '@/lib/logger';
import BeatLoader from 'react-spinners/BeatLoader';
import { requireAuth } from '../utils/fantasy';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import UpcomingMatches from './UpcomingMatches';
import icontwitter from '@/assets/images/icons/icon-twitter.png';
import icondiscord from '@/assets/images/icons/icon-discord.png';
import icontelegram from '@/assets/images/icons/icon-telegram.png';
import iconfb from '@/assets/images/icons/icon-facebook.png';
import iconinstagram from '@/assets/images/icons/icon-instagram.png';
import icontiktok from '@/assets/images/icons/icon-tiktok.png';
import iconlinkedin from '@/assets/images/icons/icon-linkedin.png';
export default function Header({ match }: { match?: any }) {
  const navigation = useRouter();

  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  return (
    <>
      {/* Header */}
      <Container fluid className='header'>
        {/* Carousle */}
        <Carousel fade>
          <Carousel.Item>
            <div className='bg-layer' />
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
          </Carousel.Item>
        </Carousel>
        <UpcomingMatches />
      </Container>
      {/* Header */}
    </>
  );
}
