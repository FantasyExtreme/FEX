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

export default function Header({ match }: any) {
  const navigation = useRouter();

  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  return (
    <>
      <Container fluid className='header'>
        <Carousel fade>
          <Carousel.Item>
            <div className='bg-layer' />
            <div className='text-panel'>
              <div className='text-inner'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nisl non tortor
                  viverra suspendisse feugiat magna fames.
                </p>
                <Button className='reg-btn mid'>Play Now</Button>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
            <div className='text-panel'>
              <div className='text-inner'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nisl non tortor
                  viverra suspendisse feugiat magna fames.
                </p>
                <Link href='#' className='reg-btn mid'>
                  Play Now
                </Link>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
            <div className='text-panel'>
              <div className='text-inner'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nisl non tortor
                  viverra suspendisse feugiat magna fames.
                </p>
                <Button className='reg-btn mid'>Play Now</Button>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
            <div className='text-panel'>
              <div className='text-inner'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nisl non tortor
                  viverra suspendisse feugiat magna fames.
                </p>
                <Button className='reg-btn mid'>Play Now</Button>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
            <div className='text-panel'>
              <div className='text-inner'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nisl non tortor
                  viverra suspendisse feugiat magna fames.
                </p>
                <Button className='reg-btn mid'>Play Now</Button>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
            <div className='text-panel'>
              <div className='text-inner'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nisl non tortor
                  viverra suspendisse feugiat magna fames.
                </p>
                <Button className='reg-btn mid'>Play Now</Button>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className='bg-layer' />
            <div className='text-panel'>
              <div className='text-inner'>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Nisl non tortor
                  viverra suspendisse feugiat magna fames.
                </p>
                <Button className='reg-btn mid'>Play Now</Button>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>
      <UpcomingMatches />
    </>
  );
}
