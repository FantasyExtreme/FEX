import {
  MATCH_CONTEST_ROUTE,
  TEAM_CREATION_ROUTE,
  TEAMS_ROUTE,
} from '@/constant/routes';
import { QueryParamType, QURIES } from '@/constant/variables';
import Link from 'next/link';
import React from 'react';
import { Button, Table } from 'react-bootstrap';
import BeatLoader from 'react-spinners/BeatLoader';
import {  isDev, sliceText } from '../utils/fantasy';
import { Match, PlayerSquad } from '@/types/fantasy';
import Tippy from '@tippyjs/react';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

interface Props {
  handleShowConfirm: (id: string) => void;
  squad: PlayerSquad;
  disabled: boolean;
  buttonText: string;
  loading: boolean;
  status: string;
  isDashboard?: boolean;
  time: number | undefined;
  matchId?: string;
  contestId?: string | null;
  contestPage?: boolean;
  handleShowContestModel?: any;
}
function TeamRow({
  handleShowConfirm,
  time,
  squad,
  disabled,
  buttonText,
  loading,
  status,
  isDashboard,
  contestId,
  matchId,
  contestPage,
  handleShowContestModel,
}: Props) {
  let router = useRouter();
  return (
    <tr key={squad.id} className='border-active ds'>
      <td className='no-bg'>
        <div
          className={`d-flex align-items-center justify-content-center match-action `}
        >
          {time && time > Date.now() ? (
            <Link
              className='underlined  normal small'
              href={`${TEAM_CREATION_ROUTE}?${QURIES.squadId}=${squad.id}&${QURIES.matchId}=${squad.matchId}`}
            >
              {/* <i className='fa fa-edit' /> */}
              Edit
            </Link>
          ) : (
            <Link
              className='underlined ms-2 normal small'
              href={`${TEAMS_ROUTE}?${QURIES.squadId}=${squad.id}&${QURIES.contestId}=${contestId}&type=${QueryParamType.simple}`}
              onClick={(e) => {
                e.preventDefault();

                if (isDashboard) {
                  handleShowContestModel({
                    matchId,
                    teamId: squad.id,
                    rankingModle: true,
                  });
                } else {
                  router.push(
                    `${TEAMS_ROUTE}?${QURIES.squadId}=${squad.id}&${QURIES.contestId}=${contestId}&type=${QueryParamType.simple}`,
                  );
                }
              }}
            >
              {/* <i className='fa fa-eye' /> */}
              View
            </Link>
          )}

          {!isDev() && disabled ? null : (
            <span
              // onClick={() => handleShowConfirm(squad.id)}
              onClick={() => {
                if (matchId && handleShowContestModel) {
                  handleShowContestModel({
                    matchId,
                    teamId: squad.id,
                    rankingModle: false,
                  });
                } else {
                  handleShowConfirm(squad.id);
                }
              }}
              // disabled={disabled && !isDev()}
              className='underlined ms-2 empty  text-capitalize contestbtn'
              style={{ minWidth: '0' }}
            >
              {loading ? <BeatLoader color='white' size={10} /> : buttonText}
            </span>
          )}
        </div>
      </td>
      <td
        className='text-center truncate no-bg'
        onClick={() => {
          router.push(`${MATCH_CONTEST_ROUTE}matchId=${matchId}&type=0`);
        }}
      >
        <Tippy content={squad.name}>
          <span className='truncate'> {sliceText(squad.name, 0, 10)} </span>
        </Tippy>
      </td>
      {!contestPage && (
        <td
          className='no-bg'
          onClick={() => {
            router.push(`${MATCH_CONTEST_ROUTE}matchId=${matchId}&type=0`);
          }}
        >
          {squad.points}
        </td>
      )}
      {!isDashboard && <td className='no-bg'>{squad.rank}</td>}
      {isDashboard ? (
        <td className='no-bg'>
          {squad.joinedContestsName != '' ? (
            <Tippy content={squad.joinedContestsName}>
              <div className='truncate mxwidth'>{squad.joinedContestsName}</div>
            </Tippy>
          ) : (
            <span className={`${status} status`}>{status}</span>
          )}
        </td>
      ) : (
        <td className='no-bg'>
          <span className={`${status} status`}>{status}</span>
        </td>
      )}
    </tr>
  );
}

export default TeamRow;
