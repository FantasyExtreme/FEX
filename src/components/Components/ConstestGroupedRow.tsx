import Image from 'next/image';
import React, { useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import { Contest, GroupedContest, Match } from '@/types/fantasy';
import Link from 'next/link';
import JoinContest from './JoinContest';
import TableLoader from './TableLoader';
import ContestRow from './ContestRow';
import { number } from 'yup';
import logger from '@/lib/logger';

interface Props {
  groupMatches: null | [string, GroupedContest[]][];
  loading: boolean;
  tab: string;
  // contest: Contest;
  handleSelectSquad: (contest: Contest) => void;
  handleShowRanking: (contest: Contest) => void;
  selectedContest: Contest | null;
  match: Match | null;
  timeleft: string;
}
function ContestGroupedRow({
  handleSelectSquad,
  handleShowRanking,
  groupMatches,
  loading,
  tab,
  selectedContest,
  match,
  timeleft,
}: Props) {
  return (
    <>
      {loading ? (
        <TableLoader />
      ) : (
        <>
          {match && (
            <div className='contests_name_div'>
              <h5 className='whitecolor molde-div'>
                <span>
                  {match?.homeTeam.name}
                  &nbsp;
                  <img
                    src={match?.homeTeam.logo}
                    width={30}
                    alt='homeTeamlogo'
                  />{' '}
                </span>
                {match && Number(match.time) < Date.now() ? (
                  <p className='rank mx-3'>
                    {Number(match?.homeScore)} - {Number(match?.awayScore)}{' '}
                  </p>
                ) : (
                  <p className='mt-4 mx-4 w_rank'>VS</p>
                )}
                <span>
                  <img
                    src={match?.awayTeam.logo}
                    alt='awayTeamlogo'
                    width={30}
                  />
                  &nbsp;{match?.awayTeam.name}{' '}
                </span>
              </h5>
            </div>
          )}
          {groupMatches?.map(([matchId, contestArray]) => (
            <div key={matchId}>
              <div className='spacer-10 mt-4' />
              {contestArray?.map((contest) => (
                <ContestRow
                  timeleft={timeleft}
                  handleSelectSquad={handleSelectSquad}
                  handleShowRanking={handleShowRanking}
                  contest={contest as any}
                  selectedContest={selectedContest}
                  match={match}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default ContestGroupedRow;
