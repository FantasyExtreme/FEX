'use client';
import React, { useEffect, useState } from 'react';
import { date, object, string, number, array } from 'yup';
import {
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
  Modal,
  Form,
  Button,
  Table,
  Tab,
} from 'react-bootstrap';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
  FormikHelpers,
  useFormikContext,
  FieldArray,
} from 'formik';
import {
  MAX_NAME_CHARACTERS,
  MIN_NAME_CHARACTERS,
  Messages,
  ONLY_ALPHABET,
  Validations,
} from '@/constant/validations';
import logger from '@/lib/logger';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { TEAM_CREATION_ROUTE, TEAMS_ROUTE } from '@/constant/routes';
import {
  JoinContestText,
  MatchStatusNames,
  MatchStatuses,
  QURIES,
  QueryParamType,
} from '@/constant/variables';
import BeatLoader from 'react-spinners/BeatLoader';
import {
  fetchMatch,
  getRawPlayerSquads,
  handleTransferError,
  isConnected,
  isInPast,
} from '../utils/fantasy';
import { Contest, Match, PlayerSquad } from '@/types/fantasy';
import moment from 'moment';
import { ReturnAddParticipant } from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';
import { TransferFromError } from '@dfinity/ledger-icp/dist/candid/ledger';
import { approveTokens, toE8S } from '@/lib/ledger';
import { GAS_FEE } from '@/constant/fantasticonst';
import ConfirmTransaction from './ConfirmTransaction';
import { RiH1 } from 'react-icons/ri';
import DashboardTable from './DashboardTable';
import ConnectModal from './ConnectModal';
import { useRouter } from 'next/navigation';

// import { getRawPlayerSquads } from '../utils/fantasy';

interface Props {
  matchId: string;
  contestId: string;
  entryFee: number;
  match: Match | null;
  teamsPerUser: number;
  // contest: Contest;
  isModal?: boolean;
  decreaseSlots: () => void;
  contestPage?: boolean;
  updateSquad?: boolean;
  contestName?: string;
}
const JoinContest = ({
  matchId,
  contestId,
  contestName,
  match,
  entryFee,
  teamsPerUser,
  decreaseSlots,
  isModal,
  contestPage,
  updateSquad,
}: Props) => {
  const [playerSquads, setPlayerSquads] = useState<any>([]);
  const [showConnect, setShowConnect] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participants, setParticipants] = useState<null | number>(null);
  const [maximumParticipated, setMaximumParticipated] =
    useState<boolean>(false);
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const [path, setPath] = useState<string | null>(null);
  let router = useRouter();
  const [squads, setSquads] = useState<PlayerSquad[] | null>(null);
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
  async function getListPlayerSquads() {
    try {
      //   const resp = await actor.getPlayerSquadsByMatchId(matchId);
      getRawPlayerSquads(
        matchId,
        auth.actor,
        teamsPerUser,
        setPlayerSquads,
        setParticipants,
        setMaximumParticipated,
        contestId,
      );
      // const resp = await auth.actor.getListPlayerSquadsByMatch(matchId);
      // logger(resp, 'dis ss this it');
      // let _participants = 0;
      // const _playerSquads = resp?.map((squad: any) => {
      //   if (squad[1].hasParticipated) _participants++;
      //   return {
      //     ...squad[1],
      //     id: squad[0],
      //   };
      // });

      // setParticipants(_participants);
      // if (_participants >= teamsPerUser) setMaximumParticipated(true);

      // set(_participants)
      // setPlayerSquads(_playerSquads);
    } catch (error) {
      logger(error, 'getting it err');
    }
  }
  useEffect(() => {
    if (auth.state == 'initialized' && matchId) {
      getListPlayerSquads();
    }
  }, [auth, matchId]);
  useEffect(() => {
    if (!updateSquad) {
      getListPlayerSquads();
    }
  }, [updateSquad]);
  return (
    <>
      <>
        {/* <h5 className='Nasalization text-white padding-heading'>
          My <span>Teams</span>
        </h5> */}
        <ul className='join-contest-list'>
          {playerSquads.length !== 0 && match ? (
            <DashboardTable
              // contest={contest as any}
              setSquads={setPlayerSquads}
              setParticipants={setParticipants}
              setMaximumParticipated={setMaximumParticipated}
              entryFee={entryFee}
              teamsPerUser={teamsPerUser}
              maximumParticipated={maximumParticipated}
              participants={participants}
              auth={auth}
              squads={playerSquads}
              match={match}
              decreaseSlots={decreaseSlots}
              contestId={contestId}
              isModal={isModal}
              contestPage={contestPage}
              contestName={contestName}
            />
          ) : (
            <>
              <tr className='d-flex justify-content-center mt-2'>
                <td className='no-bg ' colSpan={6}>
                  <div className='d-flex justify-content-center team-message'>
                    <p className='me-2'>No Team Created, </p>

                    <Link
                      href={
                        isConnected(auth.state)
                          ? `${TEAM_CREATION_ROUTE}?matchId=${match?.id}`
                          : '#'
                      }
                      onClick={() => {
                        if (!isConnected(auth.state)) {
                          handleShowConnect();
                          if (match && Number(match.time) > Date.now()) {
                            setPath(
                              `${TEAM_CREATION_ROUTE}?matchId=${match?.id}`,
                            );
                          }
                        }
                      }}
                    >
                      Create Team
                    </Link>
                  </div>{' '}
                </td>
              </tr>
            </>
          )}
        </ul>
      </>

      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
    </>
  );
};

export default JoinContest;
