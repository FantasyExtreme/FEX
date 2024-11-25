'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { getJoinedTeamsOfUser, isConnected } from '../utils/fantasy';
import {
  DEFAULT_MATCH_STATUS,
  MAX_JOINED_CONTESTS_LIMIT,
} from '@/constant/variables';
import { Spinner } from 'react-bootstrap';
import PaginatedList from './Pagination';
export default function MyLiveRank() {
  const { auth, userAuth, setUserAuth, principal } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
    principal: (state as ConnectPlugWalletSlice).principal,
  }));
  const [offset, setOffset] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [userJoinedTeams, setUserJoinedTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const defaultProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: MAX_JOINED_CONTESTS_LIMIT,
  };
  let pageClicked = (pageNumber: number) => {
    getUserJoinedContestWithTeams({ page: pageNumber });
  };
  /**
 * use to get joined teams in contest
 * @param page - page number to be fetched 

 */
  let getUserJoinedContestWithTeams = async ({ page }: { page: number }) => {
    try {
      setLoading(true);

      let data = await getJoinedTeamsOfUser({
        actor: auth.actor,
        props: { ...defaultProps, page: page },
      });
      setPageCount(data.total);
      setUserJoinedTeams(data.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isConnected(auth.state)) {
      getUserJoinedContestWithTeams({ page: 0 });
    }
  }, [auth.state]);
  return (
    <>
      <div className='my-live-rank-container'>
        {/* My Live Rank Post */}
        {loading ? (
          <p className='text-center w-100'>
            {' '}
            <Spinner />
          </p>
        ) : !userJoinedTeams || userJoinedTeams.length == 0 ? (
          <p className='text-white text-center w-100'>No live rankings available</p>
        ) : (
          userJoinedTeams.map((item) => {
            return (
              <div className={`myliverank-post ${item?.contestName}`}>
                <div className='my-live-rank-head'>
                  <span>{item?.contestName}</span>
                  <h3>{item?.leagueName}</h3>
                </div>
                <div className='team-pnl'>
                  <Image
                    style={{ width: '60px', height: '60px' }}
                    src={item?.homeTeamLogo}
                    alt='Team1'
                    height={100}
                    width={100}
                  />
                  <span>Vs</span>
                  <Image
                    style={{ width: '60px', height: '60px' }}
                    src={item?.awayTeamLogo}
                    alt='Team1'
                    height={100}
                    width={100}
                  />
                </div>
                <div className='my-live-rank-foot'>
                  <h6>
                    Team Name
                    <span>Rank</span>
                  </h6>
                  <p>
                    {item?.squadName}
                    <span> {item?.rank}</span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className='d-flex justify-content-end'>
        {!(pageCount == 0 || pageCount <= MAX_JOINED_CONTESTS_LIMIT) && (
          <div className='text-right'>
            <PaginatedList
              itemsPerPage={MAX_JOINED_CONTESTS_LIMIT}
              count={pageCount}
              offset={offset}
              pageChange={pageClicked}
            />
          </div>
        )}
      </div>
    </>
  );
}
