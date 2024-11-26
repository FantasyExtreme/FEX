import {
  carouselDefaultSettings,
  DEFAULT_MATCH_STATUS,
  MatchStatuses,
} from '@/constant/variables';
import { MatchesCountType, WinnersAndMvps } from '@/types/fantasy';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  formatEmail,
  getMatchWinnerAndMVPS,
  sliceText,
} from '../utils/fantasy';
import logger from '@/lib/logger';
import { formatNumber } from '../utils/utcToLocal';
import { MATCH_CONTEST_ROUTE } from '@/constant/routes';
import userImage from '@/assets/images/user3.png';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const MVPSlider = () => {
  const mvpsslider = useRef(null);
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [winnerAndMvps, setWinnerAndMvps] = useState<null | WinnersAndMvps[]>(
    null,
  );
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: 5,
  };
  /**
   * Fetches match results based on the given status and updates the state.
   *
   * @param {string} status - The status of the matches to fetch (e.g., '0' for upcoming, '1' for ongoing, '2' for finished).
   */
  async function getResults(status: string) {
    getMatchWinnerAndMVPS(
      auth.actor,
      setWinnerAndMvps,
      { ...matchProps, status, page: 0, limit: 5 },
      setIsLoading,
      [],
      null,
    );
  }
  useEffect(() => {
    if (auth.actor) {
      getResults(MatchStatuses.finished);
    }
  }, [auth.actor]);

  return (
    <>
      {winnerAndMvps && winnerAndMvps?.length != 0 && (
        <Carousel {...carouselSettings} className='mvpsSlider'>
          {winnerAndMvps?.map((item: WinnersAndMvps, index: number) => {
            return (
              <div key={index} className='winners-mvps pb-3 pb-md-5 '>
                <ul className=''>
                  <li>
                    <Link
                      href={`${MATCH_CONTEST_ROUTE}matchId=${item?.match?.id}&type=0`}
                      className='latest-post'
                    >
                      <h6 className='text-center'>{item?.match?.date}</h6>
                      <div className='d-flex justify-content-center gap-5'>
                        <span className='matchTitle maxw'>
                          {item?.match?.homeTeam?.name}{' '}
                        </span>
                        <span className='matchTitle maxw'>
                          {item?.match?.awayTeam?.name}
                        </span>
                      </div>
                      <div className='flex-div justify-content-center'>
                        <h6>
                          <div className='d-flex justify-content-center mt-3'>
                            <img src={item?.match?.homeTeam?.logo} alt='Team' />
                          </div>
                        </h6>
                        <span className='mx-5'>
                          {item?.match?.homeScore}-{item?.match?.awayScore}
                        </span>
                        <h6>
                          <div className='d-flex justify-content-center mt-3'>
                            <img src={item?.match?.awayTeam?.logo} alt='Team' />{' '}
                          </div>
                        </h6>
                      </div>
                      <p className='text-center'>
                        <i className='fa fa-map-marker' />{' '}
                        {item?.match?.location}
                      </p>
                    </Link>
                  </li>
                </ul>
                <ul className='winner-mvp-list'>
                  <li>
                    <div className='winner-post winner '>
                      <Link
                        href={`${MATCH_CONTEST_ROUTE}matchId=${item?.match?.id}&type=0`}
                      >
                        <h5>
                          CONTEST <span>WINNER</span>
                        </h5>
                        <div className='user-info-post'>
                          <div className='img-pnl'>
                            <img
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/cup-1.png'
                              alt='Cup'
                              className='trophy'
                            />
                            {/* <img
                        src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/images.jpeg'
                        alt='User'
                        className='MVPS_PLAYER_IMG ms-3'

                      /> */}
                            <div className='userImg'>
                              <Image src={userImage} alt='John Doe' fill />
                            </div>
                          </div>
                          <div className='txt-pnl'>
                            <h6>
                              {sliceText(item?.contestWinner?.name, 0, 30)}
                            </h6>
                            <p>
                              {formatEmail(item?.contestWinner?.email ?? '')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </li>

                  <li>
                    <div className='winner-post mvp '>
                      <Link
                        href={`${MATCH_CONTEST_ROUTE}matchId=${item?.match?.id}&type=0`}
                      >
                        <h5>
                          Man OF <span>MATCH</span>
                        </h5>
                        <div className='user-info-post'>
                          <div className='img-pnl'>
                            <img
                              className='MVPS_PLAYER_IMG'
                              src={item?.mvps?.photo}
                              alt='User'
                            />
                          </div>

                          <div className='txt-pnl'>
                            <h6>{sliceText(item?.mvps?.name, 0, 30)}</h6>
                            <p>
                              Points: {formatNumber(Number(item?.mvps?.number))}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            );
          })}
        </Carousel>
      )}
    </>
  );
};

export default MVPSlider;
