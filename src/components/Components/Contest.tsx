'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import RankingModal from './Ranking';
import { Contest } from '@/types/fantasy';
import JoinContest from './JoinContest';

const Contest = ({
  contest,
  onClick,
}: {
  contest: Contest;
  onClick?: (id: string) => void;
}) => {
  return (
    <>
      <div
        onClick={() => {
          if (onClick) {
            onClick(contest?.id);
          }
        }}
        className='point-board  text-center'
      >
        <div className='total-panel'>
          <ul className='total-list'>
            <li>
              <p>Prize Pool</p>
              <h3>${contest?.prizePool}</h3>
            </li>
            <li>
              <p>Entry</p>
              <h5>${contest?.entryFee}</h5>
            </li>
            <li>
              <p>Total Spots</p>
              <h5>{contest?.slots}</h5>
            </li>
            <li>
              <p>Spots Left</p>
              <h5>{contest?.slotsLeft}</h5>
            </li>
          </ul>
        </div>
        <ul className='prize-list'>
          <li>
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-gold-medal.png'
              alt='Icon Priza'
            />{' '}
            {contest?.firstPrize}
          </li>
          <li className='pointer'>
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-trophy.png'
              alt='Icon Cup'
            />{' '}
            {contest?.rewardableUserPercentage}%
          </li>
          <li>
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-book.png'
              alt='Ion Book'
            />{' '}
            Rules
          </li>
        </ul>
      </div>
      {/* <JoinContest
        handleCloseModal={handleCloseSelect}
        showModal={showSelect}
        contestId={contest.id}
        matchId={contest.matchId}
      />
      <RankingModal
        showModal={showRanking}
        handleCloseModal={handleCloseRanking}
        contestId={contest?.id}
      /> */}
    </>
  );
};

export default Contest;
