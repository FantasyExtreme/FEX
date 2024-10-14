import { MatchStatuses } from '@/constant/variables';
import { MatchesCountType } from '@/types/fantasy';
import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Image from 'next/image';
import Link from 'next/link';
import { MATCHES_ROUTE } from '@/constant/routes';
const HowItWorksList = () => {
  return (
    <ul className='how-it-work-list'>
      <li>
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
      </li>
      <li>
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
      </li>
      <li>
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
      </li>
      <li>
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
            Check 'My Contest' to view the rewards you earn based on the points
            your team scores.
          </p>
        </div>
      </li>
    </ul>
  );
};

export default HowItWorksList;
