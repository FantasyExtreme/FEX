'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import player from '@/assets/images/playerr.png';

export default function Playerslider() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 992 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 991, min: 767 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
    },
  };
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };
  return (
    <>
      <Slider {...settings}>
        <div className='player-single-slide'>
          <div className='player-single-slide-inner'>
            <Image src={player} alt='Player' />
            <div className='player-info-panel'>
              <p>Name</p>
              <h3>Wang Guoming</h3>
              <div className='spacer-20' />
              <p>Team Name</p>
              <h3>Henan Jianye</h3>
              <ul>
                <li>
                  <p>Points</p>
                  <h3>10</h3>
                </li>
                <li>
                  <p>Price</p>
                  <h3>0</h3>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='player-single-slide'>
          <div className='player-single-slide-inner'>
            <Image src={player} alt='Player' />
            <div className='player-info-panel'>
              <p>Name</p>
              <h3>Wang Guoming</h3>
              <div className='spacer-20' />
              <p>Team Name</p>
              <h3>Henan Jianye</h3>
              <ul>
                <li>
                  <p>Points</p>
                  <h3>10</h3>
                </li>
                <li>
                  <p>Price</p>
                  <h3>0</h3>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='player-single-slide'>
          <div className='player-single-slide-inner'>
            <Image src={player} alt='Player' />
            <div className='player-info-panel'>
              <p>Name</p>
              <h3>Wang Guoming</h3>
              <div className='spacer-20' />
              <p>Team Name</p>
              <h3>Henan Jianye</h3>
              <ul>
                <li>
                  <p>Points</p>
                  <h3>10</h3>
                </li>
                <li>
                  <p>Price</p>
                  <h3>0</h3>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Slider>
    </>
  );
}
