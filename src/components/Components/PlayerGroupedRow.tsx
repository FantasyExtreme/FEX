import {
  CONTESTS_ROUTE,
  MATCHES_CONTESTS_ROUTE,
  TEAM_CREATION_ROUTE,
} from '@/constant/routes';
import { QueryParamType, QURIES } from '@/constant/variables';
import { GroupedPlayer, PlayerSquad, SelectSquadProps } from '@/types/fantasy';
import Link from 'next/link';
import React from 'react';
import { Spinner, Table } from 'react-bootstrap';
import PlayerSquadRow from './PlayerSquadRow';
import Loader from './Loader';
import TableLoader from './TableLoader';

const PlayerGroupedRow = ({
  groupMatches,
  loading,
  tab,
  admin,
  selectSquad,
}: {
  groupMatches: null | [string, GroupedPlayer[]][];
  loading: boolean;
  admin?: boolean;
  tab: string;
  selectSquad: (props: SelectSquadProps) => void;
}) => {
  return (
    <>
      {loading ? (
        <TableLoader />
      ) : (
        groupMatches?.map(([matchId, squads]) => (
          <div key={matchId} className='table-container'>
            <div className='table-inner-container'>
              <Table className='team-table'>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>POINTS</th>
                    <th style={{ textAlign: 'center' }}>RANK</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <h5>
                        <span>{squads[0].matchName}</span>
                      </h5>
                    </td>
                    <td colSpan={2} className='text-right'>
                      <Link
                        href={`${MATCHES_CONTESTS_ROUTE}matchId=${matchId}&type=${QueryParamType.simple}`}
                        className='reg-btn mid text-capitalize'
                      >
                        View Contests
                      </Link>
                    </td>
                  </tr>

                  {squads.map((squad) => (
                    <PlayerSquadRow selectSquad={selectSquad} squad={squad} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default PlayerGroupedRow;
