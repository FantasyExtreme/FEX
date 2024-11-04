'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import iconusers from '../../assets/images/icons/icon-users.png';
import icontrophysmall from '../../assets/images/icons/icon-trophy-small.png';
import icongift from '../../assets/images/icons/icon-gift.png';
import { GetProps, TopPlayers } from '@/types/fantasy';
import { getTopplayers, sliceText } from '../utils/fantasy';
import {
  carouselDefaultSettings,
  TOP_FANTASY_PLAYERS_ITEMSPERPAGE,
} from '@/constant/variables';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import userImage from '@/assets/images/user3.png';
import { formatNumber } from '../utils/utcToLocal';
import CupSvg from '../Icons/CupSvg';
import { E8S } from '@/constant/fantasticonst';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
export default function FantasyPlayers() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const [topPlayers, setPlayers] = useState<TopPlayers[] | null>(null);

  const carouselSettings = {
    ...carouselDefaultSettings,
    arrows: false,
    autoPlay:false,
    infinite:false,
    responsive: {
      greater: {
        breakpoint: {
          max: 3000,
          min: 1400,
        },

        items: 4,
        partialVisibilityGutter: 40,
      },
      desktop: {
        breakpoint: {
          max: 1400,
          min: 991,
        },

        items: 3,
        partialVisibilityGutter: 40,
      },
      mobile: {
        breakpoint: {
          max: 464,
          min: 0,
        },
        items: 1,
        slidesToSlide: 1,
        partialVisibilityGutter: 30,
      },
      tablet: {
        breakpoint: {
          max: 991,
          min: 464,
        },
        items: 2,
        slidesToSlide: 2,
        partialVisibilityGutter: 30,
      },
    },
    slidesToSlide: 2,
  };

  const [topPlayersProps, setTopPlayersProps] = useState<GetProps>({
    page: 0,
    limit: TOP_FANTASY_PLAYERS_ITEMSPERPAGE,
    search: '',
    status: '',
  });
  const [totallCount, setTotallCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTopplayers(
      auth.actor,
      topPlayersProps,
      setPlayers,
      setLoading,
      setTotallCount,
    );
  }, [auth.state]);
  return (
    <>
      {topPlayers && topPlayers?.length != 0 && (
        <Carousel {...carouselSettings} className='fantasyPlayer'>
          {topPlayers &&
            topPlayers?.length != 0 &&
            topPlayers.map((player: TopPlayers, index: number) => {
              return (
                <div className='slide-padding' key={index}>
                  <Link className='player-post' href='/fantasyplayer'>
                    <div className='player-post-inner'>
                      <div className='img-pnl'>
                        <div className='infobox'>
                          <h3 className='text-center py-3'>
                            {sliceText(player?.name, 0, 9)}
                          </h3>
                          <div className='iconBox'>
                            <CupSvg />
                            <h6> Contest Won</h6>
                          </div>
                          <div>
                            <h2 className='text-center fs-70'>
                              {formatNumber(player?.contestWon)}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div className='userInfo'>
                        <h5>{sliceText(player?.name, 0, 11)}</h5>
                        <p>
                          {player?.userId?.slice(0, 10)}...
                          {player?.userId?.slice(-9)}
                        </p>
                      </div>
                      <div className='txt-pnl'>
                        <div className='txt-pnl-inner'>
                          <div className='spacer-80'></div>

                          <h6>
                            <b>
                              <img
                                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-users.png'
                                alt='users icon'
                              />{' '}
                              Participated:
                            </b>{' '}
                            <span>{formatNumber(player?.participated)}</span>
                          </h6>
                          <h6>
                            <b>
                              <img
                                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-trophy-small.png'
                                alt='icon trophy'
                              />{' '}
                              Contest Won:
                            </b>
                            <span>{formatNumber(player?.contestWon)}</span>
                          </h6>
                    
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
        </Carousel>
      )}
    </>
  );
}
