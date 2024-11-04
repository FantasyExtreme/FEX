
import {
  JoinContestText,
  MatchStatusNames,
  QueryParamType,
  QURIES,
} from '@/constant/variables';
import {
  Contest,
  DetailedMatchContest,
  Match,
  PlayerSquad,
} from '@/types/fantasy';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import BeatLoader from 'react-spinners/BeatLoader';
import { getTimeZone,  isInPast } from '../utils/fantasy';
import logger from '@/lib/logger';
import { GAS_FEE } from '@/constant/fantasticonst';
import { Auth } from '@/types/store';
import { toast } from 'react-toastify';
import TeamRow from './TeamRow';
import useAuth from '@/lib/auth';
import ConfirmTransaction from './ConfirmTransaction';

const DashboardTable = ({
  squads,
  match,
  maximumParticipated,
  setMaximumParticipated,
  participants,
  setParticipants,
  setSquads,
  auth,
  teamsPerUser,
  decreaseSlots,
  contestId,
  isModal,
  contestPage,
  contestName,
}: {
  squads: PlayerSquad[] | null;
  match: Match;
  maximumParticipated: boolean;
  setMaximumParticipated: React.Dispatch<React.SetStateAction<boolean>>;
  setParticipants: React.Dispatch<React.SetStateAction<number | null>>;
  setSquads: React.Dispatch<React.SetStateAction<any>>;
  decreaseSlots: () => void;
  participants: number | null;
  auth: Auth;
  teamsPerUser: number;
  contestId: string | null;
  isModal?: boolean;
  contestPage?: boolean;
  contestName?: string;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState<null | string>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  function toggleTeams() {
    setIsOpen((prev) => !prev);
  }
  async function addParticipant() {
    // logger(contestId,"hdsagfhgsadjhgfsadfsadfasd");
    // return;
    if (!match?.id) return logger(match, 'no match id');
    setIsParticipating(true);
    try {


      const added: { err?: any; ok?: string } =
        await auth.actor.addParticipant(contestId, selectedSquad,getTimeZone());

      if (added?.ok) {
        decreaseSlots();
        toast.success('Joined Successfully');
        if ( participants  != null && participants + 1 >= teamsPerUser){

          setMaximumParticipated(true);
        }
        setParticipants((prev) => (prev!=null ? ++prev : prev));
        // match && match.teamsJoined++;
        // let newSquads = playerSquads.filter(());
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
        handleHideConfirm();
      } else if (added?.err) {
        toast.error("Unexpected Error");
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
  const handleHideConfirm = () => setShowConfirm(false);
  return (
    <>
      <div className='table-p'>
        {!isModal && (
          <div className='text-center'>
            <h6 className='m-0' onClick={toggleTeams}>
              {isOpen ? 'Hide' : 'Show'}{' '}
              <i className={`fa fa-angle-double-${isOpen ? 'up' : 'down'}`}></i>
            </h6>
          </div>
        )}
        {isOpen && (
          <div className='table-container maxheight contestTeamtable'>
            <div className='table-inner-container'>
              <Table className='table' onClick={(e) => e.stopPropagation()}>
                <thead>
                  <tr>
                    {/* <th className='text-center mr-5 pe-5'>Action</th> */}
                    <th className='text-center '>Action</th>
                    <th className='text-center'>Team </th>
                    {!contestPage && <th>Points</th>}
                    <th>Rank</th>
                    <th>Status</th>
                  </tr>
                </thead>

                {
                  <tbody>
                    {squads?.map((squad) => {
                      const loading =
                        isParticipating && squad.id == selectedSquad;
                      let status = 'Not joined';
                      const kickedOff = isInPast(match?.time);
                      let maximum = false;
                      let show = false;
                      const finished =
                        match?.status == MatchStatusNames.finished;
                      let buttonText = JoinContestText.upcoming;
                      if (kickedOff) buttonText = JoinContestText.ongoing;
                      if (finished) buttonText = JoinContestText.finished;
                      if (squad.hasParticipated) {
                        buttonText = JoinContestText.participated;
                        status = JoinContestText.participated;
                      }
                      if (maximumParticipated && !squad.hasParticipated) {
                        maximum = true;
                        buttonText =
                          contestName == 'free'
                            ? `${participants} / ${teamsPerUser} Joined`
                            : `${participants} Joined`;
                        // status = `${participants} / ${match?.teamsPerUser} Max Joined`;
                      }
                      const disabled =
                        isParticipating ||
                        kickedOff ||
                        squad.hasParticipated ||
                        maximum;

                      return (
                        <TeamRow
                          time={Number(match.time)}
                          handleShowConfirm={handleShowConfirm}
                          squad={squad}
                          contestId={contestId}
                          loading={loading}
                          disabled={disabled}
                          buttonText={buttonText}
                          status={status}
                          contestPage={contestPage}
                        />
                      );
                    })}
                  </tbody>
                }
              </Table>
            </div>
          </div>
        )}
              <ConfirmTransaction
         
          show={showConfirm}
          onConfirm={addParticipant}
          loading={isParticipating}
          hideModal={handleHideConfirm}
        />
      </div>
      {/* </div> */}
    </>
  );
};

export default DashboardTable;
