import React, { useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { carouselDefaultSettings } from '@/constant/variables';
import Carousel from 'react-multi-carousel';
const HowItWorksSlider = () => {
  // Slick Carosule Setting
  const carouselSettings = {
    ...carouselDefaultSettings,
    arrows: true,
    responsive: {
      desktop: {
        breakpoint: {
          max: 3000,
          min: 0,
        },
        items: 1,
        slidesToSlide: 1,
        partialVisibilityGutter: 40,
      },
    },
    slidesToSlide: 1,
  };

  // Slick Carosule Setting
  return (
    <>
      {/* How It Works Slider */}
      <Carousel {...carouselSettings} >
        <div>
          <div className='how-it-work-post'>
            <div className='img-pnl'>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/Select-Match.png'
                alt='Select Match'
              />
            </div>
            <h5>
              Select <span>Match</span>
            </h5>
            <p>Choose an upcoming match from the available list.</p>
          </div>
        </div>
        <div>
          <div className='how-it-work-post'>
            <div className='img-pnl'>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/Create-Team.png'
                alt='Create Team'
              />
            </div>
            <h5>
              Create <span>Team</span>
            </h5>
            <p>Pick 15 players from the players' pool to form your team.</p>
          </div>
        </div>
        <div>
          <div className='how-it-work-post'>
            <div className='img-pnl'>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/Join-Contest.png'
                alt='Join Contest'
              />
            </div>
            <h5>
              Join <span>Contest</span>
            </h5>
            <p>Click the 'Join Contest' button to enter the contest.</p>
          </div>
        </div>
        <div>
          <div className='how-it-work-post'>
            <div className='img-pnl'>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/Win-Rewards.png'
                alt='Win Rewards'
              />
            </div>
            <h5>
              Win <span>Rewards</span>
            </h5>
            <p>
              Check 'My Contest' to view the rewards you earn based on the
              points your team scores.
            </p>
          </div>
        </div>
        </Carousel>
      {/* How It Works Slider */}
    </>
  );
};

export default HowItWorksSlider;
