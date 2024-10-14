import { MATCHES_ICON_SIZES } from '@/constant/fantasticonst';
import {
  
  MATCHES_ROUTE,
  TEAM_CREATION_ROUTE,
} from '@/constant/routes';
import {
  EnvironmentEnum,
  MatchStatuses,
  QURIES,
  QueryParamType,
} from '@/constant/variables';
import logger from '@/lib/logger';
import { useAuthStore } from '@/store/useStore';
import { Match } from '@/types/fantasy';
import { ConnectPlugWalletSlice } from '@/types/store';
import Image from 'next/image';
import Link from 'next/link';
import { Spinner, Table } from 'react-bootstrap';
import ConnectModal from './ConnectModal';
import React, { useEffect, useRef, useState } from 'react';
import authMethods from '@/lib/auth';
import { isConnected } from '../utils/fantasy';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import tethericon from '@/assets/images/icons/icon-paris.png';
import Dollericon from '@/assets/images/doller.svg';
import { toast } from 'react-toastify';
import BeatLoader from 'react-spinners/BeatLoader';

export default function MatchTable({
  groupMatches,
  loading,
  tab,
  admin,
  handleRewardableMatchUpdate,

}: {
  groupMatches: null | [string, Match][];
  loading: boolean;
  admin?: boolean;
  tab: string;
  handleRewardableMatchUpdate?:any
}) {
  const { auth, userAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));
  const [path, setPath] = useState<string | null>(null);
  const [showConnect, setShowConnect] = useState(false);
  const [makingRewardLoading, setMakingRewardLoading] = useState<boolean[]>(
    Array(10).fill(false) 
  );

  let router = useRouter();

  const handleNavigateToContest = (id: any) => {
    // router.push(
    //   `${MATCHES_ROUTE + MATCHES_CONTESTS_ROUTE}?matchId=${id}&type=${QueryParamType.simple}`,
    // );
  };
  /**
   * handleReward use to make a match rewardable
   * @param id 
   * @param rewardable 
   * @param index 
   * @returns 
   */
  const handleReward = async (id: string,rewardable:boolean,index:number) => {
    try {
      let matchId=id.trim()
      if(!matchId || matchId=="") return toast.error("Match id not found.")
        setMakingRewardLoading((pre) =>
          pre.map((item, i) => (i === index ? !item : item))
        );
      const resp = await auth.actor.toggleRewardableMatch(matchId,rewardable);
      if(resp.ok){
        toast.success(resp.ok);
        if(handleRewardableMatchUpdate) handleRewardableMatchUpdate(matchId,rewardable?false:true);

      }else if(resp.err){
        toast.error(resp.err);
      }
      setMakingRewardLoading((pre) =>
        pre.map((item, i) => (i === index ? !item : item))
      );
    } catch (error) {
      setMakingRewardLoading((pre) =>
        pre.map((item, i) => (i === index ? !item : item))
      );

    }

  };
  function handleShowConnect() {
    setShowConnect(true);
  }
  function handleHideConnect() {
    setShowConnect(false);
  }
  /**
   * clickRef use as a callback route user connection modal should route after connection
   */
  let clickRef = () => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <>
      <div className='table-container web-view-table'>
        <div
          className={`table-inner-container ${!(!loading && groupMatches && groupMatches?.length == 0) && 'min-height-of-table'}`}
        >
          <Table>
            <thead>
              <tr>
                <th className='text-center'>Action</th>
                <th className='text-center'>MATCHES</th>
                <th>Date</th>
                <th>TIME</th>
                <th>location</th>
              </tr>
            </thead>
            {loading ? (
              <tbody className=''>
                <tr>
                  <td colSpan={5}>
                    <div className='d-flex justify-content-center'>
                      <Spinner animation='border' />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className=''>
                <tr>
                  <td colSpan={5}>
                    <div className='d-flex justify-content-center'>
                      {!loading &&
                        groupMatches &&
                        groupMatches?.length == 0 && <p>No Matches Found</p>}
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
            {!loading && (
              <tbody>
                {groupMatches?.map((matches: any, groupIndex: number) => (
                  <React.Fragment key={`group-${groupIndex}`}>
                    <tr>
                      <td colSpan={4}>
                        <h5>
                          <span> {matches[1][0]?.tournamentName}</span>
                        </h5>
                      </td>
                    </tr>
                    {matches[1]?.map((match: Match,index:number) => (
                      <tr
                        className={`pointer ${match.isPostpond && 'isPostpond'}`}
                        key={match.id}
                      >
                        <td>
                          <div className='d-flex justify-content-center matchesBtns'>
                            {(tab == MatchStatuses.upcoming ||
                              process.env.NEXT_PUBLIC_DFX_NETWORK ==
                                EnvironmentEnum.dev) && (
                              <Link
                                href={
                                  isConnected(auth.state)
                                    ? `${TEAM_CREATION_ROUTE}?matchId=${match.id}`
                                    : '#'
                                }
                                onClick={() => {
                                  if (!isConnected(auth.state)) {
                                    handleShowConnect();
                                    setPath(
                                      `${TEAM_CREATION_ROUTE}?matchId=${match.id}`,
                                    );
                                  }
                                }}
                                className=' reg-btn text-white reg-custom-btn empty text-capitalize '
                              >
                                Create Team
                              </Link>
                            )}
                       
                          
                          </div>
                        </td>
                        <td onClick={() => handleNavigateToContest(match.id)}>
                          <div className='w-100 d-flex justify-content-center align-items-center text-center'>
                            <span className='w-half text-right d-flex align-items-center justify-content-end'>
                              {/* {sliceText(match.homeTeam.name,0,10)}{' '} */}
                              <Tippy content={match.homeTeam.name}>
                                <span className='truncate'>
                                  {' '}
                                  {match.homeTeam.name}
                                </span>
                              </Tippy>

                              <Image
                                className='mx-2'
                                src={match?.homeTeam.logo
                                  ?.replace('h=40', 'h=200')
                                  ?.replace('w=40', 'w=200')}
                                width={MATCHES_ICON_SIZES.width}
                                height={MATCHES_ICON_SIZES.height}
                                alt='Icon paris'
                              />
                            </span>
                            {tab == MatchStatuses.finished ? (
                              <span className='d-flex flex-column'>
                                <span className='w-80 text-center fs-6 color fw-bold'>{`${match?.homeScore}-${match?.awayScore}`}</span>
                                <span className='w-80 text-center verses'>vs 
                                 
                              </span>
                              </span>
                            ) : (
                              <span className='w-80 text-center verses'>vs 
                          
                              </span>  
                            )}

                            <span className='w-half text-left d-flex align-items-center justify-content-start'>
                              <Image
                                className='mx-2'
                                src={match?.awayTeam.logo
                                  ?.replace('h=40', 'h=200')
                                  ?.replace('w=40', 'w=200')}
                                width={MATCHES_ICON_SIZES.width}
                                height={MATCHES_ICON_SIZES.height}
                                alt='Icon paris'
                              />{' '}
                              <Tippy content={match.awayTeam.name}>
                                <span className='truncate'>
                                  {' '}
                                  {match.awayTeam.name}
                                </span>
                              </Tippy>
                            </span>
                          </div>
                        </td>
                        <td onClick={() => handleNavigateToContest(match.id)}>
                          <div className='text-nowrap'>{match?.date}</div>
                        </td>
                        <td onClick={() => handleNavigateToContest(match.id)}>
                          <div className='text-nowrap'>{match?.time}</div>
                        </td>
                        <td onClick={() => handleNavigateToContest(match.id)}>
                          <div className='isPostpondStatus'>
                            {match.isPostpond && <span>{match.status}</span>}
                            <span>{match?.location}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            )}
          </Table>
          {true}
        </div>
      </div>

      {/* Mobile View Match Posts */}
      {loading ? (
      <div className='d-flex justify-content-center hide-on-web'>
       <Spinner className='hide-on-web mb-5' animation='border' />
       </div>
        ) : (!groupMatches || groupMatches.length === 0) ? (
       <p className='text-center text-white hide-on-web'>Match Not Found</p>
       ) : (
       groupMatches?.map((matches: any, index: number) => (

        <React.Fragment key={`mobile-group-${index}`}>
          <h5 className='color Nasalization hide-on-web'>
            <span> {matches[1][0]?.tournamentName}</span>
          </h5>
          { matches[1]?.map((match: Match) => (
            <div className='mobile-match-post' key={match.id}>
              <div className='match-post-header'>
                <div className='flex-div'>
                  <h6>
                    <Image
                      src={match?.homeTeam.logo
                        ?.replace('h=40', 'h=200')
                        ?.replace('w=40', 'w=200')}
                      width={MATCHES_ICON_SIZES.width}
                      height={MATCHES_ICON_SIZES.height}
                      alt='Icon paris'
                    />
                    <Tippy content={match.homeTeam.name}>
                      <span className='truncate'> {match.homeTeam.name}</span>
                    </Tippy>
                  </h6>
                  <h6
                    className='color verses'
                    onClick={() => handleNavigateToContest(match.id)}
                  >
                     {match?.isRewardable &&
                             <Tippy content={'5$ Dollar Reward'}>
                                 <span>
                                  
                                 <br/> <Dollericon/></span>
                              </Tippy>
                              } 
                              <br/>
                              <br/>
                    {match?.date} <br/>   {match?.time}
                  </h6>
                  <h6>
                    <Image
                      src={match?.awayTeam.logo
                        ?.replace('h=40', 'h=200')
                        ?.replace('w=40', 'w=200')}
                      width={MATCHES_ICON_SIZES.width}
                      height={MATCHES_ICON_SIZES.height}
                      alt='Icon paris'
                    />{' '}
                    <Tippy content={match.awayTeam.name}>
                      <span className='truncate'> {match.awayTeam.name}</span>
                    </Tippy>
                  </h6>
                </div>
                <div
                  className='transparent-white'
                  onClick={() => handleNavigateToContest(match.id)}
                >
                  <div className='isPostpondStatus'>
                    {match.isPostpond && <span>{match.status}</span>}
                    <span>{match?.location}</span>
                  </div>
                </div>
              </div>
              <div className={`match-post-footer ${admin && 'adm'}`}>
                {(tab == MatchStatuses.upcoming ||
                  process.env.NEXT_PUBLIC_DFX_NETWORK ==
                    EnvironmentEnum.dev) && (
                  <Link
                    href={
                      isConnected(auth.state)
                        ? `${TEAM_CREATION_ROUTE}?matchId=${match.id}`
                        : '#'
                    }
                    onClick={() => {
                      if (!isConnected(auth.state)) {
                        handleShowConnect();
                        setPath(`${TEAM_CREATION_ROUTE}?matchId=${match.id}`);
                      }
                    }}
                    className=' reg-btn text-white reg-custom-btn empty text-capitalize '
                  >
                    Create Team
                  </Link>
                )}
               

               
              </div>
            </div>
          ))}
        </React.Fragment>
      ))
    )}

      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
    </>
  );
}
