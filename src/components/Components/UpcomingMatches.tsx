'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import Batch1 from '../../assets/images/teams/team-soccer-club.png';
import Batch2 from '../../assets/images/teams/team-bestfoot-club.png';
export default function UpcomingMatches() {
  return (
    <>
      <div className='upcoming-match-container'>
        <div className='upcoming-match-container-inner'>
          <ul className='upcoming-matches-list'>
            <li>
              <Link href='#' className='upcoming-match-post'>
                <div className='flex-div align-items-end '>
                  <h5>
                    <Image src={Batch1} alt='Batch' />
                    <span>Italy FC.</span>
                  </h5>
                  <h4>VS</h4>
                  <h5>
                    <Image src={Batch2} alt='Batch' />
                    <span>Istanbul</span>
                  </h5>
                </div>
                <h6>Central Olympic Stadium</h6>
                <p>April 02, 2024</p>
              </Link>
            </li>
            <li>
              <Link href='#' className='upcoming-match-post'>
                <div className='flex-div align-items-end'>
                  <h5>
                    <Image src={Batch1} alt='Batch' />
                    <span>Italy FC.</span>
                  </h5>
                  <h4>VS</h4>
                  <h5>
                    <Image src={Batch2} alt='Batch' />
                    <span>Istanbul</span>
                  </h5>
                </div>
                <h6>Central Olympic Stadium</h6>
                <p>April 02, 2024</p>
              </Link>
            </li>
            <li>
              <Link href='#' className='upcoming-match-post'>
                <div className='flex-div align-items-end'>
                  <h5>
                    <Image src={Batch1} alt='Batch' />
                    <span>Italy FC.</span>
                  </h5>
                  <h4>VS</h4>
                  <h5>
                    <Image src={Batch2} alt='Batch' />
                    <span>Istanbul</span>
                  </h5>
                </div>
                <h6>Central Olympic Stadium</h6>
                <p>April 02, 2024</p>
              </Link>
            </li>
            <li>
              <Link href='#' className='upcoming-match-post'>
                <div className='flex-div align-items-end'>
                  <h5>
                    <Image src={Batch1} alt='Batch' />
                    <span>Italy FC.</span>
                  </h5>
                  <h4>VS</h4>
                  <h5>
                    <Image src={Batch2} alt='Batch' />
                    <span>Istanbul</span>
                  </h5>
                </div>
                <h6>Central Olympic Stadium</h6>
                <p>April 02, 2024</p>
              </Link>
            </li>
            <li>
              <Link href='#' className='upcoming-match-post'>
                <div className='flex-div align-items-end'>
                  <h5>
                    <Image src={Batch1} alt='Batch' />
                    <span>Italy FC.</span>
                  </h5>
                  <h4>VS</h4>
                  <h5>
                    <Image src={Batch2} alt='Batch' />
                    <span>Istanbul</span>
                  </h5>
                </div>
                <h6>Central Olympic Stadium</h6>
                <p>April 02, 2024</p>
              </Link>
            </li>
            <li>
              <Link href='#' className='upcoming-match-post'>
                <div className='flex-div align-items-end'>
                  <h5>
                    <Image src={Batch1} alt='Batch' />
                    <span>Italy FC.</span>
                  </h5>
                  <h4>VS</h4>
                  <h5>
                    <Image src={Batch2} alt='Batch' />
                    <span>Istanbul</span>
                  </h5>
                </div>
                <h6>Central Olympic Stadium</h6>
                <p>April 02, 2024</p>
              </Link>
            </li>
            <li>
              <Link href='#' className='upcoming-match-post'>
                <div className='flex-div align-items-end'>
                  <h5>
                    <Image src={Batch1} alt='Batch' />
                    <span>Italy FC.</span>
                  </h5>
                  <h4>VS</h4>
                  <h5>
                    <Image src={Batch2} alt='Batch' />
                    <span>Istanbul</span>
                  </h5>
                </div>
                <h6>Central Olympic Stadium</h6>
                <p>April 02, 2024</p>
              </Link>
            </li>
          </ul>
          <div className='text-right'>
            <Container>
              <Link href='/upcomingmatches' className='simple-link'>
                View All Upcoming Matches
                <i className='fa fa-arrow-right mx-2' />
              </Link>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
