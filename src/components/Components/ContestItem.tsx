'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Contest, Match } from '@/types/fantasy';
import Link from 'next/link';
import JoinContest from './JoinContest';
import useSearchParamsHook from '../utils/searchParamsHook';
import { fromE8S } from '@/lib/ledger';
import { TEAM_CREATION_ROUTE } from '@/constant/routes';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { date } from 'yup';
import {
  copyId,
  getPackage,
  getPackageIcon,
  isConnected,
  shouldShowROI,
} from '../utils/fantasy';
import ConnectModal from './ConnectModal';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  ContestInfoType,
  ContestPayment,
  DefaultContest,
  PaymentsArray,
  PaymentTypes,
} from '@/constant/variables';
import ContestInfoModal from './ContestInfoModal';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import CupSvg from '@/assets/images/icons/icon-trophy.png';
import GiftSvg from '@/assets/images/icons/icon-gold-medal.png';
import rulebook from '@/assets/images/icons/icon-book.png';

import coinicon from '@/assets/images/icons/coin-icon.png';
import tethericon from '@/assets/images/icons/tether-icon.png';
import JoinContestModal from './JoinContestModal';
import RewardCalculatorModal from './RewardCalculatorModal';
import CountdownRender from './CountdownRenderer';
import PrincipalSvg from '../Icons/PrincipalSvg';

interface Props {
  contest: Contest;
  timeleft?: string;
  handleSelectSquad: (contest: Contest) => void;
  handleShowRanking: (contest: Contest) => void;
  selectedContest?: Contest | null;
  match?: Match | null;
  handleShowUpdateModal?: (contest: string) => void;
  setSelectedContest?: any;
  isDashboard?: boolean;
  icpRate: number;
  isAdminPannel?: boolean;
}
function ContestItem({
  contest,
  timeleft,
  handleSelectSquad,
  handleShowRanking,
  selectedContest,
  match,
  handleShowUpdateModal,
  setSelectedContest,
  isDashboard,
  icpRate,
  isAdminPannel,
}: Props) {
  const [showConnect, setShowConnect] = useState(false);
  const [showROI, setShowROI] = useState(false);
  const urlparama = useSearchParamsHook();
  const [slotsLeft, setSlotsLeft] = useState(contest.slotsLeft);
  const [showInfo, setShowInfo] = useState(false);
  const [modalText, setModalText] = useState<string[]>([]);
  const [showJoin, setShowJoin] = useState(false);

  const [modalType, setModalType] = useState<ContestInfoType>(
    ContestInfoType.rules,
  );
  const [contestInfo, setContestInfo] = useState({
    entryFee: 0,
    totalparticipants: 0,
  });
  const [path, setPath] = useState<string | null>(null);

  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get('matchId');
  const contestPaymentObj =
    ContestPayment.get(contest.paymentMethod as string) || PaymentsArray[0];
  let router = useRouter();
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  function handleShowJoin() {
    setShowJoin(true);
  }
  function handleCloseJoin() {
    setShowJoin(false);
  }
 
  function handleShowROI() {
    setShowROI(true);
  }
  function handleCloseROI() {
    setShowROI(false);
  }

  /**
   * Decreases the number of slots left.
   *
   * @return {void}
   */
  function decreaseSlots() {
    setSlotsLeft((prev) => prev - 1);
  }
  const handleShowInfo = (type: ContestInfoType) => {
    setModalType(type);
    switch (type) {
      case ContestInfoType.rules:
        setModalText(contest?.rules?.split(','));
        break;
      case ContestInfoType.rewardDistribution:
        let text = contest?.rewardDistribution?.map((r: any) => {
          if (r.to == r.from)
            return `Position ${r.to} : ${Math.abs(r.percentage)}`;
          return `Positions ${r.from} - ${r.to} : ${Math.abs(r.percentage)}`;
        });
        setModalText(text);
        break;
      default:
        break;
    }
    setShowInfo(true);
  };
  const hideInfo = () => setShowInfo(false);
  function handleShowConnect() {
    setShowConnect(true);
  }
  /**
   * clickRef use as a callback route user connection modal should route after connection
   */
  let clickRef = () => {
    if (path) {
      router.push(path);
    }
  };
  function handleHideConnect() {
    setShowConnect(false);
  }
  useEffect(() => {
    var matchId = searchParams.get('matchId');
    handleSelectSquad(contest);
  }, [showJoin]);
  useEffect(() => {
    setSlotsLeft(contest?.slotsLeft);
  }, [contest?.slotsLeft]);
  return (
    <>
      <div className={`package-contest-post-main ${getPackage(contest.name)}`}>
        <div className='package-contest-post'>
          <div className='package-contest-post-inner'>
            <div className='contest-info'>
              <Image
                src={getPackageIcon(contest.name)}
                width={30}
                height={35}
                alt='img'
              />{' '}
              {contest.name}
              {isAdminPannel && (
                <span
                  className='copybtn'
                  onClick={() => {
                    copyId(contest.id, 'Contest Id');
                  }}
                >
                  <PrincipalSvg />
                </span>
              )}
            </div>
            <div className='mobile-view-contest-btn'>
              {match && Number(match.time) > Date.now() ? (
                <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip
                      id='tooltip-top'
                      className='Nasalization text-white'
                    >
                      Time <span> Remaining untill the match starts</span>
                    </Tooltip>
                  }
                >
                  <h6 className=''>
                    Starts In{' '}
                    <span>
                      <Countdown
                        date={match?.time}
                        renderer={CountdownRender}
                      />
                    </span>
                  </h6>
                </OverlayTrigger>
              ) : (
                <span></span>
              )}

              {match && Number(match.time) > Date.now() ? (
                <Link
                  className='reg-btn trans-white mid text-capitalize'
                  href={'#'}
                  // href={
                  //   isConnected(auth.state)
                  //     ? `${TEAM_CREATION_ROUTE}?matchId=${matchId}`
                  //     : '#'
                  // }
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isConnected(auth.state)) {
                      handleShowConnect();

                      setPath(`${TEAM_CREATION_ROUTE}?matchId=${matchId}`);
                    } else {
                      router.push(`${TEAM_CREATION_ROUTE}?matchId=${matchId}`);
                    }
                  }}
                >
                  Create Team
                </Link>
              ) : (
                <span></span>
              )}
            </div>
            <div className='post-heading-info'>
              <div className='img-pnl'>
                <Image
                  className='small'
                  src={contestPaymentObj.fexIcon}
                  alt='img'
                />
                <Image src={contestPaymentObj.tetherIcon} alt='img' />
              </div>
              <div className='txt-pnl'>
                <h6>{contest.name}</h6>
                <span>
                  Entry Fee: {contest.entryFee} {contestPaymentObj?.name}
                </span>
              </div>
            </div>
            <ul className='calculate-list'>
              {shouldShowROI(contest.name) &&
              contestPaymentObj?.id == PaymentTypes.ICP ? (
                <li>
                  <p>Rewards:</p>
                  <p onClick={handleShowROI}>
                    <i className='fa fa-rocket color'></i> Reward Calculator{' '}
                    <i className='fa fa-calculator'></i>
                  </p>
                </li>
              ) : null}
              <li>
                <p>Participants</p>
                <p>{contest.slotsUsed}</p>
              </li>
              <li>
                <p>Prize Pool</p>
                <p>
                  {contest.prizePool} {contestPaymentObj?.name}{' '}
                  <small>
                    {contestPaymentObj?.id == PaymentTypes.ICP
                      ? `(1 ICP ≈ ${icpRate}$)`
                      : null}
                  </small>
                </p>
              </li>
            </ul>
            <ul
              className={`icon-list ${
                !shouldShowROI(contest.name) &&
                contestPaymentObj?.id == PaymentTypes.ICP &&
                'justify-content-center'
              }`}
            >
              {shouldShowROI(contest.name) &&
                contestPaymentObj?.id == PaymentTypes.ICP && (
                  <>
                    {' '}
                    <Tippy
                      content={
                        <>
                          <span className='me-4'>Prize for 1st position:</span>
                          <span> {contest?.firstPrize ?? 0} ICP</span>
                        </>
                      }
                    >
                      <li>
                        <Image src={GiftSvg} alt='icon Gift' />
                      </li>
                    </Tippy>
                    <li
                      onClick={() => {
                        handleShowInfo(ContestInfoType.rewardDistribution);
                        setContestInfo({
                          entryFee: contest.entryFee,
                          totalparticipants: contest.slotsUsed,
                        });
                      }}
                    >
                      <Image src={CupSvg} alt='icon Cup' />
                    </li>
                  </>
                )}
              <li
                onClick={() => {
                  setContestInfo({ entryFee: 0, totalparticipants: 0 });
                  handleShowInfo(ContestInfoType.rules);
                }}
              >
                <Image src={rulebook} alt='icon Rule Book' />
              </li>
            </ul>

            {isAdminPannel ? (
              <>
                {handleShowUpdateModal && (
                  <Button
                    onClick={() => {
                      // setSelectedContest(contest)
                      handleShowUpdateModal(contest.id);
                    }}
                    className='reg-btn'
                  >
                    Edit Contest
                  </Button>
                )}
                <Button
                  className=' reg-btn trans-white mid text-capitalize mt-3'
                  onClick={() => handleShowRanking(contest)}
                  id='view_rankings_btn'
                >
                  View Ranking
                </Button>{' '}
          
              </>
            ) : Number(match?.time) > Date.now() ? (
              <Button onClick={handleShowJoin} className='reg-btn'>
                Join Contest
              </Button>
            ) : (
              <Button
                className=' reg-btn trans-white mid text-capitalize'
                onClick={() => handleShowRanking(contest)}
                id='view_rankings_btn'
              >
                View Ranking
              </Button>
            )}

            {!isAdminPannel && (
              <JoinContest
                entryFee={contest.entryFee}
                teamsPerUser={contest.teamsPerUser}
                contestId={contest?.id}
                matchId={contest?.matchId}
                match={match ?? null}
                decreaseSlots={decreaseSlots}
                contestPage={true}
                updateSquad={showJoin}
                contestName={contest.name}
              />
            )}
          </div>
        </div>
      </div>

      {showInfo && (
        <ContestInfoModal
          show={showInfo}
          hide={hideInfo}
          text={modalText}
          type={modalType}
          entryFee={contestInfo.entryFee}
          totalParticipants={contestInfo.totalparticipants}
          auth={auth}
        />
      )}
      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
      {showJoin && (
        <JoinContestModal
          entryFee={contest.entryFee}
          teamsPerUser={contest.teamsPerUser}
          contestId={contest?.id}
          matchId={contest?.matchId}
          match={match ?? null}
          decreaseSlots={decreaseSlots}
          show={showJoin}
          handleClose={handleCloseJoin}
        />
      )}
 
      <RewardCalculatorModal
        show={showROI}
        handleClose={handleCloseROI}
        icpRate={icpRate}
        defaultContest={{
          name: contest.name,
          entryFee: contest.entryFee,
          participants: contest.slotsUsed,
        }}
      />
    </>
  );
}

export default ContestItem;
