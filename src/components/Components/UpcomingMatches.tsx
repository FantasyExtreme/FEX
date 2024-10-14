'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import {
  getMatches
} from '@/components/utils/fantasy';
import { useAuthStore } from '@/store/useStore';
import { Spinner, Table } from 'react-bootstrap';
import { ConnectPlugWalletSlice } from '@/types/store';
import { LoadingState, MatchesCountType, MatchesType } from '@/types/fantasy';
import {
  DEFAULT_MATCH_STATUS,
  MatchStatuses,
  QueryParamType,
} from '@/constant/variables';
import { MATCHES_SLIDER_SIZES } from '@/constant/fantasticonst';
export const MATCHES_CONTESTS_ROUTE = '/contest';
import {
  MATCHES_ROUTE,
  TEAM_CREATION_ROUTE,
} from '@/constant/routes';
import { toast } from 'react-toastify';
import Marquee from 'react-fast-marquee';

export default function UpcomingMatches() {
  const [loading, setLoading] = useState<LoadingState>({
    upcoming: true,
    ongoing: true,
    finished: true,
  });
  const [matches, setMatches] = useState<MatchesType>({
    upcoming: null,
    ongoing: null,
    finished: null,
  });

  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));

  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: 8,
  };
  /**
   * Fetches upcoming matches  based on the given status and updates the state.
   *
   * @param {string} status - The status of the matches to fetch (e.g. upcoming , ongoing, and  finished).
   */
  async function getStatusMatches(status: string) {
    getMatches(
      auth.actor,
      setMatches,
      { ...matchProps, status, page: 0 },
      setLoading,
      null,
      [],
      null,
      true,
    );
  }

  useEffect(() => {
    if (auth.actor) {
      getStatusMatches(MatchStatuses.upcoming);
    }
  }, [auth.actor]);

  return (
    <>
      {/* {loading.upcoming && (
        <tbody className=''>
          <tr>
            <td colSpan={4}>
              <div className='d-flex justify-content-center'>
                <Spinner animation='border' />
              </div>
            </td>
          </tr>
        </tbody>
      )}  */}

      {/* {matches.upcoming?.map((matches: any) => ( */}
      <>
        <div className='upcoming-match-container'>
          <div className='upcoming-match-container-inner'>
            <ul className='upcoming-matches-list'>
              <Marquee>
                {matches.upcoming?.map((match: any) => (
                  <li key={match.id}>
                    <Link
                      href={"#"}
                      className='upcoming-match-post'
                    >
                      <div>
                        <h5 className='d-flex'>
                          <span className='mt-2 '>{match?.homeTeam?.name}</span>
                          <span className='mt-2 '>{match?.awayTeam?.name}</span>
                        </h5>
                      </div>
                      <div className='d-flex align-items-center justify-content-center mt-3'>
                        <h5>
                          <Image
                            src={match?.homeTeam.logo
                              ?.replace('h=40', 'h=200')
                              ?.replace('h=40', 'w=200')}
                            width={MATCHES_SLIDER_SIZES.width}
                            height={MATCHES_SLIDER_SIZES.height}
                            alt='Batch'
                          />
                        </h5>
                        <h4>VS</h4>
                        <h5>
                          <Image
                            src={match?.awayTeam.logo
                              ?.replace('h=40', 'h=200')
                              ?.replace('h=40', 'w=200')}
                            width={MATCHES_SLIDER_SIZES.width}
                            height={MATCHES_SLIDER_SIZES.height}
                            alt='Batch'
                          />
                        </h5>
                      </div>

                      <h6 className='custom_'>{match?.location}</h6>
                      <p>
                        {match?.date} <br/> {match?.time}
                      </p>
                    </Link>
                  </li>
                ))}
              </Marquee>
            </ul>

            <div className='text-right'>
              <Container>
                <Link href={MATCHES_ROUTE} className='simple-link'>
                  View All Upcoming Matches
                  <i className='fa fa-arrow-right mx-2' />
                </Link>
              </Container>
            </div>
          </div>
        </div>
      </>
      {/* ))} */}
    </>
  );
}
