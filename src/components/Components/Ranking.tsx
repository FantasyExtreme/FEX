'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { toast } from 'react-toastify';
import {
  refineSquad,
  requireAuth,
  sliceText,
} from '../utils/fantasy';
import { convertMotokoObject } from '../utils/convertMotokoObject';
import Link from 'next/link';
import { TEAMS_ROUTE } from '@/constant/routes';
import { Match, RFSquadRanking } from '@/types/fantasy';
import { Intervals, QURIES, QueryParamType } from '@/constant/variables';
import { fromNullable } from '@dfinity/utils';
import Tippy from '@tippyjs/react';
import ConnectModal from './ConnectModal';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

interface Props {
  contestId: string | null;
  showModal: boolean;
  handleCloseModal: () => void;
  match: Match | null;
}
const RankingModal = ({
  contestId,
  handleCloseModal,
  showModal,
  match,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [squads, setSquads] = useState<RFSquadRanking[]>([]);
  const [showConnect, setShowConnect] = useState(false);
  const [userSquadId, setUserSquadId] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  let router = useRouter();
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));

  async function getRankings(initial: boolean) {
    if (initial) setLoading(true);
    try {
      const resp = await auth.actor.nGetSquadRanking(contestId, {
        limit: 10,
        page: 0,
        search: '',
        status: '',
      });
logger(resp,"hgasfksdfafasdf")
      const { rankings, total: _total, userRank: _userRank } = resp;
      let userRank: any = fromNullable(_userRank);
      if (userRank && userRank?.length > 0) {
        userRank[1].mine = true;
        rankings.push(userRank);
      }
      const rfSquadRankings = rankings?.map((squadRank: any) => {
        let _new = convertMotokoObject(squadRank);
        return refineSquad(_new);
      });
      setSquads(rfSquadRankings);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
  let submitbtnRef = useRef<any>(null);
  function handleHideConnect() {
    setShowConnect(false);
  }
  /**
   * clickRef use to submit button click after login
   */
  let clickRef = () => {
    if (userSquadId) {
      router.push(
        `${TEAMS_ROUTE}?${QURIES.squadId}=${userSquadId}&type=${QueryParamType.simple}`,
      );
    }
  };
  const getIconForRank = (rank: number | undefined) => {
    if (rank == 1) {
      return (
        <div className='box'>
          <img
            src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/cup-1.png'
            alt='Cup'
          />
        </div>
      );
    } else if (rank == 2) {
      return (
        <div className='box'>
          <img
            src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/cup-2.png'
            alt='Cup'
          />
        </div>
      );
    } else if (rank == 3) {
      return (
        <div className='box'>
          <img
            src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/cup-3.png'
            alt='Cup'
          />
        </div>
      );
    } else if (rank) {
      return <div className='box grey'>{rank}</div>;
    } else {
      return <div className='box grey'>{rank}</div>;
    }
  };
  function handleShowConnect() {
    setShowConnect(true);
  }
  useEffect(() => {
    getRankings(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (contestId && showModal) {
      // Initial fetch
      getRankings(true);

      // Set up interval for fetching every 20 seconds
      intervalRef.current = setInterval(() => {
        getRankings(false);
      }, Intervals.contest);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contestId, showModal]);

  return (
    <>
      <Modal show={showModal} centered size='lg' onHide={handleCloseModal}>
        <Modal.Body>
          <Button
            className='btn-close'
            id='btn_close'
            onClick={handleCloseModal}
          >
            <i className='fa fa-close' />
          </Button>
          <div className='timer'>
            {loading ? (
              <div className='d-flex justify-content-center'>
                <Spinner />
              </div>
            ) : (
              <>
                {squads?.length > 0 ? (
                  <>
                    <h5 className='Nasalization'>
                      Contest <span>Ranking</span>
                    </h5>
                    <div className='contest-container'>
                      <div className='scrollable-rankings rankingModle'>
                        <ul className='join-contest-list '>
                          {squads
                            ?.filter((squad) => !squad.mine)
                            .map((squad, index) => (
                              <li
                                key={`${squad.id}-${squad.rank || index}`}
                                className='ranking-item'
                                style={{
                                  top: `${((squad.rank || index + 1) - 1) * 70}px`,
                                }}
                              >
                                {getIconForRank(squad.rank || index + 1)}
                                <div className='grey-pnl'>
                                  <Tippy content={squad.name}>
                                    <h5 className='nowrape'>
                                      {sliceText(squad.name, 0, 10)}
                                    </h5>
                                  </Tippy>

                                  <h5>{squad.points}</h5>
                                  <h5>000</h5>
                                  <Link
                                    className='reg-btn reg-custom-btn empty text-capitalize'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (!requireAuth(auth.state)) {
                                        setUserSquadId(squad?.id ?? null);

                                        handleShowConnect();
                                      } else {
                                        router.push(
                                          `${TEAMS_ROUTE}?${QURIES.squadId}=${squad.id}&type=${QueryParamType.simple}`,
                                        );
                                      }
                                    }}
                                    href={`${TEAMS_ROUTE}?${QURIES.squadId}=${squad.id}&type=${QueryParamType.simple}`}
                                  >
                                    View Team
                                  </Link>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                      {squads.find((squad) => squad.mine) && (
                        <div className='fixed-user-ranking'>
                          {(() => {
                            const userSquad = squads.find(
                              (squad) => squad.mine,
                            );
                            return (
                              <li className='ranking-item active'>
                                {getIconForRank(userSquad?.rank)}
                                <div className='grey-pnl'>
                                  <Tippy content={userSquad?.name}>
                                    <h5 className='nowrape'>
                                      {sliceText(userSquad?.name, 0, 10)}
                                    </h5>
                                  </Tippy>
                                  <h5>{userSquad?.points}</h5>
                                  <h5>000</h5>
                                  <Link
                                    className='reg-btn reg-custom-btn empty text-capitalize text-dark'
                                    // ref={submitbtnRef}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (!requireAuth(auth.state)) {
                                        setUserSquadId(userSquad?.id ?? null);
                                        handleShowConnect();
                                      } else {
                                        router.push(
                                          `${TEAMS_ROUTE}?${QURIES.squadId}=${userSquad?.id}&type=${QueryParamType.simple}`,
                                        );
                                      }
                                    }}
                                    href={`${TEAMS_ROUTE}?${QURIES.squadId}=${userSquad?.id}&type=${QueryParamType.simple}`}
                                  >
                                    View Team
                                  </Link>
                                </div>
                              </li>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className='d-flex justify-content-center'>
                    <p className='color'>Ranking is not available</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
    </>
  );
};

export default RankingModal;
