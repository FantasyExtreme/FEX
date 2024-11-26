import { TEAM_CREATION_ROUTE } from '@/constant/routes';
import { QURIES } from '@/constant/variables';
import { PlayerSquad, SelectSquadProps } from '@/types/fantasy';
import Link from 'next/link';
import React from 'react';
import { utcToLocal } from '../utils/utcToLocal';

const PlayerSquadRow = ({
  squad,
  selectSquad,
}: {
  squad: PlayerSquad;
  selectSquad: (props: SelectSquadProps) => void;
}) => {
  function handleSelect() {
    selectSquad({ iSquadId: squad.id, iMatchId: squad.matchId });
  }
  let tmepDate = BigInt(Number(Date.now()));

  return (
    <tr>
      <td>
        <b style={{ cursor: 'pointer' }} onClick={handleSelect}>
          {squad.name}
        </b>
      </td>
      <td>{squad.points}</td>
      <td className='text-center'>{squad.rank}</td>
      <td className='text-right'>
        {squad.matchTime && squad.matchTime > tmepDate && (
          <Link
            href={`${TEAM_CREATION_ROUTE}?${QURIES.squadId}=${squad.id}&${QURIES.matchId}=${squad.matchId}`}
            className='transparent mx-2'
          >
            <i className='fa fa-edit' />
          </Link>
        )}
        {/* <button onClick={handleSelect} className='transparent'>
          <i className='fa fa-eye' />
        </button> */}
      </td>
    </tr>
  );
};

export default PlayerSquadRow;
