'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import {
  getMatches,
} from '@/components/utils/fantasy';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  LoadingState,
  Match,
  MatchesCountType,
  MatchesType,
  WinnersAndMvps,
} from '@/types/fantasy';
import {
  carouselDefaultSettings,
  DEFAULT_MATCH_STATUS,
  MatchStatuses,
  QueryParamType,
} from '@/constant/variables';
import { MATCHES_RESULT_SIZES } from '@/constant/fantasticonst';
import {
  MATCHES_CONTESTS_ROUTE,
  MATCHES_ROUTE,
  
} from '@/constant/routes';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import logger from '@/lib/logger';
export default function LatestResult() {
  const [loading, setLoading] = useState<LoadingState>({
    upcoming: true,
    ongoing: true,
    finished: true,
  });

  const [results, setResults] = useState<MatchesType>({
    upcoming: null,
    ongoing: null,
    finished: null,
  });

  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));

  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: 3,
  };
  /**
   * Fetches match results based on the given status and updates the state.
   *
   * @param {string} status - The status of the matches to fetch (e.g., '0' for upcoming, '1' for ongoing, '2' for finished).
   */
  async function getResults(status: string) {
    getMatches(
      auth.actor,
      setResults,
      { ...matchProps, status, page: 0, limit: 3 },
      setLoading,
      null,
      [],
      null,
      true,
    );
  }
  useEffect(() => {
    if (auth.actor) {
      getResults(MatchStatuses.finished);
    }
  }, [auth.actor]);
  // Slick Slider Settings

  const carouselSettings = {
    ...carouselDefaultSettings,
    arrows: false,
    responsive: {
      desktop: {
        breakpoint: {
          max: 3000,
          min: 1200,
        },
        items: 3,
        slidesToSlide: 3,
        partialVisibilityGutter: 40,
      },
      tablet: {
        breakpoint: {
          max: 1200,
          min: 991,
        },
        items: 2,
        slidesToSlide: 2,
        partialVisibilityGutter: 40,
      },
      mobile: {
        breakpoint: {
          max: 991,
          min: 0,
        },
        items: 1,
        slidesToSlide: 1,
        partialVisibilityGutter: 40,
      },
    },
    slidesToSlide: 1,
  };
  // Slick Slider Settings
  return (
    <>
      {/* Latest Resulte Slider */}
      {results?.finished && results?.finished?.length != 0 && (
        <Carousel {...carouselSettings} className='latest-result-panel'>
          {results?.finished?.map((match: any, index: number) => (
            <ul key={index} className='latest-result-list'>
              <li>
                <Link
                  href={`#`}
                >
                  <div className='latest-post'>
                    <h6>{match.date}</h6>
                    <div className='d-flex justify-content-around'>
                      <span className='matchTitle'>
                        {match?.homeTeam?.name}{' '}
                      </span>
                      <span className='matchTitle'>
                        {' '}
                        {match?.awayTeam?.name}
                      </span>
                    </div>
                    <div className='flex-div justify-content-evenly'>
                      <h6>
                        <div className='mt-2 '>
                          <Image
                            src={match?.homeTeam.logo
                              ?.replace('h=40', 'h=200')
                              ?.replace('w=40', 'w=200')}
                            width={MATCHES_RESULT_SIZES.width}
                            height={MATCHES_RESULT_SIZES.height}
                            alt='Batch'
                          />
                        </div>
                      </h6>
                      <span className=''>
                        {match.homeScore}-{match.awayScore}
                      </span>
                      <h6>
                        <div className='mt-2'>
                          <Image
                            src={match?.awayTeam.logo
                              ?.replace('h=40', 'h=200')
                              ?.replace('w=40', 'w=200')}
                            width={MATCHES_RESULT_SIZES.width}
                            height={MATCHES_RESULT_SIZES.height}
                            alt='Batch'
                          />{' '}
                        </div>
                      </h6>
                    </div>
                    <p>
                      <i className='fa fa-map-marker' /> {match?.location}
                    </p>
                  </div>
                </Link>
              </li>
            </ul>
          ))}
        </Carousel>
      )}
      {/* Latest Resulte Slider */}
    </>
  );
}
