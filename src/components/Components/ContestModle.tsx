import React, { useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  Modal,
} from 'react-bootstrap';

import useAuth from '@/lib/auth';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import logger from '@/lib/logger';
import { Contest } from '@/types/fantasy';
import {
  getContests,
  getTimeZone,
} from '../utils/fantasy';
import { TransferFromError } from '@dfinity/ledger-icp/dist/candid/ledger';
import ConfirmTransaction from './ConfirmTransaction';
import {  TEAMS_ROUTE } from '@/constant/routes';
import { QueryParamType, QURIES } from '@/constant/variables';

interface Props {
  matchId: string | null;
  teamId: string | null;
  rankingModle: boolean;
  show: boolean;
  handleClose: () => void;
  router: any;
 
  getTeamsfn?:any
}
interface SelectedContest {
  contestName: string | null;
  contestId: string | null;
  entryFee: number | null;
}
const JoinDropDownContestModal = ({
  matchId,
  teamId,
  show,
  rankingModle,
  handleClose,
  router,
  getTeamsfn
}: Props) => {
  const [playerSquads, setPlayerSquads] = useState<any>([]);
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const [contests, setContests] = useState<Contest[] | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectContest, setSelectContest] = useState<SelectedContest>({
    contestName: null,
    contestId: null,
    entryFee: null,
  });
  const [isParticipating, setIsParticipating] = useState(false);


  /**
   * Fetches contests based on a given status and other match properties.
   *
   * @async
   * @function getStatusContests
   * @param status - The status of the contests to filter by. Can be a string representing the status or null.
   * @returns A promise that resolves when the contests are fetched and state is updated.
   */
  async function getStatusContests(matchId: string) {
    if (matchId && matchId != null)
      await getContests({ matchId, actor: auth.actor, setContests, userAuth });
  }
  useEffect(() => {
    if (auth.state == 'initialized' && matchId) {
      getStatusContests(matchId);
    }
  }, [auth, matchId]);
  async function addParticipant() {
    // return;
    if (!matchId) return logger(matchId, 'no match id');
    setIsParticipating(true);
    try {
      let {contestId } = selectContest;

      if (!teamId || !contestId) return;
      const added: { err?: TransferFromError; ok?: string } =
        await auth.actor.addParticipant(contestId, teamId,getTimeZone());

      if (added?.ok) {
        toast.success('Joined Successfully');

if(getTeamsfn) getTeamsfn();
        handleHideConfirm();
        handleClose();
      } else if (added?.err) {
        toast.error('Unexpected Error');
      }
      logger(added);
    } catch (error) {
      toast.error('Unexpected Error');
      logger(error);
    }
    setSelectContest({ contestId: null, contestName: null, entryFee: null });
    setIsParticipating(false);
  }
  const handleHideConfirm = () => setShowConfirm(false);

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  return (
    <>
      <Modal
        centered
        show={show}
        size='sm'
        onHide={() => {
          handleClose();
          setSelectContest({
            contestId: null,
            contestName: null,
            entryFee: null,
          });
        }}
        onClose={() => {
          handleClose();
          setSelectContest({
            contestId: null,
            contestName: null,
            entryFee: null,
          });
        }}
      >
        <Modal.Body className='contestModle'>
          <h5 className='text-center Nasalization'>
            {rankingModle ? 'View ' : 'Join Contest'}
          </h5>

          {contests && contests?.length != 0 ? (
            <div className=''>
              <Dropdown>
                <Dropdown.Toggle
                  variant='success'
                  id='dropdown-basic'
                  className='w-100 Nasalization'
                >
                  {selectContest.contestName ?? 'Select Contest'}
                </Dropdown.Toggle>

                <Dropdown.Menu className='w-100'>
                  {contests &&
                    contests?.map((contest: any) => {
                      return (
                        <Dropdown.Item
                          className='Nasalization'
                          defaultValue={contest}
                          key={contest.id}
                          onClick={() => {
                            setSelectContest({
                              contestId: contest?.id,
                              contestName: contest?.name,
                              entryFee: contest.entryFee,
                            });
                          }}
                        >
                          {contest?.name}
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>
              {rankingModle ? (
                <Button
                  className='reg-btn my-3'
                  disabled={!selectContest.contestId}
                  onClick={() => {
                    router.push(
                      `${TEAMS_ROUTE}?${QURIES.squadId}=${teamId}&${QURIES.contestId}=${selectContest.contestId}&type=${QueryParamType.simple}`,
                    );
                  }}
                >
                  View
                </Button>
              ) : (
                <Button
                  className='reg-btn my-3'
                  disabled={!selectContest.contestId}
                  onClick={handleShowConfirm}
                >
                  Join Contest
                </Button>
              )}
            </div>
          ) : (
            <div className='d-flex justify-content-center team-message'>
              <p className='me-2'>Contest Not found </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
      {selectContest.contestId && (
        <ConfirmTransaction
          show={showConfirm}
          onConfirm={addParticipant}
          loading={isParticipating}
          hideModal={handleHideConfirm}
        />
      )}
    </>
  );
};

export default JoinDropDownContestModal;
