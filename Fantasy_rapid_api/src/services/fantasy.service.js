const axios = require("axios");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const {
  makeFantasyFootballActor,
} = require("../canister_caller/service/actor-locator");
const { fromNullable } = require("@dfinity/utils");
const logger = require("../utils/Logger");
const { Ed25519KeyIdentity } = require("@dfinity/identity");
const fs = require("fs").promises;
const path = require("path");
const { updateStats } = require("../cron-jobs/StatsJob");

const serializedIdentity = process.env.PRIVATE_KEY;
const identity = Ed25519KeyIdentity.fromJSON(serializedIdentity);
const fantasyFootball = makeFantasyFootballActor({
  agentOptions: {
    identity,
  },
});
function convertPosition(pos) {
  switch (pos) {
    case "Goalkeeper":
      return { goalKeeper: null };
    case "Defender":
      return { defender: null };
    case "Midfielder":
      return { midfielder: null };
    case "Attacker":
      return { forward: null };
    default:
      return { defender: null };
  }
}
/**
 * @param obj the (key,value) pair returned from canister
 * @returns Merges the key of (key,value) in the value object as id
 */
function convertMotokoObject(obj) {
  return { id: obj[0], ...obj[1] };
}

/**
 * Appends a new log entry to the transfer logs JSON file.
 *
 * @param {object} logData - The data to be logged, which will be added to the log entry along with a timestamp.
 * @return {Promise<void>} Resolves when the log entry has been successfully written to the file.
 */
async function appendLogToJsonFile(logData) {
  const logFilePath = path.join(__dirname, "transfer_logs.json");

  try {
    // Read existing logs
    let logs = [];
    try {
      const data = await fs.readFile(logFilePath, "utf8");
      logs = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, start with an empty array
      if (error.code !== "ENOENT") throw error;
    }

    // Add new log
    logs.push({
      timestamp: new Date().toISOString(),
      ...logData,
    });

    // Write updated logs back to file
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
}

const convertPositiontest = (position) => {
  // Convert the position string to the desired format
  const positionMapping = {
    Goalkeeper: "goalkeeper",
    Defender: "defender",
    Midfielder: "midfielder",
    Attacker: "attacker",
  };
  return positionMapping[position] || "fantasy";
};
// Function to fetch and transform teams
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getTournaments = async (data) => {
  // logger(pageSize, offset )
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.sportmonks.com/v3/football/leagues",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: process.env.SPORT_MONKS_KEY,
      },
    };
    logger("canister::::", await fantasyFootball.getTournaments());

    const response = await axios.request(config);
    var data = response.data;
    logger("data::::", data);

    try {
      const newTeams = data.map((team, index) => {
        return {
          name: team.name,
          tournamentId: ScrapperObj.tournamentId,
          logo: team.logo,
          shortName: "",
          id: index.toString(),
        };
      });
      fantasyFotaball
        .addTeams(newTeams)
        .then((added) => {
          logger("added teams", added);
        })
        .catch((error) => {
          console.error("Error adding teams:", error);
        });
    } catch (error) {
      console.error(error);
    }

    return null;
  } catch (error) {
    throw new Error("Error : " + error.message);
  }
};

const getTeamsBySeason = async (leagueId, seasonId) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api-football-v1.p.rapidapi.com/v3/teams?league=${leagueId}&season=${seasonId}`,
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key":  process.env.API_KEY,
      },
    };

    const response = await axios.request(config);
    return response.data.response; // Return the teams array
  } catch (error) {
    console.error("Error: ", error.message);
    throw new Error("Error: " + error.message);
  }
};

// Function to fetch squad by team and season
const getSquadByTeam = async (teamId) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api-football-v1.p.rapidapi.com/v3/players/squads?team=${teamId}`,
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key":  process.env.API_KEY,
      },
    };

    const response = await axios.request(config);
    return response.data.response[0]?.players ?? []; // Return the players array
  } catch (error) {
    console.error(`Error fetching squad for team ${teamId}: `, error.message);
    return null; // Return null if squad is not found
  }
};

const getUpcomingFixtures = async (leagueId, season) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=${season}`,
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key":  process.env.API_KEY,
      },
    };

    const response = await axios.request(config);
    const fixtures = response.data.response;
    // logger("Getting mathes", fixtures, "blue");
    const upcomingFixtures = fixtures.map((fixture) => {
      const location = fixture?.fixture?.venue?.name
        ? `${fixture.fixture.venue.name}, ${fixture.fixture.venue.city}`
        : "no location";

      const status = fixture.fixture.status
        ? `${fixture.fixture.status.long}`
        : "fantasy";

      return {
        fixture_id: fixture.fixture.id,
        name: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
        starting_at: fixture.fixture.date,
        home_team: fixture.teams.home.name,
        away_team: fixture.teams.away.name,
        home_team_logo: fixture.teams.home.logo,
        away_team_logo: fixture.teams.away.logo,
        location: location,
        status: status,
        result_info: {
          halftime: fixture.score.halftime,
          fulltime: fixture.score.fulltime,
          extratime: fixture.score.extratime,
          penalty: fixture.score.penalty,
          goals: fixture.goals,
        },
      };
    });

    return upcomingFixtures;
  } catch (error) {
    console.error("Error fetching upcoming fixtures: ", error.message);
    throw new Error("Error fetching upcoming fixtures: " + error.message);
  }
};

// Function to fetch league details including seasons
const fetchLeagueDetails = async (leagueId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api-football-v1.p.rapidapi.com/v3/leagues?id=${leagueId}`,
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key":  process.env.API_KEY,
    },
  };

  try {
    const response = await axios.request(config);
    return response.data.response[0]; // Assuming response is an array with one element
  } catch (error) {
    console.error(
      "Error fetching league details for leagueId:",
      leagueId,
      error.message
    );
    return null; // Return null in case of error
  }
};

const uploadTournaments = async (data) => {
  try {
    // Configure the request to use RapidAPI
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key":  process.env.API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    // Make the API request
    const response = await axios.request(config);
    const data = response.data.response;

    // Process the data to extract tournaments and seasons
    const newTournaments = [];
    const seasons = [];

    data.forEach((tournament, index) => {
      const tournamentId = index.toString();

      // Create tournament object
      newTournaments.push({
        id: tournamentId,
        providerId: tournament.league.id.toString(),
        country: tournament.country.name, // Assuming you want the country name instead of ID
        name: tournament.league.name,
        description: tournament.league.type, // Assuming 'type' can be used as description
        startDate: new Date(tournament.seasons[0].start).getTime(), // Using the start date of the first season
        endDate: new Date(tournament.seasons[0].end).getTime(), // Using the end date of the first season
      });
    });

    logger("Uploading these tournaments:", newTournaments);

    // Upload the tournaments
    await fantasyFootball
      .addTournaments(newTournaments)
      .then((added) => {
        logger("Tournaments uploaded successfully:", added);
      })
      .catch((error) => {
        console.error("Error adding tournaments:", error);
      });

    return "Uploaded";
  } catch (error) {
    console.error(
      "Error processing and uploading tournaments and seasons:",
      error
    );
  }
};

const uploadTournamentsbyIds = async () => {
  try {
    // Configure the request to use RapidAPI
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key":  process.env.API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    // Make the API request
    const response = await axios.request(config);
    const data = response.data.response;

    // Filter to include only the leagues with the specified IDs
    const filteredLeagueIds = ["140", "586", "333", "269"];
    const newTournaments = [];

    data.forEach((tournament) => {
      const leagueId = tournament.league.id.toString();

      if (filteredLeagueIds.includes(leagueId)) {
        // Create tournament object
        newTournaments.push({
          id: leagueId,
          providerId: leagueId,
          country: tournament.country.name,
          name: tournament.league.name,
          description: tournament.league.type,
          startDate: new Date(tournament.seasons[0].start).getTime(),
          endDate: new Date(tournament.seasons[0].end).getTime(),
        });
      }
    });

    logger("Uploading these tournaments:", newTournaments);

    // Upload the tournaments
    await fantasyFootball
      .addTournaments(newTournaments)
      .then((added) => {
        logger("Tournaments uploaded successfully:", added);
      })
      .catch((error) => {
        console.error("Error adding tournaments:", error);
      });

    return "Uploaded";
  } catch (error) {
    console.error(
      "Error processing and uploading tournaments and seasons:",
      error
    );
  }
};
const getTransfersByTeamId = async (teamId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.API_URL}/transfers?team=${teamId}`,
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.API_KEY,
    },
  };
  let configTeams = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.API_URL}/players/squads?team=${teamId}`,
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.API_KEY,
    },
  };
  // Make the API request
  const responseTeams = await axios.request(configTeams);
  const dataTeams = responseTeams.data.response[0];
  // Make the API request
  const response = await axios.request(config);
  const data = response.data.response;

  const transfers = [];
  for (item of data) {
    const dateThreshold = new Date("2024-08-08T00:00:00+00:00");
    const updateDate = new Date(item.update);
    // const itemDate = new Date(data.date);

    // if (itemDate > dateThreshold) {
    //   return data;
    // }
    if (updateDate > dateThreshold) {
      const transferDateThreshold = new Date("2024-08-08").getTime();

      item.transfers = item.transfers.filter(
        (transfer) =>
          new Date(transfer.date).getTime() > transferDateThreshold &&
          new Date(transfer.date).getTime() < new Date().getTime()
      );
      if (item.transfers?.length > 0) transfers.push(item);
      // console.log("dis on ok", item,teamId,item.transfers[0],transferDateThreshold, new Date());
      // console.log(item.transfers);
    }
  }
  const transformedTransfers = [];
  for (let item of transfers) {
    // console.log(item);
    let player = dataTeams?.players?.find((x) => x.id == item.player.id);
    if (!player) continue;
    const position = convertPosition(player.position) || {
      fantasy: null,
    };
    let refinedPlayer = {
      providerId: player.id.toString(),
      name: player.name || "fantasy",
      position: position || { defender: null },
      country: "fantasy" || "fantasy",
      fantasyPrice: 0,
      nationality: "fantasy" || "fantasy",
      teamId: "",
      id: uuidv4(),
      number: player.number || 0,
      photo: player.photo || "no link",
    };

    for (let transfer of item.transfers) {
      const _transferIn = {
        isActive: true,
        teamId: transfer.teams.in.id ? transfer.teams.in.id.toString() : "0",
        playerId: item.player.id?.toString() ?? "0",
        player: refinedPlayer,
      };
      const _transferOut = {
        isActive: false,
        teamId: transfer.teams.out.id ? transfer.teams.out.id.toString() : "0",
        playerId: item.player.id?.toString() ?? "0",
        player: refinedPlayer,
      };
      transformedTransfers.push(_transferIn, _transferOut);
    }
  }
  return transformedTransfers;
};
const uploadSeasons = async (data) => {
  try {
    // Fetch tournaments data
    const tournaments = await fantasyFootball.getTournaments();
    // Map of tournament IDs to their sportmonks IDs
    const tournamentMap = new Map(tournaments);
    // Extract providerId values into an array
    const providerIds = Array.from(tournamentMap.values()).map(
      (league) => league.providerId
    );
    const { v4: uuidv4 } = require("uuid");

    const seasons = [];

    for (const leagueId of providerIds) {
      // await delay(1000); // Introduce a 2-second delay between API calls

      const leagueDetails = await fetchLeagueDetails(leagueId);
      if (!leagueDetails) {
        console.error(`Skipping leagueId ${leagueId} due to fetch error.`);
        continue; // Skip this leagueId if fetching league details failed
      }

      const currentSeason = leagueDetails.seasons.find(
        (season) => season.current
      );
      const upcomingSeason = leagueDetails.seasons.find(
        (season) => new Date(season.start) > new Date()
      );

      let selectedSeason;
      if (currentSeason) {
        selectedSeason = currentSeason;
      } else if (upcomingSeason) {
        selectedSeason = upcomingSeason;
      } else {
        console.error(
          `No current or upcoming seasons found for leagueId: ${leagueId}`
        );
        continue; // Skip this leagueId if no valid season is found
      }

      seasons.push({
        id: uuidv4(), // Generate unique ID
        seasonName: selectedSeason.year.toString(), // Assuming the year can be used as the season name
        startDate: new Date(selectedSeason.start).getTime(),
        endDate: new Date(selectedSeason.end).getTime(),
        tournamentId: Array.from(tournamentMap.keys()).find(
          (key) => tournamentMap.get(key).providerId === leagueId
        ),
        providerId: selectedSeason.year.toString(), // Assuming the year can be used as the provider ID
      });
    }

    logger("Uploading these seasons:", seasons);

    // Upload the season details
    await fantasyFootball
      .addSeasons(seasons)
      .then((added) => {
        logger("Seasons uploaded successfully:", added);
      })
      .catch((error) => {
        console.error("Error uploading seasons:", error);
      });

    return "Uploaded";
  } catch (error) {
    console.error("Error processing and uploading seasons:", error);
  }
};

const uploadTournamentsAndSeasons = async () => {
  try {
    // Configure the request to use RapidAPI
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key":  process.env.API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    // Log the current tournaments
    // logger("canister::::", await fantasyFootball.getTournaments());

    // Make the API request
    const response = await axios.request(config);
    const data = response.data.response;

    // Process the data to extract tournaments and seasons
    const newTournaments = [];
    const seasons = [];

    data.forEach((tournament, index) => {
      const tournamentId = index.toString();

      // Create tournament object
      newTournaments.push({
        id: tournamentId,
        providerId: tournament.league.id.toString(),
        country: tournament.country.name, // Assuming you want the country name instead of ID
        name: tournament.league.name,
        description: tournament.league.type, // Assuming 'type' can be used as description
        startDate: new Date(tournament.seasons[0].start).getTime(), // Using the start date of the first season
        endDate: new Date(tournament.seasons[0].end).getTime(), // Using the end date of the first season
      });

      // Process seasons for the tournament
      tournament.seasons.forEach((season) => {
        if (season.current || new Date(season.start) > new Date()) {
          seasons.push({
            id: uuidv4(), // Generate unique ID
            seasonName: season.year.toString(), // Assuming the year can be used as the season name
            startDate: new Date(season.start).getTime(),
            endDate: new Date(season.end).getTime(),
            tournamentId: tournamentId,
            providerId: season.year.toString(), // Assuming the year can be used as the provider ID
          });
        }
      });
    });

    logger("Uploading these tournaments:", newTournaments);
    logger("Uploading these seasons:", seasons);

    // Upload the tournaments
    await fantasyFootball
      .addTournaments(newTournaments)
      .then((added) => {
        logger("Tournaments uploaded successfully:", added);
      })
      .catch((error) => {
        console.error("Error adding tournaments:", error);
      });
    logger("Seasons::::::::::::::::::", seasons);
    // Upload the season details
    await fantasyFootball
      .addSeasons(seasons)
      .then((added) => {
        logger("Seasons uploaded successfully:", added);
      })
      .catch((error) => {
        console.error("Error uploading seasons:", error);
      });

    return "Uploaded";
  } catch (error) {
    console.error(
      "Error processing and uploading tournaments and seasons:",
      error
    );
  }
};

const fetchAndTransformTeams = async () => {
  try {
    const tournaments = await fantasyFootball.getTournaments();

    for (const [providerId, tournamentData] of tournaments) {
      const tournamentProviderId = tournamentData.providerId; // Use tournamentData.providerId instead of providerId

      const tournamentSeasons = await fantasyFootball.getSeasons(providerId);

      for (const [seasonId, seasonData] of tournamentSeasons) {
        const seasonName = seasonData.seasonName; // Accessing seasonName directly
        const teams = await getTeamsBySeason(tournamentProviderId, seasonName);

        const transformedTeams = teams.map((team) => ({
          providerId: team.team.id.toString(),
          name: team.team.name,
          shortName: team.team.code || "fantasy",
          logo: team.team.logo || "fantasy",
          seasonId: seasonId,
          id: uuidv4(),
        }));

        logger("teams:::::::::::::::::", transformedTeams);

        // Uncomment the following lines to upload the teams
        await fantasyFootball
          .addTeams(transformedTeams)
          .then((added) => {
            logger(
              `Teams for season ${seasonId} uploaded successfully:`,
              added
            );
          })
          .catch((error) => {
            console.error(
              `Error uploading teams for season ${seasonId}:`,
              error
            );
          });
      }
    }

    return "Uploaded";
  } catch (error) {
    console.error("Error fetching and transforming teams:", error);
  }
};

/**
 * @description Update the stats of player
 */
const updateStats2 = async () => {
  try {
    const tenDaysLater = moment().add(10, "days").valueOf();
    const resp = await fantasyFootball.getUpcomingMatches(
      { search: "", status: "", page: 0, limit: 1 },
      tenDaysLater
    );

    const tempMatch = {
      id: "17171531946723535614bd70cf7-ed67-48ef-bfff-07091ee0fa4e",
      status: "Match Finished",
      homeTeam: "17171395049636404747d46828e-559f-4326-9b8c-7a9b432b0726",
      time: "1700917200000",
      seasonId: "171713802918800362056e1c394-b9f3-45c1-bdb8-85ea21e0b108",
      awayTeam: "1717139504963640474912ffe72-b219-45e0-8d0e-14f30d442821",
      providerId: "1038089",
      location: "Estadio de Vallecas, Madrid",
    };
    const teamIds = resp.matches.reduce((acc, match) => {
      acc.push(match.homeTeam, match.awayTeam);
      return acc;
    }, []);
    const playerResp = await fantasyFootball.getPlayersByTeamIds([
      tempMatch.homeTeam,
      tempMatch.awayTeam,
    ]);
    const players = playerResp?.ok[0]?.map((player) => ({
      id: player[0],
      ...player[1],
    }));
    // logger(resp, "dem plauyerss manmmmmm");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api-football-v1.p.rapidapi.com/v3/fixtures/players?fixture=${tempMatch.providerId}`,
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key":  process.env.API_KEY,
      },
    };
    axios
      .request(config)
      .then(async (response) => {
        const data = response.data;
        const playersData = data?.response
          ?.map((obj) => [...obj.players])
          .flat();
        // for(player )
        const playerStats = [];

        playersData.forEach((playerData) => {
          players.forEach((player) => {
            if (player.providerId == playerData.player.id) {
              const rating = playerData.statistics[0].games?.rating || "0";
              const stats = convertObject(playerData.statistics[0]);
              playerStats.push({
                rating: rating,
                stats,
                matchId: tempMatch.id,
                playerId: player.id,
              });
            }
          });
        });
        const updated = await fantasyFootball.updatePlayersStats(playerStats);
        logger("disssssss", updated);
      })

      .catch((error) => {
        logger(error);
      });
  } catch (error) {
    console.error("Error uploading stats:", error);
  }
};

const fetchAndTransformSquads = async () => {
  try {
    const tournaments = await fantasyFootball.getTournaments();
    for (const [tournamentId] of tournaments) {
      const seasons = await fantasyFootball.getSeasons(tournamentId);
      // const seasonEntries = Object.entries(seasons);

      for (const [seasonId, seasonData] of seasons) {
        await delay(1000); // Delay to prevent rate limiting
        const teamsResp = await fantasyFootball.getTeamsBySeason(seasonId);
        const teams = teamsResp?.ok[0].map((team) => ({
          id: team[0],
          ...team[1],
          seasonId: seasonId,
          seasonproviderId: seasonData.providerId,
        }));

        for (const team of teams) {
          await delay(1000); // Delay to prevent rate limiting
          const squad = await getSquadByTeam(team.providerId);

          if (!Array.isArray(squad)) {
            throw new Error(
              `Expected squad to be an array, but got ${typeof squad}`
            );
          }

          if (squad.length === 0) {
            logger(
              `Squad for team ${team.providerId} in season ${team.seasonproviderId} is empty.`
            );
            continue;
          }

          try {
            logger("squads", squad[0], "blue");
            const players = squad.map((player) => {
              const position = convertPosition(player.position) || {
                fantasy: null,
              };
              // const nationality = player.nationality_id ? player.nationality_id.toString() : "fantasy";

              return {
                providerId: player.id.toString(),
                name: player.name || "fantasy",
                position: position || { defender: null },
                country: "fantasy" || "fantasy",
                fantasyPrice: 0,
                teamId: team.id.toString() || "fantasy",
                number: player.number,
                photo: player.photo,
                id: uuidv4(),
              };
            });
            await fantasyFootball
              .addPlayers(players)
              .then((added) => {
                logger(
                  `Players for team ${team.providerId} in season ${team.seasonproviderId} uploaded successfully:`,
                  added
                );
              })
              .catch((error) => {
                console.error(
                  `Error uploading players for team ${team.providerId} in season ${team.seasonproviderId}:`,
                  error
                );
              });
          } catch (error) {
            console.error("Error fetching and transforming squads:", error);
          }
        }
        logger("seasonend::::::::::::::::::::::");
      }
    }

    return "Uploaded";
  } catch (error) {
    console.error("Error fetching and transforming squads:", error);
  }
};

// Function to process and upload seasons
const uploadMatchesFixtures = async () => {
  try {
    const tournaments = await fantasyFootball.getTournaments();

    for (const [tournamentId, tournamentData] of tournaments) {
      const seasons = await fantasyFootball.getSeasons(tournamentId);

      for (const [seasonId, seasonData] of seasons) {
        await delay(1000); // Delay to prevent rate limiting

        // Assuming `getUpcomingFixtures` is adapted to take providerId and seasonName
        const fixtures = await getUpcomingFixtures(
          tournamentData.providerId,
          seasonData.seasonName
        );

        if (!Array.isArray(fixtures)) {
          throw new Error(
            `Expected fixtures to be an array, but got ${typeof fixtures}`
          );
        }

        if (fixtures.length === 0) {
          logger(`Fixtures for season ${seasonData.seasonName} are empty.`);
          continue;
        }

        try {
          const transformedFixtures = fixtures.map((fixture) => ({
            providerId: fixture.fixture_id.toString(),
            homeTeamName: fixture.home_team || "fantasy",
            awayTeamName: fixture.away_team || "fantasy",
            time: new Date(fixture.starting_at).getTime(),
            location: fixture.location,
            status: fixture.status,
            id: uuidv4(),
            seasonId: seasonId,
            homeScore: fixture.result_info.fulltime.home || 0,
            awayScore: fixture.result_info.fulltime.away || 0,
          }));

          logger("fixtures::::::::::::::::::", fixtures[0]);

          await fantasyFootball
            .addMatches(transformedFixtures)
            .then((added) => {
              logger(
                `Fixtures for season ${seasonData.seasonName} uploaded successfully:`,
                added
              );
            })
            .catch((error) => {
              console.error(
                `Error uploading fixtures for season ${seasonData.seasonName}:`,
                error
              );
            });
        } catch (error) {
          console.error("Error fetching and transforming fixtures:", error);
        }
      }
    }

    return "Uploaded";
  } catch (error) {
    console.error("Error fetching and transforming fixtures:", error);
  }
};
/**
 * Upload matches of a tournament
 * @param providerTournamentId Provider id of the tournament
 */
const uploadMatchesFixturesByIds = async (
  providerTournamentId,
  fromSeason = null
) => {
  try {
    const tournaments = await fantasyFootball.getTournaments();

    for (const [tournamentId, tournamentData] of tournaments) {
      if (providerTournamentId == tournamentData.providerId) {
        const seasons = await fantasyFootball.getSeasons(tournamentId);

        for (const [seasonId, seasonData] of seasons) {
          await delay(1000); // Delay to prevent rate limiting

          // Assuming `getUpcomingFixtures` is adapted to take providerId and seasonName
          const fixtures = await getUpcomingFixtures(
            tournamentData.providerId,
            seasonData.seasonName
          );

          if (!Array.isArray(fixtures)) {
            throw new Error(
              `Expected fixtures to be an array, but got ${typeof fixtures}`
            );
          }

          if (fixtures.length === 0) {
            logger(`Fixtures for season ${seasonData.seasonName} are empty.`);
            continue;
          }

          try {
            const transformedFixtures = fixtures.map((fixture) => ({
              providerId: fixture.fixture_id.toString(),
              homeTeamName: fixture.home_team || "fantasy",
              awayTeamName: fixture.away_team || "fantasy",
              time: new Date(fixture.starting_at).getTime(),
              location: fixture.location,
              status: fixture.status,
              id: uuidv4(),
              seasonId: seasonId,
              homeScore: fixture.result_info.fulltime.home || 0,
              awayScore: fixture.result_info.fulltime.away || 0,
            }));

            // logger("fixtures::::::::::::::::::", transformedFixtures);
            if (fromSeason) {
              await fantasyFootball
                .addNewMatches(transformedFixtures, fromSeason)
                .then((added) => {
                  logger(
                    `Fixtures for season ${seasonData.seasonName} updated successfully:`,
                    added
                  );
                })
                .catch((error) => {
                  console.error(
                    `Error uploading fixtures for season ${seasonData.seasonName}:`,
                    error
                  );
                });
            } else {
              await fantasyFootball
                .addMatches(transformedFixtures)
                .then((added) => {
                  logger(
                    `Fixtures for season ${seasonData.seasonName} uploaded successfully:`,
                    added
                  );
                })
                .catch((error) => {
                  console.error(
                    `Error uploading fixtures for season ${seasonData.seasonName}:`,
                    error
                  );
                });
            }
          } catch (error) {
            console.error("Error fetching and transforming fixtures:", error);
          }
        }
      }
    }

    return "Uploaded";
  } catch (error) {
    console.error("Error fetching and transforming fixtures:", error);
  }
};

const getMatchesForUpcomingDays = async () => {
  const seasons = [
    {
      id: "b25b1592-162b-46e3-a62d-e6a7c8b1fe78",
      seasonName: "2023/2024",
      startDate: 1691193600000,
      endDate: 1716076800000,
      tournamentId: "17162956643803742791",
      providerId: "21787",
    },
    {
      id: "ea59abca-2c3d-4c87-a1d0-a75c5ff8a8f3",
      seasonName: "2023/2024",
      startDate: 1715040000000,
      endDate: 1716681600000,
      tournamentId: "17162956643803742792",
      providerId: "23471",
    },
    {
      id: "0f7451a0-faff-4cc7-bf61-afca9abcf0e1",
      seasonName: "2020/2021",
      startDate: 1494547200000,
      endDate: 1496534400000,
      tournamentId: "17162956643803742793",
      providerId: "18101",
    },
    {
      id: "7def34a5-c800-485f-bc3a-e9905c179f19",
      seasonName: "2023/2024",
      startDate: 1689897600000,
      endDate: 1716681600000,
      tournamentId: "17162956643803742790",
      providerId: "21644",
    },
  ];

  const matchPromises = seasons.map(async (season) => {
    const fixtures = await getUpcomingFixtures(season.providerId);
    return fixtures.map((fix) => ({
      providerId: fix.fixture_id.toString(),
      homeTeamName: fix.home_team,
      awayTeamName: fix.away_team,
      time: new Date(fix.starting_at).getTime(),
      location: fix.name,
      id: uuidv4(), // Generate a unique ID for each match
      seasonId: season.id,
    }));
  });

  const allMatches = await Promise.all(matchPromises);
  const matches = allMatches.flat(); // Flatten the array of arrays into a single array

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
  const dayAfterTomorrowStart = tomorrowStart + 24 * 60 * 60 * 1000;

  const matchesToday = matches.filter(
    (match) => match.time >= todayStart && match.time < tomorrowStart
  );
  const matchesTomorrow = matches.filter(
    (match) => match.time >= tomorrowStart && match.time < dayAfterTomorrowStart
  );
  const matchesDayAfterTomorrow = matches.filter(
    (match) =>
      match.time >= dayAfterTomorrowStart &&
      match.time < dayAfterTomorrowStart + 24 * 60 * 60 * 1000
  );

  logger("Matches today:", matchesToday);
  logger("Matches tomorrow:", matchesTomorrow);
  logger("Matches day after tomorrow:", matchesDayAfterTomorrow);

  return {
    matchesToday,
    matchesTomorrow,
    matchesDayAfterTomorrow,
  };
};
/**
 * Upload all the date (teams,players,matches) of a league using its id
 * @param {string} leagueId the provider id of the league you want to upload
 */
const getCurrentSeason = (seasons) => {
  const currentSeason = seasons.find((season) => season.current);
  const upcomingSeason = seasons.find(
    (season) => new Date(season.start) > new Date()
  );

  let selectedSeason;
  if (currentSeason) {
    selectedSeason = currentSeason;
  } else if (upcomingSeason) {
    selectedSeason = upcomingSeason;
  } else {
    console.error(
      `No current or upcoming seasons found for leagueId: ${leagueId}`
    );
  }
  return selectedSeason;
};
const uploadLeague = async (leagueId) => {
  // takes provider id of the tournamet

  const leagueDetails = await fetchLeagueDetails(leagueId);
  if (!leagueDetails) {
    console.error(`Failed to fetch leagueId ${leagueId}.`);
  }
  const currentSeason = leagueDetails.seasons.find((season) => season.current);
  const upcomingSeason = leagueDetails.seasons.find(
    (season) => new Date(season.start) > new Date()
  );

  let selectedSeason;
  if (currentSeason) {
    selectedSeason = currentSeason;
  } else if (upcomingSeason) {
    selectedSeason = upcomingSeason;
  } else {
    console.error(
      `No current or upcoming seasons found for leagueId: ${leagueId}`
    );
  }
  const resp = await fantasyFootball.getSeasonByProvider(
    selectedSeason.year.toString(),
    leagueId
  );
  const _season = fromNullable(resp);
  if (_season) {
    await uploadMatchesFixturesByIds(leagueId, _season.id);
    return "updated matches";
  }
  const tournament = {
    id: leagueId,
    providerId: leagueId,
    country: leagueDetails.country.name,
    name: leagueDetails.league.name,
    description: leagueDetails.league.type,
    startDate: new Date(selectedSeason.start).getTime(),
    endDate: new Date(selectedSeason.end).getTime(),
  };
  const season = {
    id: uuidv4(), // Generate unique ID
    seasonName: selectedSeason.year.toString(), // Assuming the year can be used as the season name
    startDate: new Date(selectedSeason.start).getTime(),
    endDate: new Date(selectedSeason.end).getTime(),
    tournamentId: "",
    providerId: selectedSeason.year.toString(), // Assuming the year can be used as the provider ID
  };
  const teams = await getTeamsBySeason(
    leagueId,
    selectedSeason.year.toString()
  );
  const transformedTeams = [];
  for (let i = 0; i < teams.length; i++) {
    let { team } = teams[i];
    logger("uploading team", team.name, "cyan");
    const squad = await getSquadByTeam(team.id);

    if (!Array.isArray(squad)) {
      throw new Error(`Expected squad to be an array, but got ${typeof squad}`);
    }

    if (squad.length === 0) {
      logger(
        `Squad for team ${
          team.id
        } in season ${selectedSeason.year.toString()} is empty.`
      );
    }

    try {
      const players = squad.map((player) => {
        const position = convertPosition(player.position) || {
          fantasy: null,
        };
        // const nationality = player.nationality_id ? player.nationality_id.toString() : "fantasy";

        logger(
          "uploading player",
          { name: player.name, n: player.number, p: player.photo },
          "cyan"
        );
        return {
          providerId: player.id.toString(),
          name: player.name || "fantasy",
          position: position || { defender: null },
          country: "fantasy" || "fantasy",
          fantasyPrice: 0,
          nationality: "fantasy" || "fantasy",
          teamId: "",
          id: uuidv4(),
          number: player.number || 0,
          photo: player.photo || "no link",
        };
      });

      transformedTeams.push({
        providerId: team.id.toString(),
        name: team.name,
        players,
        shortName: team.code || "fantasy",
        logo: team.logo || "fantasy",
        seasonId: "",
        id: uuidv4(),
      });
    } catch (error) {
      console.error("Error Adding league (team & squad):", error);
    }
  }
  await fantasyFootball.addLeague(tournament, season, transformedTeams);
  await uploadMatchesFixturesByIds(leagueId);
  // await fantasyFootball
  //   .addTournament(tournament)
  //   .then(async (added) => {
  //     await fantasyFootball
  //       .addSeason(season)
  //       .then(async (added) => {
  //         const seasonName = seasonData.seasonName; // Accessing seasonName directly

  //         logger("teams:::::::::::::::::", transformedTeams);

  //         // Uncomment the following lines to upload the teams
  //         await fantasyFootball
  //           .addTeams(transformedTeams)
  //           .then((added) => {
  //             logger(
  //               `Teams for season ${seasonId} uploaded successfully:`,
  //               added
  //             );
  //           })
  //           .catch((error) => {
  //             console.error(
  //               `Error uploading teams for season ${seasonId}:`,
  //               error
  //             );
  //           });

  //         logger("Season uploaded successfully:", added);
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading season:", error);
  //       });
  //     logger("Tournament uploaded successfully:", added);
  //   })
  //   .catch((error) => {
  //     console.error("Error adding tournament:", error);
  //   });

  return "Uploaded";
};
async function transferLeaguePlayers(leagueId) {
  try {
    const leagueDetails = await fetchLeagueDetails(leagueId);
    if (!leagueDetails) {
      throw new Error("Failed to fetch league details.");
      // console.error(`Failed to fetch leagueId ${leagueId}.`);
    }
    let selectedSeason = getCurrentSeason(leagueDetails.seasons);

    const resp = await fantasyFootball.getSeasonByProvider(
      selectedSeason.year.toString(),
      leagueId
    );
    const _season = fromNullable(resp);
    if (_season) {
      const teamsResp = await fantasyFootball.getTeamsBySeason(_season.id);
      // const teams = teamsResp?.ok[0].map((team) => ({
      //   id: team[0],
      //   ...team[1],
      //   seasonId: seasonId,
      //   seasonproviderId: seasonData.providerId,
      // }));

      if (teamsResp?.err) {
        throw new Error(teamsResp?.err);
      }

      for ([teamId, team] of teamsResp.ok[0]) {
        const transfers = await getTransfersByTeamId(team.providerId);
        // console.log("transfergin these", transfers);
        try {
          const transferResp = await fantasyFootball.transferPlayers(transfers);
          // console.log(
          //   transferResp,
          //   "Resp of transfer  with team Id: ",
          //   teamId,
          //   "name: ",
          //   team.name
          // );
          const logData = {
            transferResp,
            msg:
              "Resp of transfer  with team Id: " +
              teamId +
              "name: " +
              team.name,
          };
          await appendLogToJsonFile(logData);
        } catch (error) {
          console.error("Error:", error);
        }
        // console.log("da transfers", transfers);
        // console.log('dis id dis team', teamId, team)
      }
      // await uploadMatchesFixturesByIds(leagueId, _season.id);
      return "updated transfers";
    } else {
      // console.log("season not found", resp);
      return "season not found";
    }
  } catch (error) {
    console.error("transfer players err got found::", error);
  }
}

/**
 * Update the stats of players in a match
 */
const updateMatchStats = async (matchId) => {
  try {
    const resp = await fantasyFootball.getRawMatch(matchId);
    const match = fromNullable(resp);
    console.log(resp,matchId)
    if (!match) return "Match not found";
    await updateStats({...match, id: matchId},fantasyFootball);
  } catch (error) {
    console.error("Error updating stats:", error);
    return "error updataing stats";
  }
};
module.exports = {
  getTournaments,
  uploadTournaments,
  uploadSeasons,
  fetchAndTransformTeams,
  fetchAndTransformSquads,
  getUpcomingFixtures,
  uploadMatchesFixtures,
  getMatchesForUpcomingDays,
  // updateStats,
  uploadTournamentsAndSeasons,
  updateMatchStats,
  uploadTournamentsbyIds,
  transferLeaguePlayers,
  uploadLeague,
};
