import Image from 'next/image';
import React from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Formation, GroupedPlayers } from '@/types/fantasy';
import logger from '@/lib/logger';

const ItemType = {
  PLAYER: 'player',
};

interface Player {
  name: string;
  points: number;
}

interface PlayerCardProps {
  id: string;
  name: string;
  points: number;
  index: number;
  category: keyof GroupedPlayers;
  isSubstitute: boolean;
  enable: boolean;
  moveCard: (
    fromIndex: number,
    toIndex: number,
    category: keyof GroupedPlayers,
    isFromSubstitute: boolean,
    isToSubstitute: boolean,
  ) => void;
}

function PlayerCard({
  id,
  name,
  points,
  index,
  category,
  isSubstitute,
  moveCard,
  enable,
}: PlayerCardProps) {
  const [, ref] = useDrag({
    type: ItemType.PLAYER,
    item: { id, index, category, isSubstitute },
  });

  const [, drop] = useDrop({
    accept: ItemType.PLAYER,
    drop(item: {
      index: number;
      category: keyof GroupedPlayers;
      isSubstitute: boolean;
    }) {
      if (
        item.category === category &&
        (item.index !== index || item.isSubstitute !== isSubstitute)
      ) {
        moveCard(item.index, index, category, item.isSubstitute, isSubstitute);
        item.index = index;
        item.isSubstitute = isSubstitute;
      }
    },
  });

  return isSubstitute ? (
    <li ref={(node) => enable && ref(drop(node))}>
      <h3 className='capitalize'>{category}</h3>
      <div className='goal-playe-post'>
        <Image
          src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/teams/team-bestfoot-club.png'
          alt='shirt5'
        />
        <h5>{name}</h5>
        <h6>{points}</h6>
      </div>
    </li>
  ) : (
    <div ref={(node) => enable && ref(drop(node))} className='img-pnl'>
      <img
        src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/player.png'
        alt='Player'
      />
      <h6>
        {name}
        <span>{points}</span>
      </h6>
    </div>
  );
}

interface Props {
  selectedPlayers: GroupedPlayers;
  teamFormation: Formation;
  substitution: Formation;
  setSelectedPlayers?: React.Dispatch<React.SetStateAction<GroupedPlayers>>;
}

const PlayerGround: React.FC<Props> = ({
  selectedPlayers,
  teamFormation,
  substitution,
  setSelectedPlayers,
}) => {
  /**
   *
   * @param fromIndex
   * @param toIndex
   * @param category
   * @param isFromSubstitute
   * @param isToSubstitute
   * Moves the card from one index to another
   */

  const moveCard = (
    fromIndex: number,
    toIndex: number,
    category: keyof GroupedPlayers,
    isFromSubstitute: boolean,
    isToSubstitute: boolean,
  ) => {
    const players = [...selectedPlayers[category]];
    const mainPlayers = players.slice(0, teamFormation[category]);
    const substitutes = players.slice(teamFormation[category]);

    logger(
      { players, mainPlayers, substitutes, category, fromIndex, toIndex },
      'history1',
    );
    let movedPlayer;
    let replacePlayer;
    if (isFromSubstitute) {
      movedPlayer = substitutes.splice(fromIndex, 1)[0];
      if (isToSubstitute) {
        substitutes.splice(toIndex, 0, movedPlayer);
      } else {
        replacePlayer = mainPlayers.splice(toIndex, 1)[0];
        mainPlayers.splice(toIndex, 0, movedPlayer);
        substitutes.splice(fromIndex, 0, replacePlayer);
      }
    } else {
      movedPlayer = mainPlayers.splice(fromIndex, 1)[0];
      if (isToSubstitute) {
        replacePlayer = substitutes.splice(toIndex, 1)[0];
        mainPlayers.splice(toIndex, 0, replacePlayer);
        substitutes.splice(fromIndex, 0, movedPlayer);
      } else {
        // replacePlayer = mainPlayers.splice(toIndex, 1)[0];
        // mainPlayers.splice(fromIndex, 0, replacePlayer);
        mainPlayers.splice(toIndex, 0, movedPlayer);
      }
    }

    const updatedPlayers = mainPlayers.concat(substitutes);
    logger(
      {
        mainPlayers,
        substitutes,
        category,
        fromIndex,
        toIndex,
        updatedPlayers,
      },
      'history2',
    );
    if (setSelectedPlayers)
      setSelectedPlayers((prevPlayers) => ({
        ...prevPlayers,
        [category]: updatedPlayers,
      }));
  };

  const renderPlayers = (
    category: keyof GroupedPlayers,
    isSubstitute = false,
  ) => {
    const players = isSubstitute
      ? selectedPlayers[category].slice(
          teamFormation[category],
          teamFormation[category] + substitution[category],
        )
      : selectedPlayers[category].slice(0, teamFormation[category]);

    return players.map((player, index) => (
      <PlayerCard
        key={player.name}
        id={player.name}
        index={index}
        name={player.name}
        points={player.points}
        category={category}
        isSubstitute={isSubstitute}
        moveCard={moveCard}
        enable={setSelectedPlayers != undefined}
      />
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='text-center'>
        <div className='player-game-section'>
          <div className='ground'>
            <ul className='ground-match-list'>
              <li>{renderPlayers('goalKeeper')}</li>
              <li>{renderPlayers('defender')}</li>
              <li>{renderPlayers('midfielder')}</li>
              <li>{renderPlayers('forward')}</li>
            </ul>
          </div>
          <div className='goal-postition-pnl'>
            <ul>
              {renderPlayers('goalKeeper', true)}
              {renderPlayers('defender', true)}
              {renderPlayers('midfielder', true)}
              {renderPlayers('forward', true)}
            </ul>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default PlayerGround;
