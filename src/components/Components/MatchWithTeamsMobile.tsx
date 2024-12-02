import {
  CKBTC_GAS_FEE,
  Directions,
  GAS_FEE,
  MATCHES_ICON_SIZES,
} from '@/constant/fantasticonst';
import {
  MATCH_CONTEST_ROUTE,
  TEAMS_ROUTE,
  TEAM_CREATION_ROUTE,
} from '@/constant/routes';
import {
  Contest,
  DetailedMatchContest,
  LoadingState,
  MatchesCountType,
  PlayerSquad,
} from '@/types/fantasy';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Arrow from '../Icons/Arrow';
import { Button, Spinner, Table } from 'react-bootstrap';
import {
  getContest,
  getContests,
  getFilterdContests,
  getKeyFromMatchStatus,
  getRawPlayerSquads,
  getTeamStatus,
  getTimeZone,
  handleTransferError,
  isConnected,
  isInPast,
  sliceText,
} from '../utils/fantasy';
import logger from '@/lib/logger';
import { approveCKBTCTokens, approveTokens, toE8S } from '@/lib/ledger';
import { Identity } from '@dfinity/agent';
import { toast } from 'react-toastify';
import { TransferFromError } from '@dfinity/ledger-icp/dist/candid/ledger';
import {
  DEFAULT_MATCH_STATUS,
  JoinContestText,
  MATCHES_ITEMSPERPAGE,
  MatchStatusNames,
  MatchStatuses,
  PaymentTypes,
  QURIES,
} from '@/constant/variables';
import BeatLoader from 'react-spinners/BeatLoader';
import ConfirmTransaction from './ConfirmTransaction';
import { canisterId as fantasyTransCanisterId } from '@/dfx/declarations/fantasytransactions';
import TeamRow from './TeamRow';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import Tippy from '@tippyjs/react';
import ConnectModal from './ConnectModal';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import useAuth from '@/lib/auth';
import JoinDropDownContestModal from './ContestModle';
import { utcToLocal } from '../utils/utcToLocal';

interface SelectedTeam {
  matchId: string | null;
  teamId: string | null;
  rankingModle: boolean;
}
function MatchWithTeamsMobile({
  match,
  actor,
  identity,
  handleGetAssets,
  dashboard,
}: {
  match: DetailedMatchContest;
  actor: any;
  identity: Identity;
  handleGetAssets?: any;
  dashboard?: boolean;
}) {
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const [showConnect, setShowConnect] = useState(false);
  const [showContestModel, setShowContestModel] = useState(false);

  const [showTeams, setShowTeams] = useState(false);
  const [loading, setLoading] = useState(false);
  const [squads, setSquads] = useState<PlayerSquad[] | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState<null | string>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participants, setParticipants] = useState<null | number>(null);
  const [selectedTeam, setSelectedTeam] = useState<SelectedTeam>({
    matchId: null,
    teamId: null,
    rankingModle: false,
  });

  const [maximumParticipated, setMaximumParticipated] =
    useState<boolean>(false);
  const [path, setPath] = useState<string | null>(null);
  let router = useRouter();
  const { updateBalance } = useAuth();
  /**
   * Toggles the visibility of the teams and fetches the player squads if not already fetched.
   *
   * @return Promise that resolves when the function completes.
   */
  async function toggleShowTeams() {
    logger('sdafasd', 'jhgfdsajhsadfsadfasdf');
    // if (match.teamsCreated == 0) return;
    setLoading(true);
    try {
      setShowTeams((prev) => !prev);

      if (!showTeams) {
        let contestId = null;
        getRawPlayerSquads(
          match.id,
          actor,
          match.teamsPerUser,
          setSquads,
          setParticipants,
          setMaximumParticipated,
          contestId,
        )
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      } else {
        setSquads(null);
        setLoading(false);
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Asynchronous function to add a participant to a squad.
   *
   * @param  squadId - The ID of the squad to add the participant to.
   */
  async function addParticipant() {
    setIsParticipating(true);

    try {
      let contest = await getContest(auth.actor, match.id);
      logger({ entry: match.entryFee, GAS_FEE, contest }, 'apprinving');
      if (match.entryFee && match.entryFee !== 0) {
        let approve;
        if (contest.paymentMethod == PaymentTypes.ICP) {
          approve = await approveTokens(contest.entryFee + GAS_FEE, identity);
        } else if (contest.paymentMethod == PaymentTypes.CKBTC) {
          approve = await approveCKBTCTokens(
            contest.entryFee + CKBTC_GAS_FEE,
            identity,
          );
        }
        if (!approve) {
          return toast.error('Unexpected Error');
        }
      }

      const added: { err?: TransferFromError; ok?: string } =
        await actor.addParticipant(match.id, selectedSquad, getTimeZone());

      if (added?.ok) {
        toast.success('Joined Successfully');
        if (participants != null && participants + 1 >= match.teamsPerUser)
          setMaximumParticipated(true);
        setParticipants((prev) => (prev != null ? prev++ : prev));
        match.teamsJoined++;

        // let newSquads = playerSquads.filter(())
        setSquads((prev: any) => {
          return prev.map((squad: any) => {
            if (squad.id == selectedSquad) {
              return {
                ...squad,
                hasParticipated: true,
              };
            }
            return squad;
          });
        });
        updateBalance();
        handleHideConfirm();
        if (handleGetAssets) {
          handleGetAssets();
        }
      } else if (added?.err) {
        toast.error(handleTransferError(added?.err));
      }
      logger(added);
    } catch (error) {
      toast.error('Unexpected Error');
      logger(error);
    }
    setSelectedSquad(null);
    setIsParticipating(false);
  }

  const handleShowConfirm = (id: string) => {
    setSelectedSquad(id);
    setShowConfirm(true);
  };
  function handleShowContestModel({
    matchId,
    teamId,
    rankingModle,
  }: {
    matchId: string;
    teamId: string;
    rankingModle: boolean;
  }) {
    setSelectedTeam({ matchId, teamId, rankingModle });
    setShowContestModel(true);
  }
  function handleShowConnect() {
    setShowConnect(true);
  }
  function handleHideConnect() {
    setShowConnect(false);
  }
  function handleHideContestModel() {
    setShowContestModel(false);
  }
  /**
   * use to get user teams
   * @parms null
   */
  let getTeamsfn = () => {
    let contestId = null;
    getRawPlayerSquads(
      match.id,
      actor,
      match.teamsPerUser,
      setSquads,
      setParticipants,
      setMaximumParticipated,
      contestId,
    )
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };
  /**
   * clickRef use as a callback route user connection modal should route after connection
   */
  let clickRef = () => {
    if (path) {
      router.push(path);
    }
  };
  const handleHideConfirm = () => setShowConfirm(false);
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
        <Tippy
          content={<span>Remaining time in D:H:M:S</span>}
          className='dark-tippy'
        >
          <span className='ms-2 color'>
            {days}:{hours}:{minutes}:{seconds}
          </span>
        </Tippy>
      );
    }
  };
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Matches </th>
            <th>Created</th>
            <th>Joined</th>
          </tr>
        </thead>
      </Table>
      <div className={`mobile-match-post  ${showTeams && 'auto'} `}>
        <div className='match-post-header'>
          <div className='flex-div'>
            <h6>
              <Image
                className='mx-2'
                src={match?.homeTeam.logo
                  ?.replace('h=40', 'h=200')
                  ?.replace('w=40', 'w=200')}
                width={MATCHES_ICON_SIZES.width}
                height={MATCHES_ICON_SIZES.height}
                alt='Icon paris'
              />

              {match.homeTeam.name}
            </h6>
            <h6 className='color'>
              {utcToLocal(BigInt(match.matchTime ?? 0), 'MMM  D, YY')} <br />{' '}
              {utcToLocal(BigInt(match.matchTime ?? 0), 'hh:mm A')}{' '}
            </h6>
            <h6>
              <Image
                className='mx-2'
                src={match?.awayTeam.logo
                  ?.replace('h=40', 'h=200')
                  ?.replace('w=40', 'w=200')}
                width={MATCHES_ICON_SIZES.width}
                height={MATCHES_ICON_SIZES.height}
                alt='Icon paris'
              />{' '}
              {match.awayTeam.name}
            </h6>
          </div>
          <p>
            Created Teams: {match?.teamsCreated}{' '}
            <span className='mx-4'>
              Joined Teams: {`${match?.teamsJoined} / ${match?.teamsPerUser}`}
            </span>
          </p>
        </div>
        <div className='match-post-footer'>
          <div>
            <Link
              href={`${MATCH_CONTEST_ROUTE}matchId=${match.id}&type=0`}
              className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
            >
              Contest
            </Link>

            <Link
              href={`${TEAM_CREATION_ROUTE}?matchId=${match.id}`}
              className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
            >
              Create Another Team
            </Link>

            <Button className='arrow-down-btn'>
              <Arrow
                onClick={toggleShowTeams}
                direction={showTeams ? Directions.up : Directions.down}
              />
            </Button>
          </div>
          <div className='match-post-footer-detail '>
            <div className='spacer-20' />

            {loading && (
              <tr className='ds bg sub-table-row'>
                <td colSpan={6} className='bordered-td'>
                  <Table className='sub-table'>
                    <tbody className=''>
                      <tr>
                        <td className='no-bg ' colSpan={6}>
                          <div className='d-flex justify-content-center'>
                            <Spinner animation='border' />
                          </div>{' '}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
              </tr>
            )}
            {!showTeams
              ? null
              : !loading &&
                squads?.length != 0 && (
                  <div className='table-container'>
                    <div className='table-inner-container'>
                      <Table
                        className='mobiletable'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <thead>
                          <tr>
                            <th>Action</th>
                            <th className='text-center'>Team Name</th>
                            <th>Points</th>
                            {!dashboard && <th>Rank</th>}
                            {dashboard ? <th>Contests</th> : <th>Status</th>}
                          </tr>
                        </thead>

                        {
                          <tbody>
                            {squads?.map((squad) => {
                              const { loading, disabled, buttonText, status } =
                                getTeamStatus({
                                  id: squad.id,
                                  hasParticipated: squad.hasParticipated,
                                  Matchstatus: match?.status,
                                  teamsPerUser: match?.teamsPerUser,
                                  time: match.matchTime as any,
                                  isParticipating,
                                  maximumParticipated,
                                  participants: participants as number,
                                  selectedSquad: selectedSquad as string,
                                });

                              return (
                                <TeamRow
                                  time={match.matchTime}
                                  handleShowConfirm={handleShowConfirm}
                                  squad={squad}
                                  loading={loading}
                                  disabled={disabled}
                                  buttonText={buttonText}
                                  status={status}
                                  isDashboard={dashboard}
                                  matchId={match.id}
                                  handleShowContestModel={
                                    handleShowContestModel
                                  }
                                />
                              );
                            })}
                          </tbody>
                        }
                      </Table>
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
      <ConfirmTransaction
        contestId={match.id}
        entryFee={match.entryFee}
        show={showConfirm}
        onConfirm={addParticipant}
        loading={isParticipating}
        hideModal={handleHideConfirm}
      />
      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
      <JoinDropDownContestModal
        show={showContestModel}
        handleClose={handleHideContestModel}
        matchId={selectedTeam.matchId}
        teamId={selectedTeam.teamId}
        rankingModle={selectedTeam.rankingModle}
        router={router}
        getTeamsfn={getTeamsfn}
      />
    </>
  );
}

export default MatchWithTeamsMobile;
