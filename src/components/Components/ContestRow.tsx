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
import { isConnected } from '../utils/fantasy';
import ConnectModal from './ConnectModal';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { ContestInfoType, DefaultContest } from '@/constant/variables';
import ContestInfoModal from './ContestInfoModal';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';

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
}
function ContestRow({
  contest,
  timeleft,
  handleSelectSquad,
  handleShowRanking,
  selectedContest,
  match,
  handleShowUpdateModal,
  setSelectedContest,
  isDashboard,
}: Props) {
  const [showConnect, setShowConnect] = useState(false);
  const urlparama = useSearchParamsHook();
  const [slotsLeft, setSlotsLeft] = useState(contest.slotsLeft);
  const [showInfo, setShowInfo] = useState(false);
  const [modalText, setModalText] = useState<string[]>([]);
  const [modalType, setModalType] = useState<ContestInfoType>(
    ContestInfoType.rules,
  );
  const [path, setPath] = useState<string | null>(null);

  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get('matchId');
  let router = useRouter();
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const renderer = ({
    hours,
    days,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      // Render a completed state
      return null;
    } else {
      // Render a countdown
      return (
        <span className='ms-2'>
          {days}:{hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

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
    logger(contest?.rules, 'teeeeeeee');
    switch (type) {
      case ContestInfoType.rules:
        setModalText(contest?.rules?.split(','));
        break;
      case ContestInfoType.rewardDistribution:
        let text = contest?.rewardDistribution?.map((r: any) => {
          if (r.to == r.from)
            return `Position ${r.to} : ${Math.abs(r.percentage)}`;
          return `Positions ${r.from} - ${r.to} : ${Math.abs(r.percentage)}`;
          logger(r, 'rrrrrr');
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
  }, []);
  useEffect(() => {
    setSlotsLeft(contest?.slotsLeft);
  }, [contest?.slotsLeft]);

  return (
    <>
      <div className='contest-post'>
        {/* <div className='contest-heading'>
          <h5>{contest?.name}</h5>
        </div> */}
        <div className='flex-div-sm'>
          <ul className='prize-total-list'>
            <li>
              <span>Prize Pool</span>
              <h6>${contest.prizePool}</h6>
            </li>
            <li>
              <span>Entry</span>
              <h6>${contest.entryFee}</h6>
            </li>
            <li>
              <span>Total Spots</span>
              <h6>{contest.slots}</h6>
            </li>
            <li>
              <span>Spots Left</span>
              <h6>{slotsLeft}</h6>
            </li>
          </ul>
          <div className='flex-div-sm w-auto align-items-center btn-her'>
            {/* <Button
              onClick={() => handleSelectSquad(contest)}
              className='reg-btn trans-white mid text-capitalize mx-3'
            >
              Select Team
            </Button> */}
            {handleShowUpdateModal && (
              <Button
                className='mx-3 reg-btn trans-white mid text-capitalize'
                onClick={() => {
                  // setSelectedContest(contest)
                  handleShowUpdateModal(contest.id);
                }}
                id=''
              >
                Edit contest
              </Button>
            )}
            <>
              {Number(match?.time) > Date.now() &&
              !userAuth.userPerms?.admin ? (
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
                  <Link
                    href={''}
                    className='underlined reg-btn reg-custom-btn empty text-capitalize text-white'
                  >
                    <Countdown date={match?.time} renderer={renderer} />
                    {/* <h6 className='timer text-white'>{timeleft}</h6> */}
                  </Link>
                </OverlayTrigger>
              ) : (
                <Button
                  className='mx-3 reg-btn trans-white mid text-capitalize'
                  onClick={() => handleShowRanking(contest)}
                  id='view_rankings_btn'
                >
                  View Ranking
                </Button>
              )}
            </>
            {match && Number(match.time) > Date.now() && !isDashboard && (
              <Link
                className='reg-btn trans-white mid text-capitalize btn btn-primary'
                href={
                  isConnected(auth.state)
                    ? `${TEAM_CREATION_ROUTE}?matchId=${matchId}`
                    : '#'
                }
                onClick={() => {
                  if (!isConnected(auth.state)) {
                    handleShowConnect();

                    setPath(`${TEAM_CREATION_ROUTE}?matchId=${matchId}`);
                  }
                }}
              >
                Create Team
              </Link>
            )}
          </div>
        </div>
        <div className='spacer-20' />
        <div className='container'>
          {/* {selectedContest && ( */}
          {!isDashboard && (
            <JoinContest
              entryFee={contest.entryFee}
              teamsPerUser={contest.teamsPerUser}
              contestId={contest?.id}
              matchId={contest?.matchId}
              match={match ?? null}
              contest={contest}
              decreaseSlots={decreaseSlots}
            />
          )}
          {/* )} */}
        </div>

        <ul className='prize-list mt-5'>
          <Tippy content={<span>Prize for 1st position</span>}>
            <li>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-gold-medal.png'
                alt='Icon Medla'
              />{' '}
              0
            </li>
          </Tippy>

          <li>
            <Button
              onClick={() => {
                contest?.entryFee <= 0
                  ? undefined
                  : handleShowInfo(ContestInfoType.rewardDistribution);
              }}
            >
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-trophy.png'
                alt='Icon Trophy'
              />{' '}
              {isNaN(contest.rewardableUserPercentage) ||
              contest.rewardableUserPercentage === 0
                ? 0
                : contest.rewardableUserPercentage}
              %
            </Button>
          </li>
          <li>
            <Button onClick={() => handleShowInfo(ContestInfoType.rules)}>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-book.png'
                alt='Ion Book'
              />{' '}
              Rules
            </Button>
          </li>
        </ul>
      </div>
      <ContestInfoModal
        show={showInfo}
        hide={hideInfo}
        text={modalText}
        type={modalType}
      />
      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
    </>
  );
}

export default ContestRow;
