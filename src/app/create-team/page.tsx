'use client';
import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Table,
  Form,
  Button,
  Modal,
  Spinner,
} from 'react-bootstrap';
import Image from 'next/image';
import Innerheader from '@/components/Components/Innerheader';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { usePathname, useRouter } from 'next/navigation';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {
  GroupedPlayers,
  Match,
  Player,
  TogglePlayerSelection,
} from '@/types/fantasy';
import {
  ErrorMessage,
  Field,
  Formik,
  FormikValues,
  Form as FormikForm,
} from 'formik';
import {
  MAX_PLAYERS,
  FORMATIONS_AND_SUBSTITUTION,
  initialPlayers,
  MATCHES_ICON_SIZES,
} from '@/constant/fantasticonst';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { object, string } from 'yup';
import {
  MAX_NAME_CHARACTERS,
  MIN_NAME_CHARACTERS,
  ONLY_ALPHABET,
} from '@/constant/validations';
import logger from '@/lib/logger';
import { toast } from 'react-toastify';
import { fromNullable } from '@dfinity/utils';
import {
  generateRandomName,
  generateTeamName,
  getBudget,
  getPlayers,
  isConnected,
  requireAuth,
} from '@/components/utils/fantasy';
import { convertSquadPlayer } from '@/components/utils/convertMotokoObject';
import {
  DefaultTeam,
  EnvironmentEnum,
  PlayerPositions,
  QURIES,
  QueryParamType,
} from '@/constant/variables';
import moment from 'moment';
import PlayerTabs from '@/components/Components/PlayerTabs';
import { smoothScrollTo } from '@/lib/helper';
import ConnectModal from '@/components/Components/ConnectModal';
import authMethods from '@/lib/auth';
import Tippy from '@tippyjs/react';
import { MATCH_CONTEST_ROUTE, MATCHES_ROUTE } from '@/constant/routes';

export default function PlayerSelection() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const matchId = searchParams.get(QURIES.matchId);
  const squadId = searchParams.get(QURIES.squadId);
  const saveButtonText = squadId ? 'Update Team' : 'Create Team';
  const saveButtonTextForModal = squadId ? 'Update' : 'Create Team';
  const [progress, setProgress] = useState(0); // Initialize state for progress

  const [players, setPlayers] = useState<GroupedPlayers | null>(null);
  const [filteredPlayers, setFilteredPlayers] = useState<GroupedPlayers | null>(
    null,
  );
  const [match, setMatch] = useState<any | null>(null);
  const [count, setCount] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [squad, setSquad] = useState<any>();
  const [saving, setSaving] = useState(false);
  const [budget, setBudget] = useState<number | null>(200);
  const [selectedformation, setSelectedformation] = useState<string>('0');

  const [showConnect, setShowConnect] = useState(false);
  const [isSubstituteSelection, setIsSubstituteSelection] =
    useState<boolean>(false);

  const [teamBalance, setteamBalance] = useState<number | null>(null);
  const [teamPlayerCount, setteamPlayerCount] = useState<any>();
  const [playersCount, setPlayerCount] = useState<{
    [key: string]: number;
  } | null>(null);
  const childRef = useRef<any>(null);
  const [selectedPlayers, setSelectedPlayers] =
    useState<GroupedPlayers>(initialPlayers);
  const [selectedSubstitudePlayers, setSelectedSubstitudePlayers] =
    useState<GroupedPlayers>(initialPlayers);
  const [teamFormation, setTeamFormation] = useState({
    goalKeeper: 1,
    defender: 3,
    midfielder: 4,
    forward: 3,
  });

  const [isSearched, setIsSearched] = useState(false);
  let searcRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const [substitution, setSubstitution] = useState({
    goalKeeper: 1,
    defender: 2,
    midfielder: 1,
    forward: 0,
  });

  const sqValues = {
    name: squad?.name ?? '',
  };

  const sqSchema = object().shape({
    name: string()
      .required('Name is required')
      .min(MIN_NAME_CHARACTERS, 'Name can not be less than 3 characters'),
  });

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  function handleShowConnect() {
    setShowConnect(true);
  }
  let submitbtnRef = useRef<HTMLButtonElement>(null);
  function handleHideConnect() {
    setShowConnect(false);
  }
  /**
   * Function to add player into the field according to the position
   * @param player The player that is to be added in the field
   * @param skipFilteer Bool value if you dont want to filter the player out even if it is already added
   */
  const togglePlayerSelection = (
    player: Player,
    skipFilteer?: boolean,
    isInitalSet?: boolean,
    isPlayersSub?: boolean,
    teamformation?: any,
  ) => {
    let tempTeamFormation = teamformation
      ? teamformation.formation
      : teamFormation;
    let tempSubstitution = teamformation
      ? teamformation.substitution
      : substitution;

    logger(player, 'fdsfsdfd:::::');
    // if (teamBalance == null || budget == null) return;

    if (
      [...selectedSubstitudePlayers.all, ...selectedPlayers.all]?.find((p) => {
        return p.id == player.id;
      })
    ) {
      if (skipFilteer) return;
      const filteredAllPlayers = selectedPlayers.all.filter((p) => {
        return p.id != player.id;
      });
      const filteredSubAllPlayers = selectedSubstitudePlayers.all.filter(
        (p) => {
          return p.id != player.id;
        },
      );
      if (player.positionString == PlayerPositions.goalKeeper) {
        const filteredgoalKeeperPlayers = selectedPlayers.goalKeeper.filter(
          (p) => {
            return p.id != player.id;
          },
        );
        const filteredSubstitudegoalKeeperPlayers =
          selectedSubstitudePlayers.goalKeeper.filter((p) => {
            return p.id != player.id;
          });

        if (isSubstituteSelection) {
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            goalKeeper: filteredSubstitudegoalKeeperPlayers,
            all: filteredSubAllPlayers,
          });
        } else {
          setSelectedPlayers({
            ...selectedPlayers,
            goalKeeper: filteredgoalKeeperPlayers,
            all: filteredAllPlayers,
          });
        }
      } else if (player.positionString == PlayerPositions.defender) {
        const filtereddefenderPlayers = selectedPlayers.defender.filter((p) => {
          return p.id != player.id;
        });
        const filteredSubdefenderPlayers =
          selectedSubstitudePlayers.defender.filter((p) => {
            return p.id != player.id;
          });

        if (isSubstituteSelection) {
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            defender: filteredSubdefenderPlayers,
            all: filteredSubAllPlayers,
          });
        } else {
          setSelectedPlayers({
            ...selectedPlayers,
            defender: filtereddefenderPlayers,
            all: filteredAllPlayers,
          });
        }
      } else if (player.positionString == PlayerPositions.midfielder) {
        const filteredmidfielderPlayers = selectedPlayers.midfielder.filter(
          (p) => {
            return p.id != player.id;
          },
        );
        const filteredSubmidfielderPlayers =
          selectedSubstitudePlayers.midfielder.filter((p) => {
            return p.id != player.id;
          });

        if (isSubstituteSelection) {
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            midfielder: filteredSubmidfielderPlayers,
            all: filteredSubAllPlayers,
          });
        } else {
          setSelectedPlayers({
            ...selectedPlayers,
            midfielder: filteredmidfielderPlayers,
            all: filteredAllPlayers,
          });
        }
      } else if (player.positionString == PlayerPositions.forward) {
        const filteredforwardPlayers = selectedPlayers.forward.filter((p) => {
          return p.id != player.id;
        });
        const filteredSubforwardPlayers =
          selectedSubstitudePlayers.forward.filter((p) => {
            return p.id != player.id;
          });

        if (isSubstituteSelection) {
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            forward: filteredSubforwardPlayers,
            all: filteredSubAllPlayers,
          });
        } else {
          setSelectedPlayers({
            ...selectedPlayers,
            forward: filteredforwardPlayers,
            all: filteredAllPlayers,
          });
        }
      }
      setteamBalance((prev) => {
        if (prev !== null) return prev + player.fantasyPrice;
        return prev;
      });
      // setSelectedPlayers({ ...selectedPlayers, all: filteredSelectedPlayers });
    } else {
      const teamCounts: { [key: string]: number } = {};
      [...selectedSubstitudePlayers.all, ...selectedPlayers.all].forEach(
        (player) => {
          if (teamCounts[player.teamId]) {
            teamCounts[player.teamId]++;
          } else {
            teamCounts[player.teamId] = 1;
          }
        },
      );

      for (const key in teamCounts) {
        if (teamCounts[key] >= 9 && player.teamId === key) {
          return toast.error(
            ` You can't select more than 9 players of any team`,
          );
        }
      }

      if (
        selectedPlayers.all.length + selectedSubstitudePlayers.all.length >
        15
      ) {
        return toast.warning("You can't select more than 15 players");
      }
      // if (teamBalance - player.fantasyPrice < 0) {
      //   return toast.warning(
      //     "You don't have enough balance to add this player",
      //   );
      // }
      const newAllPlayers = selectedPlayers.all;
      const newSubAllPlayers = selectedSubstitudePlayers.all;
      if (!(isSubstituteSelection || (isInitalSet && isPlayersSub))) {
        newAllPlayers.push(player);
      } else {
        newSubAllPlayers.push(player);
      }

      let adding = true;

      if (player.positionString == PlayerPositions.goalKeeper) {
        if (
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? selectedSubstitudePlayers.goalKeeper.length
            : selectedPlayers.goalKeeper.length) >=
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? tempSubstitution.goalKeeper
            : tempTeamFormation.goalKeeper)
        ) {
          toast.warning(
            `You can't select more than ${isSubstituteSelection || (isInitalSet && isPlayersSub) ? tempSubstitution.goalKeeper : tempTeamFormation.goalKeeper} Goalkeepers `,
          );

          adding = false;
          if (!(isSubstituteSelection || (isInitalSet && isPlayersSub))) {
            newAllPlayers.pop();
          } else {
            newSubAllPlayers.pop();
          }
          // newAllPlayers.pop();
          return;
        }

        clearInput();
        if (isSubstituteSelection || (isInitalSet && isPlayersSub)) {
          // const newSubAllPlayers = selectedSubstitudePlayers.all;
          // newSubAllPlayers.push(player);
          const newSubgoalKeeperPlayers = selectedSubstitudePlayers.goalKeeper;
          newSubgoalKeeperPlayers.push(player);
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            all: newSubAllPlayers,
            goalKeeper: newSubgoalKeeperPlayers,
          });
        } else {
          const newgoalKeeperPlayers = selectedPlayers.goalKeeper;
          newgoalKeeperPlayers.push(player);
          setSelectedPlayers({
            ...selectedPlayers,
            all: newAllPlayers,
            goalKeeper: newgoalKeeperPlayers,
          });
        }
      } else if (player.positionString == PlayerPositions.defender) {
        if (
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? selectedSubstitudePlayers.defender.length
            : selectedPlayers.defender.length) >=
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? tempSubstitution.defender
            : tempTeamFormation.defender)
        ) {
          toast.warning(
            `You can't select more than ${isSubstituteSelection || (isInitalSet && isPlayersSub) ? tempSubstitution.defender : tempTeamFormation.defender} defenders  `,
          );
          adding = false;
          if (!(isSubstituteSelection || (isInitalSet && isPlayersSub))) {
            newAllPlayers.pop();
          } else {
            newSubAllPlayers.pop();
          }
          // newAllPlayers.pop();

          return;
        }

        clearInput();
        if (isSubstituteSelection || (isInitalSet && isPlayersSub)) {
          // const newSubAllPlayers = selectedSubstitudePlayers.all;
          // newSubAllPlayers.push(player);
          const newSubdefenderPlayers = selectedSubstitudePlayers.defender;
          newSubdefenderPlayers.push(player);
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            all: newSubAllPlayers,
            defender: newSubdefenderPlayers,
          });
        } else {
          const newdefenderPlayers = selectedPlayers.defender;
          newdefenderPlayers.push(player);

          setSelectedPlayers({
            ...selectedPlayers,
            all: newAllPlayers,
            defender: newdefenderPlayers,
          });
        }
      } else if (player.positionString == PlayerPositions.midfielder) {
        if (
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? selectedSubstitudePlayers.midfielder.length
            : selectedPlayers.midfielder.length) >=
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? tempSubstitution.midfielder
            : tempTeamFormation.midfielder)
        ) {
          toast.warning(
            `You can't select more than ${isSubstituteSelection || (isInitalSet && isPlayersSub) ? tempSubstitution.midfielder : tempTeamFormation.midfielder} midfielder `,
          );
          adding = false;
          if (!(isSubstituteSelection || (isInitalSet && isPlayersSub))) {
            newAllPlayers.pop();
          } else {
            newSubAllPlayers.pop();
          }
          // newAllPlayers.pop();

          return;
        }

        clearInput();
        if (isSubstituteSelection || (isInitalSet && isPlayersSub)) {
          // const newSubAllPlayers = selectedSubstitudePlayers.all;
          // newSubAllPlayers.push(player);
          const newSubmidfielderPlayers = selectedSubstitudePlayers.midfielder;
          newSubmidfielderPlayers.push(player);
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            all: newSubAllPlayers,
            midfielder: newSubmidfielderPlayers,
          });
        } else {
          const newmidfielderPlayers = selectedPlayers.midfielder;
          newmidfielderPlayers.push(player);

          setSelectedPlayers({
            ...selectedPlayers,
            all: newAllPlayers,
            midfielder: newmidfielderPlayers,
          });
        }
      } else if (player.positionString == PlayerPositions.forward) {
        if (
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? selectedSubstitudePlayers.forward.length
            : selectedPlayers.forward.length) >=
          (isSubstituteSelection || (isInitalSet && isPlayersSub)
            ? tempSubstitution.forward
            : tempTeamFormation.forward)
        ) {
          toast.warning(
            `You can't select more than ${isSubstituteSelection || (isInitalSet && isPlayersSub) ? tempSubstitution.forward : tempTeamFormation.forward} forward `,
          );
          adding = false;
          if (!(isSubstituteSelection || (isInitalSet && isPlayersSub))) {
            newAllPlayers.pop();
          } else {
            newSubAllPlayers.pop();
          }
          // newAllPlayers.pop();

          return;
        }

        clearInput();
        if (isSubstituteSelection || (isInitalSet && isPlayersSub)) {
          // const newSubAllPlayers = selectedSubstitudePlayers.all;
          // newSubAllPlayers.push(player);

          const newSubforwardPlayers = selectedSubstitudePlayers.forward;
          newSubforwardPlayers.push(player);
          setSelectedSubstitudePlayers({
            ...selectedSubstitudePlayers,
            all: newSubAllPlayers,
            forward: newSubforwardPlayers,
          });
        } else {
          const newforwardPlayers = selectedPlayers.forward;
          newforwardPlayers.push(player);
          setSelectedPlayers({
            ...selectedPlayers,
            all: newAllPlayers,
            forward: newforwardPlayers,
          });
        }
      }

      if (adding) {
        setteamBalance((prev) => {
          if (prev !== null) return prev - player.fantasyPrice;
          return prev;
        });
      }
    }
  };
  /**
   * take formatino and substitute and select it
   *  @param {string} index the index
   */
  function handleFormationSelect(index: string) {
    setTeamFormation(FORMATIONS_AND_SUBSTITUTION[Number(index)]?.formation);
    setSubstitution(FORMATIONS_AND_SUBSTITUTION[Number(index)]?.substitution);
  }
  /**
   * The function to take the name of the team in the values params and adds the team with the selected players to the canister
   *  @param {FormikValuesf} values Formik values object with name as the value
   */
  async function saveTeam(values: FormikValues) {
    setSaving(true);
    setTimeout(() => {
    setSaving(false);
    toast.success("Team created successfully.")
    resetPlayers(true);
    router.push(MATCHES_ROUTE);
    }, 2000);
    // let allPlayers = [...selectedPlayers.all, ...selectedSubstitudePlayers.all];
    // let goalKepersPlayers = [
    //   ...selectedPlayers.goalKeeper,
    //   ...selectedSubstitudePlayers.goalKeeper,
    // ];
    // let midfielderPlayers = [
    //   ...selectedPlayers.midfielder,
    //   ...selectedSubstitudePlayers.midfielder,
    // ];
    // let forwardPlayers = [
    //   ...selectedPlayers.forward,
    //   ...selectedSubstitudePlayers.forward,
    // ];
    // let defenderPlayers = [
    //   ...selectedPlayers.defender,
    //   ...selectedSubstitudePlayers.defender,
    // ];

    // if (allPlayers?.length < MAX_PLAYERS) {
    //   setSaving(false);
    //   return toast.warning(`Please select ${MAX_PLAYERS} players`);
    // }

    // try {
    //   let _goalkeeper = goalKepersPlayers?.map((player, index) => {
    //     if (index >= teamFormation?.goalKeeper) {
    //       logger({
    //         index,
    //         tgk: teamFormation?.goalKeeper - 1,
    //         lg: index >= teamFormation?.goalKeeper - 1,
    //       });
    //       return [player.id, true];
    //     } else {
    //       return [player.id, false];
    //     }
    //   });
    //   let _defender = defenderPlayers?.map((player, index) => {
    //     if (index >= teamFormation?.defender) {
    //       return [player.id, true];
    //     } else {
    //       return [player.id, false];
    //     }
    //   });
    //   let _midfielder = midfielderPlayers?.map((player, index) => {
    //     if (index >= teamFormation?.midfielder) {
    //       return [player.id, true];
    //     } else {
    //       return [player.id, false];
    //     }
    //   });
    //   let _forward = forwardPlayers.map((player, index) => {
    //     if (index >= teamFormation?.forward) {
    //       return [player.id, true];
    //     } else {
    //       return [player.id, false];
    //     }
    //   });
    //   let newPlayers = [
    //     ..._goalkeeper,
    //     ..._defender,
    //     ..._midfielder,
    //     ..._forward,
    //   ];
    //   let formationString = `${teamFormation?.defender}-${teamFormation?.midfielder}-${teamFormation?.forward}`;
    //   let squad = {
    //     name: values.name,
    //     matchId: matchId,
    //     cap: '',
    //     viceCap: '',
    //     players: newPlayers,
    //     formation: `${teamFormation?.defender}-${teamFormation?.midfielder}-${teamFormation?.forward}`,
    //   };
    //   if (squadId) {
    //     const addedSquad = await auth.actor.updatePlayerSquad(squadId, squad);
    //     if (addedSquad?.ok) {
    //       toast.success('Team Updated');
    //       resetPlayers(true);
    //       router.push(
    //         `${MATCH_CONTEST_ROUTE}matchId=${matchId}&type=${QueryParamType.simple}`,
    //       );
    //     } else if (addedSquad?.err) {
    //       toast.error(addedSquad?.err);
    //     }
    //     // toast.success('Team Updated');
    //     // router.push(
    //     //   `${TEAMS_ROUTE}?matchId=${matchId}&type=${QueryParamType.simple}`,
    //     // );
    //     // resetPlayers(true);

    //     logger(addedSquad, 'sSquad updated');
    //   } else {
    //     const addedSquad = await auth.actor.addPlayerSquad(squad);
    //     if (addedSquad?.ok) {
    //       toast.success(addedSquad?.ok);
    //       resetPlayers(true);
    //       router.push(
    //         `${MATCH_CONTEST_ROUTE}matchId=${matchId}&type=${QueryParamType.simple}`,
    //       );
    //     } else if (addedSquad?.err) {
    //       toast.error(addedSquad?.err);
    //     }

    //     logger(addedSquad, 's:::::');
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    // setSaving(false);
  }
  /**
   * The function to take the name of the team in the values params and adds the team with the selected players to the canister
   *  @param {FormikValuesf} values Formik values object with name as the value
   */
  const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  async function saveDefaultTeam(values: FormikValues) {
    setSaving(true);
    if (process.env.NEXT_PUBLIC_DFX_NETWORK != EnvironmentEnum.dev || !players)
      return toast.error('Only available to worthy hackers');
    try {
      const selectRandomPlayers = (
        playerArray: any[],
        count: number,
        subCount: number,
      ) => {
        const shuffled = shuffleArray(playerArray);
        return shuffled.slice(0, count + subCount).map((player, index) => {
          return [player.id, index >= count];
        });
      };

      let _goalkeeper = selectRandomPlayers(
        players?.goalKeeper || [],
        teamFormation.goalKeeper,
        substitution.goalKeeper,
      );
      let _defender = selectRandomPlayers(
        players?.defender || [],
        teamFormation.defender,
        substitution.defender,
      );
      let _midfielder = selectRandomPlayers(
        players?.midfielder || [],
        teamFormation.midfielder,
        substitution.midfielder,
      );
      let _forward = selectRandomPlayers(
        players?.forward || [],
        teamFormation.forward,
        substitution.forward,
      );

      let newPlayers = [
        ..._goalkeeper,
        ..._defender,
        ..._midfielder,
        ..._forward,
      ];

      let formationString = `${teamFormation?.defender}-${teamFormation?.midfielder}-${teamFormation?.forward}`;

      let squad = {
        ...DefaultTeam,
        matchId: matchId,
        players: newPlayers,
        formation: formationString,
        name: generateTeamName(),
      };
      logger(squad, 'adding it ');
      const addedSquad = await auth.actor.addPlayerSquad(squad);
      if (addedSquad?.ok) {
        toast.success(addedSquad?.ok);
        router.push(
          `${MATCH_CONTEST_ROUTE}matchId=${matchId}&type=${QueryParamType.simple}`,
        );
      } else if (addedSquad?.err) {
        toast.error(addedSquad?.err);
      }

      logger(addedSquad, 's:::::');
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  }
  /**
   * Reset the selected players
   */
  function resetPlayers(all?: boolean) {
    if (all) {
      setSelectedSubstitudePlayers({
        all: [],
        goalKeeper: [],
        defender: [],
        midfielder: [],
        forward: [],
      });
      setSelectedPlayers({
        all: [],
        goalKeeper: [],
        defender: [],
        midfielder: [],
        forward: [],
      });
    } else {
      if (isSubstituteSelection) {
        setSelectedSubstitudePlayers({
          all: [],
          goalKeeper: [],
          defender: [],
          midfielder: [],
          forward: [],
        });
        // setIsSubstituteSelection(false);
      } else {
        setSelectedPlayers({
          all: [],
          goalKeeper: [],
          defender: [],
          midfielder: [],
          forward: [],
        });
      }
    }
  }
  /**
   * Get the match and players and store in the states
   */
  async function fetchMatch(isSquad: boolean) {
    const match: any = fromNullable(await auth.actor.getMatch(matchId));
    if (match) {
      setMatch({
        ...match,
        homeTeam: fromNullable(match?.homeTeam[1]),
        awayTeam: fromNullable(match?.awayTeam[1]),
        homeTeamId: match?.homeTeam[0],
        awayTeamId: match?.awayTeam[0],

        time: Number(match.time),
      });
      const ids = [
        { id: match?.homeTeam[0], name: match?.homeTeam[1][0].name },
        { id: match?.awayTeam[0], name: match?.awayTeam[1][0].name },
      ];
      let players = await getPlayers({
        auth,
        setCount,
        setPlayers,
        ids,
      });
      if (isSquad) {
        fetchSquad(players);
      }
    }
  }
  /**
   * Search the players from the grouped array of players
   * @param searchTerm search string
   */
  const searchPlayers = (searchTerm: string) => {
    if (searchTerm.trim() !== '') {
      if (!isSearched) setIsSearched(true);
    } else {
      if (isSearched) setIsSearched(false);
    }
    if (!players) return;
    const searchLower = searchTerm.toLowerCase().trim();

    const filterPlayer = (player: Player): boolean => {
      return (
        player.name.toLowerCase().includes(searchLower) ||
        player.country.toLowerCase().includes(searchLower) ||
        player.teamName.toLowerCase().includes(searchLower)
      );
    };

    const filteredGroupedPlayers: GroupedPlayers = {};

    Object.keys(players).forEach((role) => {
      filteredGroupedPlayers[role] = players[role].filter(filterPlayer);
    });

    setFilteredPlayers(filteredGroupedPlayers);
  };
  function findFormationIndex(formationString: string) {
    // Convert the string to a formation object
    const [defender, midfielder, forward] = formationString
      .split('-')
      .map(Number);
    const formationObj = { goalKeeper: 1, defender, midfielder, forward };

    // Find the index of the formation in the array
    const index = FORMATIONS_AND_SUBSTITUTION.findIndex(
      (item) =>
        item.formation.goalKeeper === formationObj.goalKeeper &&
        item.formation.defender === formationObj.defender &&
        item.formation.midfielder === formationObj.midfielder &&
        item.formation.forward === formationObj.forward,
    );

    return index;
  }
  async function fetchSquad(players: GroupedPlayers) {
    const _squad: any = fromNullable(await auth.actor.getPlayerSquad(squadId));
    // resetPlayers();

    if (_squad) {
      let formationIndex = findFormationIndex(_squad?.formation).toString();
      setSelectedformation(formationIndex);
      handleFormationSelect(formationIndex);
      logger({ _squad, formationIndex }, 'formationIndex');
      let formation = FORMATIONS_AND_SUBSTITUTION[Number(formationIndex)];
      _squad.players = _squad?.players?.map((player: any) => {
        for (let newPlayer of players) {
          if (newPlayer.id == player[0]) {
            const role = Object.keys(newPlayer.position).find(
              (key) => key !== 'undefined',
            );
            newPlayer.positionString = role;
            togglePlayerSelection(newPlayer, true, true, player[2], formation);
            return newPlayer;
          }
        }
      });

      setSquad(_squad);
    }
  }
  useEffect(() => {
    if (players?.goalKeeper && players?.goalKeeper?.length >= 0) {
      // fetchSquad();
    }
    setFilteredPlayers(players);
  }, [players]);
  useEffect(() => {
    resetPlayers(true);
  }, []);
  useEffect(() => {
    if (auth.actor) {
      fetchMatch(false);
      if (teamBalance != null || budget != null) return;
      getBudget(auth.actor, setBudget, setteamBalance);
    }
  }, [matchId, auth.actor]);
  useEffect(() => {
    if (!isConnected(auth.state) || !teamBalance || !budget || !squadId) return;

    fetchMatch(true);
  }, [squadId, budget, auth.state]);
  useEffect(() => {
    if (auth.actor && squadId) {
      // fetchSquad();
    }
  }, [squadId, budget, auth.actor]);

  const getAllTeams = (players: Player[]) => {
    const teamCounts: { [key: string]: number } = {};

    players.forEach((player) => {
      if (teamCounts[player.teamId]) {
        teamCounts[player.teamId]++;
        setteamPlayerCount(teamPlayerCount + 1);
      } else {
        teamCounts[player.teamId] = 1;
      }
    });

    for (const team in teamCounts) {
      if (teamCounts[team] > 9) {
        toast.error(
          `Team ${team} has more than 9 players. You can't select more than 9 players of any team`,
        );
        break;
      } else {
        handleShowModal();
      }
    }
  };

  const TeamCountComponent = () => {
    // if (childRef.current) {
    //   childRef.current.triggerFunction();
    // }
    if (
      selectedPlayers?.all?.length + selectedSubstitudePlayers?.all.length <
      15
    ) {
    } else {
      getAllTeams([...selectedPlayers?.all, ...selectedSubstitudePlayers.all]);
    }
  };
  useEffect(() => {
    if (selectedPlayers || selectedSubstitudePlayers) {
      const teamCounts: { [key: string]: number } = {};

      [...selectedPlayers.all, ...selectedSubstitudePlayers.all].forEach(
        (player) => {
          if (teamCounts[player.teamId]) {
            teamCounts[player.teamId]++;
          } else {
            teamCounts[player.teamId] = 1;
          }
        },
      );
      setPlayerCount(teamCounts);
    }
  }, [selectedPlayers, selectedSubstitudePlayers]);
  const targetRef = useRef<HTMLDivElement>(null);
  function backToTop() {
    window.scrollTo({
      top: 1100,
      behavior: 'smooth',
    });
  }
  useEffect(() => {
    let ani = setTimeout(() => {
      backToTop();
    }, 3000);
    // Cleanup if needed
    return () => {
      clearTimeout(ani);
    };
  }, []);
  useEffect(() => {
    if (window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  let backBtnClicked = () => {
    setIsSubstituteSelection(false);
  };
  let nextBtnClicked = () => {
    // if(isSubstituteSelection){
    //   if(selectedSubstitudePlayers.all.length < )

    // }

    let totalPlayersToBeSelected = 0;
    for (const key in teamFormation) {
      totalPlayersToBeSelected += teamFormation[key];
    }

    if (selectedPlayers?.all?.length >= totalPlayersToBeSelected) {
      setIsSubstituteSelection(true);
    } else {
      if (childRef.current) {
        childRef.current.triggerFunction();
      }
      setIsSubstituteSelection(false);
    }
    if (
      isSubstituteSelection &&
      selectedPlayers?.all?.length + selectedSubstitudePlayers.all.length < 15
    ) {
      if (childRef.current) {
        childRef.current.triggerFunction();
      }
    }
  };

  /**
   * clickRef use to submit button click after login
   */
  let clickRef = () => {
    if (submitbtnRef.current) {
      submitbtnRef?.current?.click();
    }
  };
  const clearInput = () => {
    if (searcRef.current) {
      searcRef.current.value = '';
      searchPlayers('');
    }
  };

  useEffect(() => {
    const totalSelectedPlayers =
      selectedPlayers?.all?.length + selectedSubstitudePlayers?.all?.length ||
      0;
    const progressPercentage = (totalSelectedPlayers / 15) * 100;

    setProgress(progressPercentage);
  }, [selectedPlayers, selectedSubstitudePlayers]);
  return (
    <>
      <div className='team-selection-main'>
        <div className='team-content-header'>
          <Innerheader
            substitution={substitution}
            selectedPlayers={selectedPlayers}
            selectedSubstitudePlayers={selectedSubstitudePlayers}
            teamFormation={teamFormation}
            match={match}
            budget={teamBalance}
            create={true}
          />
        </div>

        <Container
          fluid
          className='inner-page create-team-panel pt-0 '
          ref={targetRef}
        >
          <Row>
            <Container>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <div className='gray-panel creatTeam'>
                    <Row>
                      <Col xl='5' lg='4'>
                        <h4 className='animeleft tablet-view-none whitecolor Nasalization fw-normal'>
                          {isSubstituteSelection ? 'Substitute ' : 'Player'}{' '}
                          <span>Selection</span>
                        </h4>
                      </Col>
                      <Col xl='7' lg='8'>
                        <div className='flexooo jus-end animeright'>
                          <Form.Select
                            className='button-select select-select Z_ind'
                            aria-label='Default select example'
                            value={selectedformation}
                            // disabled={isSubstituteSelection}
                            onChange={(e) => {
                              const value = e.target.value;
                              setIsSubstituteSelection(false);
                              setSelectedformation(value);
                              handleFormationSelect(value);
                              resetPlayers(true);
                            }}
                          >
                            {FORMATIONS_AND_SUBSTITUTION?.map(
                              ({ formation, substitution }, i) => {
                                return (
                                  <option
                                    key={i}
                                    value={i}
                                    // selected={selectedformation == i}
                                  >
                                    {`${formation.defender}-${formation.midfielder}-${formation.forward}`}
                                  </option>
                                );
                              },
                            )}
                          </Form.Select>
                          <Button
                            onClick={() => resetPlayers()}
                            className='reg-btn trans-white  mid text-capitalize mx-3 Z_ind'
                          >
                            Reset
                          </Button>
                          {/* <Button
                            onClick={TeamCountComponent}
                            // disabled={selectedPlayers?.all?.length < 15}
                            className='reg-btn mid text-capitalize'
                          >
                            {saveButtonText}
                          </Button> */}
                          <Button
                            onClick={() => {
                              backBtnClicked();
                            }}
                            disabled={!isSubstituteSelection}
                            className='reg-btn mid text-capitalize Z_ind'
                          >
                            back
                          </Button>
                          {isSubstituteSelection &&
                          selectedPlayers?.all?.length +
                            selectedSubstitudePlayers.all.length >=
                            15 ? (
                            <Button
                              onClick={TeamCountComponent}
                              disabled={
                                selectedPlayers?.all?.length +
                                  selectedSubstitudePlayers.all.length <
                                15
                              }
                              className='reg-btn mid text-capitalize mx-3'
                            >
                              {saveButtonText}
                            </Button>
                          ) : (
                            <Tippy
                              content={
                                <p className='mb-0'>
                                  Please select substitutes
                                </p>
                              }
                            >
                              <Button
                                onClick={() => {
                                  nextBtnClicked();
                                }}
                                // disabled={selectedPlayers?.all?.length < 15}
                                className='reg-btn mx-3 mid text-capitalize Z_ind'
                              >
                                next
                              </Button>
                            </Tippy>
                          )}
                          {process.env.NEXT_PUBLIC_DFX_NETWORK ==
                            EnvironmentEnum.dev && (
                            <Button
                              onClick={saveDefaultTeam}
                              className='reg-btn mid text-capitalize'
                            >
                              {'add default team'}
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <div className='spacer-40' />
                    <Row className=' progress-tabs-bar'>
                      <Col className='mx-0 px-0'>
                        <div
                          className={`progress_bar_ ${!isSubstituteSelection ? 'progress_bar_bg_green' : 'progress_bar_bg_dark'}`}
                          style={{
                            borderTopLeftRadius: '30px',
                            borderBottomLeftRadius: '30px',
                          }}
                        >
                          <h6
                            className={`'animeleft  Nasalization fw-normal' ${isSubstituteSelection ? 'whitecolor' : 'text-dark'}`}
                          >
                            Player <span>Selection</span>
                          </h6>
                        </div>
                      </Col>
                      <Col className='mx-0 px-0'>
                        <div
                          className={`progress_bar_  ${isSubstituteSelection ? 'progress_bar_bg_green text-dark' : 'progress_bar_bg_dark'}`}
                          style={{
                            borderTopRightRadius: '30px',
                            borderBottomRightRadius: '30px',
                          }}
                        >
                          <h6
                            className={`'animeleft  Nasalization fw-normal' ${isSubstituteSelection ? 'text-dark' : ' whitecolor'}`}
                          >
                            Substitute <span>Selection</span>
                          </h6>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={{ span: 10, offset: 1 }}>
                        <Form onSubmit={(e) => e.preventDefault()}>
                          <Form.Group className='mb-4'>
                            <Form.Label>Search</Form.Label>
                            <Form.Control
                              type='search'
                              placeholder='Search for players...'
                              onChange={(e) => searchPlayers(e.target.value)}
                              ref={searcRef}
                              className='search-input'
                            />
                          </Form.Group>
                        </Form>
                      </Col>
                      <Col lg={{ span: 10, offset: 1 }}>
                        <div className='hecta-tabs mobile'>
                          <PlayerTabs
                            onClick={togglePlayerSelection}
                            players={filteredPlayers}
                            selectedPlayers={selectedPlayers}
                            time={match?.time}
                            childRef={childRef}
                            teamFormation={teamFormation}
                            selectedSubstitudePlayers={
                              selectedSubstitudePlayers
                            }
                            isSubstitude={isSubstituteSelection}
                            isSearched={isSearched}
                          />
                          <div className='w-100 d-flex justify-content-center align-items-end text-center mt-4 '>
                            <span className=''>
                              <Image
                                className='mx-2'
                                src={match?.homeTeam?.logo
                                  ?.replace('h=40', 'h=200')
                                  ?.replace('w=40', 'w=200')}
                                width={MATCHES_ICON_SIZES.width}
                                height={MATCHES_ICON_SIZES.height}
                                alt='Icon paris'
                              />
                            </span>
                            <span className=' text-white'>
                              {(playersCount &&
                                playersCount[match?.homeTeamId]) ??
                                0}{' '}
                            </span>
                            <span className='text-center text-white'> - </span>
                            <span className=' text-white'>
                              {(playersCount &&
                                playersCount[match?.awayTeamId]) ??
                                0}
                            </span>

                            <span className='me-3'>
                              <Image
                                className='mx-2'
                                src={match?.awayTeam?.logo
                                  ?.replace('h=40', 'h=200')
                                  ?.replace('w=40', 'w=200')}
                                width={MATCHES_ICON_SIZES.width}
                                height={MATCHES_ICON_SIZES.height}
                                alt='Icon paris'
                              />{' '}
                            </span>
                          </div>
                          {/* <div className='mt-3'>
                            <h4 className='animeleft whitecolor Nasalization fw-normal'>
                              {isSubstituteSelection ? 'Substitute ' : 'Player'}{' '}
                              <span>Selection</span>
                            </h4>
                            <ProgressBar
                              now={progress}
                              label={
                                progress === 0
                                  ? '0%'
                                  : `${Math.round(progress)}%`
                              }
                              className='custom-progress-bar'
                            />
                          </div> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Container>
          </Row>
        </Container>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          <h5 className='text-center'> {saveButtonText}</h5>
          <p>Team Name</p>
          <Formik
            initialValues={sqValues}
            validationSchema={sqSchema}
            onSubmit={saveTeam}
          >
            {({ isSubmitting, handleChange, handleBlur }) => (
              <FormikForm>
                <div>
                  <Field name='name'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Control
                          type='text'
                          placeholder='Team Name'
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='name'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='name'
                      component='div'
                    />
                  </div>
                </div>
                <div className='spacer-10' />
                <div className='btn-list-div'>
                  <Button
                    className='reg-btn mid text-capitalize whitecolor mx-2'
                    // onClick={saveTeam}
                    ref={submitbtnRef}
                    onClick={(e) => {
                      if (!requireAuth(auth.state))
                        handleShowConnect(), e.preventDefault();
                    }}
                    disabled={saving}
                    type='submit'
                  >
                    {saving ? (
                      <Spinner animation='border' size='sm' />
                    ) : (
                      saveButtonTextForModal
                    )}
                  </Button>
                  <Button
                    className='reg-btn trans-white mid text-capitalize mx-2'
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={clickRef}
      />
    </>
  );
}
