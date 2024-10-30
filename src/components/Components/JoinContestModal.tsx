import React, { useEffect, useState } from 'react';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
} from 'formik';
import {
  Button,
  Dropdown,
  Form,
  Modal,
  Nav,
  NavDropdown,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { number, object, string } from 'yup';
import { Principal } from '@dfinity/principal';
import useAuth from '@/lib/auth';
import { E8S, GAS_FEE, GAS_FEE_ICP } from '@/constant/fantasticonst';
import { makeICPLedgerCanister } from '@/dfx/service/actor-locator';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import logger from '@/lib/logger';
import JoinContest from './JoinContest';
import { Match } from '@/types/fantasy';
import {
  getRawPlayerSquads,
  getTimeZone,
  handleTransferError,
  isConnected,
} from '../utils/fantasy';
import { approveTokens, toE8S } from '@/lib/ledger';
import { TransferFromError } from '@dfinity/ledger-icp/dist/candid/ledger';
import ConfirmTransaction from './ConfirmTransaction';
import Link from 'next/link';
import { TEAM_CREATION_ROUTE } from '@/constant/routes';
import ConnectModal from './ConnectModal';
import { useRouter } from 'next/navigation';
// import { AccountIdentifier } from '@dfinity/ledger-icp';

interface Props {
  matchId: string;
  contestId: string;
  entryFee: number;
  match: Match | null;
  teamsPerUser: number;
  // contest: Contest;
  decreaseSlots: () => void;
  show: boolean;
  handleClose: () => void;
}
interface SelectedTeam {
  teamId: string | null;
  teamName: string | null;
}
const JoinContestModal = ({
  matchId,
  contestId,
  // contest,
  match,
  entryFee,
  teamsPerUser,
  decreaseSlots,
  show,
  handleClose,
}: Props) => {
  const [playerSquads, setPlayerSquads] = useState<any>([]);
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const [isParticipating, setIsParticipating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  let router = useRouter();

  const [maximumParticipated, setMaximumParticipated] =
    useState<boolean>(false);
  const [participants, setParticipants] = useState<null | number>(null);
  const [selectTeam, setSelectTeam] = useState<SelectedTeam>({
    teamName: null,
    teamId: null,
  });
  const { updateBalance } = useAuth();

  async function getListPlayerSquads() {
    try {
      getRawPlayerSquads(
        matchId,
        auth.actor,
        teamsPerUser,
        setPlayerSquads,
        setParticipants,
        setMaximumParticipated,
        contestId,
      );
    } catch (error) {
      logger(error, 'getting it err');
    }
  }
  async function addParticipant() {
    
    if (!match?.id) return logger(match, 'no match id');
    setIsParticipating(true);
    try {
      logger({ entry: entryFee, GAS_FEE }, 'apprinving');
      if (entryFee !== 0) {
        let approve = await approveTokens(
          toE8S(entryFee) + GAS_FEE,
          auth.identity,
        );
        if (!approve) {
          return toast.error('Unexpected Error');
        }
      }
      if (!selectTeam.teamId || !contestId) return;
      const added: { err?: TransferFromError; ok?: string } =
        await auth.actor.addParticipant(contestId, selectTeam.teamId,getTimeZone());

      if (added?.ok) {
        decreaseSlots();
        toast.success('Joined Successfully');
        if (participants !=null && participants + 1 >= teamsPerUser)
          setMaximumParticipated(true);
        setParticipants((prev) => (prev!=null ? ++prev : prev));
        // match && match.teamsJoined++;

        // let newSquads = playerSquads.filter(())
        setPlayerSquads((prev: any) => {
          return prev.map((squad: any) => {
            if (squad.id == selectTeam.teamId) {
              return {
                ...squad,
                hasParticipated: true,
              };
            }
            return squad;
          });
        });
        logger(
          { selectId: selectTeam.teamId, teams: playerSquads, participants },
          'hsjdagfkjhsagdkjfdsafsad',
        );

        updateBalance();
        handleHideConfirm();
        handleClose();
      } else if (added?.err) {
        toast.error(handleTransferError(added?.err));
      }
      logger(added);
    } catch (error) {
      toast.error('Unexpected Error');
      logger(error);
    }
    setSelectTeam({ teamId: null, teamName: null });
    setIsParticipating(false);
  }
  const handleHideConfirm = () => setShowConfirm(false);

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };
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
  function handleShowConnect() {
    setShowConnect(true);
  }
  useEffect(() => {
    if (auth.state == 'initialized' && matchId) {
      getListPlayerSquads();
    }
  }, [auth, matchId]);

  return (
    <>
      <Modal
        centered
        show={show}
        className='fade light'
        onHide={() => {
          handleClose();
          setSelectTeam({ teamId: null, teamName: null });
        }}
        onClose={() => {
          handleClose();
          setSelectTeam({ teamId: null, teamName: null });
        }}
      >
        <Modal.Body className='contestModle'>
          <p className='modleHeading'>
            <span>Select</span> <span>Team</span>
          </p>

          {/* <div className='contestInfoBox'>
            <div>
              <span>joined Teams</span>
              <span>{participants ?? 0}</span>
            </div>
            <div>
              <span>Teams Per User</span>
              <span>{teamsPerUser ?? 0}</span>
            </div>
          </div> */}
          {playerSquads && playerSquads?.length != 0 ? (
            <div className=''>
              <Dropdown>
                <Dropdown.Toggle
                  variant='success'
                  id='dropdown-basic'
                  className='w-100 Nasalization'
                >
                  {selectTeam.teamName ?? 'Select Team'}
                </Dropdown.Toggle>

                <Dropdown.Menu className='w-100'>
                  {playerSquads &&
                    playerSquads?.map((team: any) => {
                      return (
                        <Dropdown.Item
                          className='Nasalization'
                          defaultValue={team}
                          key={team.id}
                          disabled={team?.hasParticipated}
                          onClick={() => {
                            if (participants == teamsPerUser)
                              return toast.error(
                                'You have reached the maximum team limit.',
                              );
                            if (team?.hasParticipated)
                              return toast.error('Already Joined');
                            setSelectTeam({
                              teamId: team?.id,
                              teamName: team?.name,
                            });
                          }}
                        >
                          {team?.name}
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>

              <Button
                className='reg-btn my-3'
                disabled={participants == teamsPerUser || !selectTeam.teamId}
                onClick={handleShowConfirm}
              >
                Join Contest
              </Button>
              {/* <JoinContest
            isModal={true}
            entryFee={entryFee}
            teamsPerUser={teamsPerUser}
            contestId={contestId}
            matchId={matchId}
            match={match}
            decreaseSlots={decreaseSlots}
          /> */}
              {participants == teamsPerUser && (
                <p className='text-danger'>
                  You have reached the maximum team limit.
                </p>
              )}

              {(participants ?? 0) < teamsPerUser &&
                playerSquads.length == participants && (
                  <div className='d-flex align-items-center  flex-column flex-sm-row team-message'>
                    <p className='me-2 text-danger'>
                      You've already joined the contest{' '}
                    </p>
                    {match && Number(match.time) > Date.now() && (
                      <Link
                        href={
                          isConnected(auth.state)
                            ? `${TEAM_CREATION_ROUTE}?matchId=${match?.id}`
                            : '#'
                        }
                        onClick={() => {
                          if (!isConnected(auth.state)) {
                            handleShowConnect();
                            setPath(
                              `${TEAM_CREATION_ROUTE}?matchId=${match?.id}`,
                            );
                          }
                        }}
                      >
                        Create New Team.
                      </Link>
                    )}
                  </div>
                )}
            </div>
          ) : (
            <div className='d-flex justify-content-center team-message'>
              <p className='me-2 text-danger'>No Team Created, </p>
              {match && Number(match.time) > Date.now() && (
                <Link
                  href={
                    isConnected(auth.state)
                      ? `${TEAM_CREATION_ROUTE}?matchId=${match?.id}`
                      : '#'
                  }
                  onClick={() => {
                    if (!isConnected(auth.state)) {
                      handleShowConnect();
                      setPath(`${TEAM_CREATION_ROUTE}?matchId=${match?.id}`);
                    }
                  }}
                >
                  Create Team
                </Link>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
      <ConfirmTransaction
        entryFee={entryFee}
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
    </>
  );
};

export default JoinContestModal;
