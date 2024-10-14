import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import {
  PlayerPositions,
  PositionText,
  PlayersMaxCount,
} from '@/constant/variables';
import { GroupedPlayers, TogglePlayerSelection } from '@/types/fantasy';
import { Button, Tab, Table, Tabs } from 'react-bootstrap';
import PlayerRow from './PlayerRow';
import Tippy from '@tippyjs/react';
import logger from '@/lib/logger';

export default function PlayerTabs({
  players,
  onClick,
  selectedPlayers,
  time,
  childRef,
  teamFormation,
  isSubstitude,
  selectedSubstitudePlayers,
  isSearched,
}: {
  onClick: TogglePlayerSelection;
  players: GroupedPlayers | null;
  selectedPlayers: GroupedPlayers;
  time: number;
  childRef?: any;
  teamFormation: any;
  isSubstitude: boolean;
  selectedSubstitudePlayers: GroupedPlayers;
  isSearched: boolean;
}) {
  const [positionCounts, setPositionCounts] = useState<{
    [key: string]: number;
  }>({});
  const [tabDisable, setTabDisable] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const contentRef = useRef(null);
  const [defaultTab, setTabChanged] = useState<string>('goalKeeper');
  const [selectedPlayerType, setSelectedPlayerType] =
    useState<string>('goalKeeper');

  let positions = null;
  let count: any = null;
  let maxCount: any = null;
  if (players) positions = Object.keys(players);

  const isPlayerSelected = (id: string): boolean => {
    let res = selectedPlayers.all.some((p) => p.id === id);
    if (res) {
      return true;
    } else {
      let res2 = selectedSubstitudePlayers.all.some((p) => p.id === id);
      return res2;
    }
  };
  /**
   * isPlayerSelectedInGiveList use to check is player is selected
   *
   * @param {string} id - id to user
   */
  const isPlayerSelectedInGiveList = (id: string): boolean => {
    if (isSubstitude) {
      let isPlayers = selectedPlayers.all.some((p) => p.id == id);

      return isPlayers;
    } else {
      let isPlayers = selectedSubstitudePlayers.all.some((p) => p.id === id);

      return isPlayers;
    }
  };
  /**
   * Capitalizes the first letter of a string and converts the rest to lowercase.
   *
   * @param {string} text - The input text to be transformed.
   * @returns {string} - The transformed text with the first letter capitalized and the rest in lowercase.
   */
  function capitalizeFirstLetter(text: string) {
    if (typeof text !== 'string' || text.length === 0) {
      return text; // Return the input as is if it's not a string or is empty
    }
    text = text + 's';
    // Capitalize the first letter and make the rest lowercase
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Gets the formatted string of the current and maximum count of players for a given position.
   *
   * @param  position - The position to get the player count for.
   * @returns {string} The formatted string showing the current count and maximum count of players for the given position.
   */
  const getPlayersMaxCount = (position: any) => {
    count = positionCounts[position] || 0;
    maxCount = teamFormation[position];
    if (isSubstitude) {
      maxCount = PlayersMaxCount[position] - maxCount;
    }
    if (count < maxCount) {
      return (
        <>
          <Tippy
            content={
              <div>
                <p className='mb-0'>
                  Please select {maxCount} {capitalizeFirstLetter(position)} .
                  you have selected {count}
                </p>
              </div>
            }
          >
            <div className='errbox'>
              {PositionText[position]} {count} /{maxCount}{' '}
              {isClicked && (
                <span className='createTeamsIcon  ms-1'>
                  <i className='fa fa-close err' />
                </span>
              )}
            </div>
          </Tippy>
        </>
      );
    } else {
      return (
        <>
          <div className={`${count === 0 && maxCount === 0 ? 'disabled' : ''}`}>
            {' '}
            {PositionText[position]} {count} /{maxCount}{' '}
            {isClicked && (
              <span className='createTeamsIcon ms-1'>
                <i className='fa fa-check ok' />
              </span>
            )}
          </div>
        </>
      );
    }
  };

  /**
   * handlePositionCount use to count players at spacific position
   *
   * @returns {GroupedPlayers} selected plyers list
   */
  let handlePositionCount = (players: GroupedPlayers) => {
    const counts: { [key: string]: number } = {};
    Object.keys(players).forEach((position) => {
      counts[position] = players[position].length;
    });

    setPositionCounts(counts);
  };
  useEffect(() => {
    if (isSubstitude) {
      // setIsClicked(false);
      handlePositionCount(selectedSubstitudePlayers);
    } else {
      handlePositionCount(selectedPlayers);
    }
  }, [selectedPlayers, isSubstitude, selectedSubstitudePlayers]);

  useImperativeHandle(childRef, () => ({
    triggerFunction,
  }));

  const triggerFunction = () => {
    if (!isClicked) {
      setIsClicked(true);
    }
    let tabs = document.querySelectorAll('.errbox');
    tabs.forEach((e) => {
      e.classList.remove('fouceUser');
    });
    setTimeout(() => {
      tabs.forEach((e) => {
        e.classList.add('fouceUser');
      });
    }, 500);
  };
  useEffect(() => {
    setTabChanged('goalKeeper');
  }, [isSubstitude]);
  let tempSearchedplayerSelect = (PlayerPositions: any, fn: any) => {
    setTabChanged(PlayerPositions);
    return fn();
  };
  function scrolltoTopPlayerTable() {
    let tabContent = document?.querySelector('.hecta-tabs .tab-content');
    if (tabContent) {
      tabContent.scrollTop = 0;
    }
  }
  return (
    <Tabs
      defaultActiveKey={defaultTab}
      onSelect={(k) => {
        setTabChanged(`${k}`);
        scrolltoTopPlayerTable();
      }}
      className={`${isSearched ? 'removeActive' : ''} mb-4`}
      activeKey={defaultTab}
    >
      {positions?.map((position) => {
        return (
          <Tab
            eventKey={position}
            title={getPlayersMaxCount(position)}
            key={position}
            disabled={isSearched || maxCount == 0}
            className='tabbb'
          >
            <div className='table-container'>
              <div className='table-inner-container'>
                <Table className='player-selection-goalkeeper-table'>
                  <thead>
                    <tr>
                      <th>STATUS</th>
                      <th>NAME</th>
                      <th>TEAM NAME</th>
                      <th>PRICE</th>
                      <th>Player No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isSearched ? (
                      Object.values(players).flat().length != 0 ? (
                        Object.values(players)
                          .flat()
                          ?.map((player) => {
                            return (
                              <PlayerRow
                                key={player.id}
                                className={`${isPlayerSelected(player.id) ? 'selected' : ''} ${isPlayerSelectedInGiveList(player.id) ? 'disabledRow' : ''}`}
                                player={player}
                                onUserClick={() =>
                                  setTabChanged(player.positionString)
                                }
                                onClick={
                                  !isPlayerSelectedInGiveList(player.id)
                                    ? onClick
                                    : () => {}
                                }
                                time={time}
                              />
                            );
                          })
                      ) : (
                        <>
                          <tr className='mt-4 text-white '>
                            <td colSpan={5} className='text-center nofound'>
                              No player found
                            </td>
                          </tr>
                        </>
                      )
                    ) : (
                      players?.[position]?.map((player) => {
                        return (
                          <PlayerRow
                            key={player.id}
                            className={`${isPlayerSelected(player.id) ? 'selected' : ''} ${isPlayerSelectedInGiveList(player.id) ? 'disabledRow' : ''}`}
                            player={player}
                            // onClick={onClick}
                            onClick={
                              !isPlayerSelectedInGiveList(player.id)
                                ? onClick
                                : () => {}
                            }
                            onUserClick={() => {}}
                            time={time}
                          />
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </Tab>
        );
      })}
    </Tabs>
  );
}
