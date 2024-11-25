'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
export default function BillionInfo() {
  return (
    <>
      <div className='Billion-pnl'>
        <div className='marketing-size-pnl'>
          <h4>Market Size</h4>
          {/* <h5>$35.67 <span>Billions</span></h5> */}
          <img
            src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/LandingPage/circle.png'
            alt='Circle'
          />
          <h6>Curt in 2024</h6>
        </div>
        <div className='billion-count-pnl'>
          <div className='flex-div'>
            <h6>$20.69 Billion</h6>
            <h6>EST in 2021</h6>
          </div>
          <div className='billion-bar'>
            <span style={{ width: '30%' }}></span>
          </div>
          <div className='flex-div'>
            <h6>$27.20 Billion</h6>
            <h6>EST in 2022</h6>
          </div>
          <div className='billion-bar'>
            <span style={{ width: '40%' }}></span>
          </div>
          <div className='flex-div'>
            <h6>$30.95 Billion</h6>
            <h6>EST in 2023</h6>
          </div>
          <div className='billion-bar'>
            <span style={{ width: '50%' }}></span>
          </div>
          <div className='flex-div'>
            <h6>$87.07 Billion</h6>
            <h6> EXP in 2031</h6>
          </div>
          <div className='billion-bar'>
            <span style={{ width: '80%' }}></span>
          </div>
        </div>
      </div>
      <div className='Billion-participants'>
        <div className='txt-pnl'>
          <h4>90 Million</h4>
          <h5>90 Million</h5>
          <h6>Participants</h6>
        </div>
        <ul>
          <li>
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/LandingPage/Batch/batch-1.png'
              alt='Batch'
            />
          </li>
          <li>
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/LandingPage/Batch/batch-2.png'
              alt='Batch'
            />
          </li>
          <li>
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/LandingPage/Batch/batch-3.png'
              alt='Batch'
            />
          </li>
          <li>
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/LandingPage/Batch/batch-4.png'
              alt='Batch'
            />
          </li>
        </ul>
      </div>
    </>
  );
}
