'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Table, Spinner } from 'react-bootstrap';
import batch1 from '../../assets/old-images/Batch/Batch-2.png';
import batch2 from '../../assets/old-images/Batch/Batch-1.png';
import moment from 'moment';
import trophy1 from '../../assets/old-images/icons/icon-Trophy-1.png';
import trophy2 from '../../assets/old-images/icons/icon-Trophy-2.png';
import trophy3 from '../../assets/old-images/icons/icon-Trophy-3.png';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

export default function MatchBoard({ match }: any) {
  const navigation = useRouter();
  logger('HHHHHHMMMMMM', match);

  return (
    <>
      <div className='match-board'>
        <div className='match-board-display'>
          <div className='match-head'>
            <h2>Upcoming Match</h2>
          </div>
          {match ? (
            <div
              className='match-body'
              onClick={() =>
                navigation.push(`/players?teamId=${match?.matchId}`)
              }
            >
              <h4>{'La Liga 2023-24'}</h4>
              <ul>
                <li>
                  <Image
                    src={match.homeTeam[0].logo
                      .replace('h=40', 'h=200')
                      .replace('w=40', 'w=200')}
                    width={60}
                    height={69}
                    alt='Italy'
                  />
                  {/* <Image src={batch1} alt='Batch' /> */}
                </li>
                <li>
                  {/* <span>19:20pm</span> */}
                  <span>{moment(match.time).local().format('hh:mma')}</span>
                  <h5>{moment(match.time).format('DD/MM/YYYY')}</h5>
                </li>
                <li>
                  <Image
                    src={match.awayTeam[0].logo
                      .replace('h=40', 'h=200')
                      .replace('w=40', 'w=200')}
                    width={60}
                    height={69}
                    alt='Italy'
                  />
                  {/* <Image src={batch2} alt='Batch' /> */}
                </li>
              </ul>
              <p>{match.location}</p>
            </div>
          ) : (
            <div className='d-flex justify-content-center'>
              <Spinner />
            </div>
          )}
        </div>
        <div className='match-board-display'>
          <div className='match-head'>
            <h2>Top Earners</h2>
          </div>
          <div className='match-body'>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tokens</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Image
                      src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-trophy.png'
                      alt='trophy1'
                    />{' '}
                    John Doe
                  </td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>
                    <Image
                      src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-trophy.png'
                      alt='trophy1'
                    />{' '}
                    John Doe
                  </td>
                  <td>54</td>
                </tr>
                <tr>
                  <td>
                    <Image
                      src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-trophy.png'
                      alt='trophy1'
                    />{' '}
                    John Doe
                  </td>
                  <td>34</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {/* <div className="match-board">
        <Link href="/standing" className="match-board-display">
          <div className="match-head">
            <h2>Upcoming Match</h2>
          </div>
          <div className="match-body">
            <h4>
              2022-2023 UEFA <br/>Champions League
            </h4>
            <ul>
              <li>
                <Image src={batch1} alt="Batch" />
              </li>
              <li>
                <span>19:20pm</span>
                <h5>24/ 11/ 2022</h5>
              </li>
              <li>
                <Image src={batch2} alt="Batch" />
              </li>
            </ul>
            <p>GD Stadium, London</p>
          </div>
        </Link>
        <div className="match-board-display">
          <div className="match-head">
            <h2>Top Earners</h2>
          </div>
          <div className="match-body">
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tokens</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Image src={trophy1} alt="trophy1" /> John Doe
                  </td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>
                    <Image src={trophy2} alt="trophy1" /> John Doe
                  </td>
                  <td>54</td>
                </tr>
                <tr>
                  <td>
                    <Image src={trophy3} alt="trophy1" /> John Doe
                  </td>
                  <td>34</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div> */}
    </>
  );
}
