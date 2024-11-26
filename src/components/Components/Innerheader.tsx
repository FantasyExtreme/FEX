'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cricket from '../../assets/images/cricket.png';
import { Formation, GroupedPlayers, Match, Player } from '@/types/fantasy';
import {
  MATCHES_CLUB_ICON_SIZES,
  MATCHES_ICON_SIZES,
} from '@/constant/fantasticonst';
import { PlayerPositions } from '@/constant/variables';
import logger from '@/lib/logger';
import { getSubstitutePoints, renamePosition } from '../utils/fantasy';
import Playerslider from './Player-slider';
interface Props {
  match?: Match | null;
  selectedPlayers?: GroupedPlayers;
  teamFormation?: Formation;
  substitution?: Formation;
  squadPoints?: number | null;
  squadRank?: number | null;
  budget?: number | null;
  create?: boolean;
  selectedSubstitudePlayers?: GroupedPlayers;
}
function SubstituteCard({ player }: { player: Player }) {
  return (
    <li>
      <div className='substitue'>
        <div>
          <span>{player?.name}</span>
          <h6>{getSubstitutePoints(player?.points)}</h6>
        </div>
        <div className='player-info-panel'>
          <p>Name</p>
          <h3>{player?.name}</h3>
          <div className='spacer-20' />
          <p>Team Name</p>
          <h3>{player?.teamName}</h3>
          <ul>
            <li>
              <p>Points</p>
              <h3>{getSubstitutePoints(player?.points) ?? '0'}</h3>
            </li>
            <li>
              <p>Position</p>
              <h3>{renamePosition(player?.positionString)}</h3>
            </li>
            <li>
              <p>Price</p>
              <h3>{player?.fantasyPrice}</h3>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
}
function PlayerCard({ player }: { player: Player; index: number }) {
  return (
    <li>
      <div className='player'>
        <img
          src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/player.png'
          alt='Player'
        />
        <div className='player-info-panel'>
          <p>Name</p>
          <h3>{player.name}</h3>
          <div className='spacer-20' />
          <p>Team Name</p>
          <h3>{player.teamName}</h3>
          <p>Position</p>
          <h3>{player.positionString}</h3>
          <ul>
            <li>
              <p>Points</p>
              <h3>{player.points ?? '0'}</h3>
            </li>
            {/* <li>
              <p>Country</p>
              <h3>{player.country}</h3>
            </li> */}
            <li>
              <p>Price</p>
              <h3>{player.fantasyPrice}</h3>
            </li>
          </ul>
        </div>
        <div className='info-span'>
          <h6>{player.name}</h6>
          <h6>{player.points}</h6>
        </div>
      </div>
    </li>
  );
}
export default function Innerheader({
  selectedPlayers,
  teamFormation,
  substitution,
  match,
  squadPoints,
  squadRank,
  budget,
  create,
  selectedSubstitudePlayers,
}: Props) {
  const renderPlayers = (
    category: keyof GroupedPlayers,
    isSubstitute = false,
  ) => {
    if (
      !teamFormation ||
      !substitution ||
      !selectedPlayers ||
      !selectedSubstitudePlayers
    )
      return;

    // let newAllPlayers = [
    //   ...selectedPlayers?.all,
    //   ...selectedSubstitudePlayers?.all ?? [],
    // ];

    const players = isSubstitute
      ? selectedSubstitudePlayers?.[category] ?? []
      : selectedPlayers?.[category] ?? [];

    return players.map((player, index) =>
      isSubstitute ? (
        <SubstituteCard player={player} />
      ) : (
        <PlayerCard index={index} player={player} />
      ),
    );
  };
  let newAllPlayers = [
    ...(selectedPlayers?.all ?? []),
    ...(selectedSubstitudePlayers?.all ?? []),
  ];
  return (
    <>
      <div className='inner-header'>
        <div className='bg-layer' />
        <div className='point-container'>
          <div className='point-inner-container'>
            <div className='point-text-pnl'>
              {create ? (
                <>
                  <div>
                    <h5>Budget</h5>
                    <h6>{budget ?? '0'}</h6>
                  </div>
                  <div>
                    <h5>Selected Players</h5>
                    <h6>{newAllPlayers?.length ?? '0'}</h6>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h5>Rank</h5>
                    <h6>{squadRank ?? '0'}</h6>
                  </div>
                  <div>
                    <h5>Total Points</h5>
                    <h6>{squadPoints ?? '0'}</h6>
                  </div>
                </>
              )}
            </div>
            <div className='compitition-pnl'>
              <span className='soccer-span'>
                {match?.homeTeam?.logo && (
                  <Image
                    style={{ height: '110px', width: '125px' }}
                    className='mx-2 '
                    src={match?.homeTeam?.logo
                      ?.replace('h=40', 'h=200')
                      ?.replace('w=40', 'w=200')}
                    width={MATCHES_CLUB_ICON_SIZES.width}
                    height={MATCHES_CLUB_ICON_SIZES.height}
                    alt='Icon paris'
                  />
                )}{' '}
              </span>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/teams/vs.png'
                alt='Vs'
              />
              <span className='bestfoot-span'>
                {match?.awayTeam?.logo && (
                  <Image
                    className='mx-2'
                    style={{ height: '110px', width: '125px' }}
                    src={match?.awayTeam?.logo
                      ?.replace('h=40', 'h=200')
                      ?.replace('w=40', 'w=200')}
                    width={MATCHES_CLUB_ICON_SIZES.width}
                    height={MATCHES_CLUB_ICON_SIZES.height}
                    alt='Icon paris'
                  />
                )}{' '}
              </span>
            </div>
          </div>
        </div>
        <div className='game-selection-cotnainer'>
          <ul className='game-selection'>
            {renderPlayers(PlayerPositions.goalKeeper, true)}
            {renderPlayers(PlayerPositions.defender, true)}
            {renderPlayers(PlayerPositions.midfielder, true)}
            {renderPlayers(PlayerPositions.forward, true)}
            {/* <li>
            <Link href='#' className='substitue'>
              <div>
                <span>J.Doe</span>
                <h6>1549</h6>
              </div>
              <div className='player-info-panel'>
                <p>Name</p>
                <h3>JOHN DOE</h3>
                <div className='spacer-20' />
                <p>Team Name</p>
                <h3>NALLI TEAM</h3>
                <ul>
                  <li>
                    <p>Points</p>
                    <h3>144</h3>
                  </li>
                  <li>
                    <p>Country</p>
                    <h3>USA</h3>
                  </li>
                  <li>
                    <p>Price</p>
                    <h3>12</h3>
                  </li>
                </ul>
              </div>
            </Link>
          </li> */}
            {/* <li>
            <Link href='#' className='user-link'>
              <Image src={iconuser} alt='Add User' />
            </Link>
          </li> */}
          </ul>
        </div>
        <span className='player keeper'>
          <div className='keeper-inner'>
            {renderPlayers(PlayerPositions.goalKeeper)}
          </div>
        </span>
        <div className='mobile-view-slider'>
          <Playerslider />
        </div>
        <ul className='player-lists left'>
          {/* GoalKeeper */}
          {renderPlayers(PlayerPositions.defender)}
        </ul>
        <ul className='player-lists center'>
          {renderPlayers(PlayerPositions.midfielder)}
        </ul>
        <ul className='player-lists right'>
          {renderPlayers(PlayerPositions.forward)}
        </ul>
      </div>
    </>
  );
}
