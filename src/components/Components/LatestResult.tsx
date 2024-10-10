'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Batch1 from '../../assets/images/teams/team-soccer.png';
import Batch2 from '../../assets/images/teams/team-bestfoot.png';
export default function LatestResult() {
  return (
    <>
      <div className='latest-result-panel'>
        <ul className='latest-result-list'>
          <li>
            <Link href='#'>
              <div className='latest-post'>
                <p>Nov 2, 2024</p>
                <div className='flex-div'>
                  <h6>
                    Italy FC. <Image src={Batch1} alt='Batch' />
                  </h6>
                  <span>1-3</span>
                  <h6>
                    <Image src={Batch2} alt='Batch' /> Istanbul
                  </h6>
                </div>
                <p>
                  <i className='fa fa-map-marker' /> Central Olympia Stadium
                </p>
              </div>
            </Link>
          </li>
          <li>
            <Link href='#'>
              <div className='latest-post'>
                <p>Nov 2, 2024</p>
                <div className='flex-div'>
                  <h6>
                    Italy FC. <Image src={Batch1} alt='Batch' />
                  </h6>
                  <span>2-3</span>
                  <h6>
                    <Image src={Batch2} alt='Batch' /> Istanbul
                  </h6>
                </div>
                <p>
                  <i className='fa fa-map-marker' /> Central Olympia Stadium
                </p>
              </div>
            </Link>
          </li>
          <li>
            <Link href='#'>
              <div className='latest-post'>
                <p>Nov 2, 2024</p>
                <div className='flex-div'>
                  <h6>
                    Italy FC. <Image src={Batch1} alt='Batch' />
                  </h6>
                  <span>3-3</span>
                  <h6>
                    <Image src={Batch2} alt='Batch' /> Istanbul
                  </h6>
                </div>
                <p>
                  <i className='fa fa-map-marker' /> Central Olympia Stadium
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
