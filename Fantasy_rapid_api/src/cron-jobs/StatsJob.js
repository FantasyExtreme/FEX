const cron = require("node-cron");
const { CronJob } = require("cron");
const { fromNullable } = require("@dfinity/utils");
const schedule = require("node-schedule");
const axios = require("axios");
const moment = require("moment");
const {
  makeFantasyFootballActor,
} = require("../canister_caller/service/actor-locator");
const logger = require("../utils/Logger");
const { MatchStatus } = require("../Shared/constants");

const { Ed25519KeyIdentity } = require("@dfinity/identity");

const serializedIdentity = process.env.PRIVATE_KEY;
const identity = Ed25519KeyIdentity.fromJSON(serializedIdentity);

const scheduledMatches = new Set();

async function whoami(fantasyFootball) {
  const me = await fantasyFootball.whoami();
  console.log(me);
}
/**
 * Takes rapidapi statistics object and converts to the object we are using in motoko
 * @param  input the statistics object from the rapidapi response
 * @returns converts it to how we are storing in motoko
 */
function convertObject(input) {
  return {
    shots: {
      shots_total: input?.shots?.total || 0,
      shots_on_goal: input?.shots?.on || 0,
    },
    goals: {
      scored: input?.goals?.total || 0,
      assists: input?.goals?.assists || 0,
      conceded: input?.goals?.conceded || 0,
      owngoals: 0,
      team_conceded: 0,
    },
    fouls: {
      drawn: input?.fouls?.drawn || 0,
      committed: input?.fouls?.committed || 0,
    },
    cards: {
      yellowcards: input?.cards?.yellow || 0,
      redcards: input?.cards?.red || 0,
      yellowredcards: 0,
    },
    passing: {
      total_crosses: 0,
      crosses_accuracy: 0,
      passes: input?.passes?.total || 0,
      accurate_passes: 0,
      passes_accuracy: parseInt(input?.passes?.accuracy, 10) || 0,
      key_passes: input?.passes?.key || 0,
    },
    dribbles: {
      attempts: input?.dribbles?.attempts || 0,
      success: input?.dribbles?.success || 0,
      dribbled_past: input?.dribbles?.past || 0,
    },
    duels: {
      total: input?.duels?.total || 0,
      won: input?.duels?.won || 0,
    },
    other: {
      aerials_won: 0,
      punches: 0,
      offsides: input?.offsides || 0,
      saves: input?.goals?.saves || 0,
      inside_box_saves: 0,
      pen_scored: input?.penalty?.scored || 0,
      pen_missed: input?.penalty?.missed || 0,
      pen_saved: input?.penalty?.saved || 0,
      pen_committed: input?.penalty?.commited || 0,
      pen_won: input?.penalty?.won || 0,
      hit_woodwork: 0,
      tackles: input?.tackles?.total || 0,
      blocks: input?.tackles?.blocks || 0,
      interceptions: input?.tackles?.interceptions || 0,
      clearances: 0,
      dispossesed: 0,
      minutes_played: input?.games?.minutes || 0,
    },
  };
}
/**
 * Update match status by id
 * @param {string} id provider id of the match
 */
async function updateMatch(id, providerId) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.API_URL}/fixtures?id=${providerId}`,
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.API_KEY,
    },
  };

  return await axios
    .request(config)
    .then((response) => {
      let data = response.data.response[0];
      console.log("dis we got form ittt", response.data.response[0]);
      let fixture = {
        fixture_id: data.fixture.id,
        name: `${data.teams.home.name} vs ${data.teams.away.name}`,
        starting_at: data.fixture.date,
        home_team: data.teams.home.name,
        away_team: data.teams.away.name,
        home_team_logo: data.teams.home.logo,
        away_team_logo: data.teams.away.logo,
        location: location,
        status: status,
        result_info: {
          halftime: data.score.halftime,
          fulltime: data.score.fulltime,
          extratime: data.score.extratime,
          penalty: data.score.penalty,
          goals: data.goals,
        },
      };
      return {
        providerId: fixture.fixture_id.toString(),
        homeTeamName: fixture.home_team || "fantasy",
        awayTeamName: fixture.away_team || "fantasy",
        time: new Date(fixture.starting_at).getTime(),
        location: fixture.location,
        status: fixture.status,
        seasonId: seasonId,
      };
      // let status = response.data.response[0].fixture.status.long;
      // return status;
    })
    .catch((error) => {
      console.log("error getting status", error);
      return null;
    });
}
/**
 * Get match status by id
 * @param {string} id provider id of the match
 */
async function getMatch(id) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${id}`,
    headers: {
      "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.API_KEY,
    },
  };

  return await axios
    .request(config)
    .then((response) => {
      goals = response.data.response[0].goals;
      let status = response.data.response[0].fixture.status.long;
      return { status, homeScore: goals.home, awayScore: goals.away };
    })
    .catch((error) => {
      console.log("error getting status", error);
      return null;
    });
}
async function asynLog() {
  // const result = await getMatch(1208495);
  console.log("i won dis", result)
}
/**
 * Update the stats of players in a match
 * @param  tempMatch the match we get from motoko
 */
const updateStats = async (tempMatch, fantasyFootball) => {
  try {
    console.log(
      `Updating stats for match: id: ${tempMatch.id}, providerId: ${tempMatch.providerId}`
    );
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api-football-v1.p.rapidapi.com/v3/fixtures/players?fixture=${tempMatch.providerId}`,
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY,
      },
    };

    const response = await axios.request(config);
    const data = response.data;
    const playersData = data?.response?.map((obj) => [...obj.players]).flat();
    const playerStats = [];

    const playerResp = await fantasyFootball.getPlayersByTeamIds([
      tempMatch.homeTeam,
      tempMatch.awayTeam,
    ]);
    const players = playerResp?.ok[0]?.map((player) => ({
      id: player[0],
      ...player[1],
    }));

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
    logger(
      "info",
      {
        players: players.length,
        playersData: playersData.length,
        playerResp: playerResp.legnth,
      },
      "playerStats"
    );
    try {
      const updated = await fantasyFootball.updatePlayersStats(playerStats);
      await updateRanking(tempMatch, fantasyFootball);

      console.log("Updated playerstats:", updated?.length);
    } catch (error) {
      console.error("Error updating stats for this", tempMatch, error);
    }
  } catch (error) {
    console.error("\x1b[31m", "Error updating stats:", error);
  }
};
/**
 * Updates the ranking of a match.
 *
 * @param {Object} tempMatch - The match object containing the ID.
 * @return {Promise<void>} - A promise that resolves when the ranking is updated.
 */
const updateRanking = async (tempMatch, fantasyFootball) => {
  try {
    const rank = await fantasyFootball.updateRanking(tempMatch.id);
  } catch (error) {
    console.error("error updating ranking", tempMatch, error);
  }
};
/**
 * Update the stats of players in a match
 * @param  tempMatch the match we get from motoko
 */
const updateLineup = async (tempMatch, fantasyFootball) => {
  try {
    console.log(`Updating lineup for match: ${tempMatch.id}`);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.API_URL}/fixtures/lineups?fixture=${tempMatch.providerId}`,
      headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY,
      },
    };

    const response = await axios.request(config);
    const data = response.data;
    const playingPlayersData = data?.response
      ?.map((team) => {
        return team?.startXI?.map(({ player }) => ({
          providerId: player.id,
          isPlaying: true,
          isSub: false,
        }));
      })
      .flat();
    const subPlayersData = data?.response
      ?.map((team) => {
        return team?.substitutes?.map(({ player }) => ({
          providerId: player.id,
          isPlaying: true,
          isSub: true,
        }));
      })
      .flat();
    const playersData = [...playingPlayersData, ...subPlayersData];

    const playerStatuses = [];

    const playerResp = await fantasyFootball.getPlayersByTeamIds([
      tempMatch.homeTeam,
      tempMatch.awayTeam,
    ]);
    const players = playerResp?.ok[0]?.map((player) => ({
      id: player[0],
      ...player[1],
    }));

    playersData.forEach((playerData) => {
      players.forEach((player) => {
        if (player.providerId == playerData.providerId) {
          playerStatuses.push({
            id: player.id,
            isPlaying: playerData.isPlaying,
            isSub: playerData.isSub,
          });
        }
      });
    });
    try {
      const updated = await fantasyFootball.updatePlayerStatus(playerStatuses);
      console.log("Updated lineups:", updated?.length);
    } catch (error) {
      console.error("error updating lineupds", tempMatch, error);
    }
  } catch (error) {
    console.error("\x1b[31m", "Error updating lineup:", error);
    /**
     * Retrieves matches from the canister based on the provided page number.
     *
     * @param {number} page - The page number for the matches
     * @param {Array} matches - The array of matches to start with
     * @return {Array} The array of matches retrieved from the canister
     */
  }
};
const getMatchesFromCanister = async (page, matches = [], fantasyFootball) => {
  const resp = await fantasyFootball.getMatches(
    { search: "", status: "3", page, limit: 10 },
    []
  );
  let total = resp?.matches;
  let pageNumber = page + 1; // becuse page starts from 0
  let newMatches = [...resp?.matches, ...matches];
  if (pageNumber * 10 < total) {
    return await getMatchesFromCanister(pageNumber, newMatches);
  } else {
    return newMatches;
  }
};
const matchStorage = new Set();
const upcomingMatchStorage = new Set();
const thirtyMinutes = 30 * 60 * 1000;

/**
 * Get upcoming matches and check if there is a match within the next 30 minutes add a schedule which will start a cron job that will run every 1 minute and will update the stats of players of the match
 */
const newCheckMatches = async () => {
  try {
    const fantasyFootball = makeFantasyFootballActor({
      agentOptions: {
        identity,
      },
    });
    // whoami(fantasyFootball);
    console.log("Checking for matches...", "");
    const matches = await getMatchesFromCanister(0, [], fantasyFootball);
    const upcomingMatches = [];
    const ongoingMatches = [];
    const now = moment().valueOf();

    matches?.forEach(async (match) => {
      const matchTime = moment(parseInt(match.time, 10)).valueOf();
      if (match.status == MatchStatus.postponed) {
        let result = await getMatch(match.providerId);
        if (result && result?.status == MatchStatus.postponed) {
          console.log('skipping postponed match', result, match.id)
          return;
        } else {
          await fantasyFootball.reScheduleMatch(match.id, result.status);
        }
      }
      if (matchTime < now) {
        if (!matchStorage.has(match.id)) {
          matchStorage.add(match.id);
          ongoingMatches.push(match);
        }
      } else {
        if (!upcomingMatchStorage.has(match.id)) {
          upcomingMatchStorage.add(match.id);
          upcomingMatches.push(match);
        }
      }
    });
    console.log("Matches:", { upcomingMatches, ongoingMatches });

    upcomingMatches.forEach(async (match) => {
      const job = new CronJob(
        "*/5 * * * *", // cronTime
        async function () {
          console.log(`Updating lineup for match: ${match.id}`);
          const matchTime = moment(parseInt(match.time, 10)).valueOf();
          const now = moment().valueOf();
          updateLineup(match, fantasyFootball);
          if (matchTime <= now) {
            upcomingMatchStorage.delete(match.id);
            newCheckMatches();
            job.stop();
          }
          console.log("current match queue:", {
            upcomingMatchStorage,
            upcomingMatches,
            ongoingMatches,
            matchStorage,
          });
        }, // onTick
        () => {
          console.log("Lineup is done. for:", { matchStorage, id: match.id });
        }, // onComplete
        true, // start
        null,
        null,
        true // Run on init
      );
    });
    // ongoingMatches.forEach((match) => {
    //   matchStorage.add(match.id);
    // });
    ongoingMatches.forEach(async (match) => {
      const job = new CronJob(
        "*/30 * * * * *", // cronTime
        async function () {
          console.log(`Updating stats for match: ${match.id}`);
          await updateStats(match, fantasyFootball);
          let result = await getMatch(match.providerId);
          if (result && result?.status == MatchStatus.fiinished) {
            let matchScore = {
              ...result,
              id: match.id,
            };
            try {
              // small TODO: check for response and stop the cronjob accordingly
              setTimeout(async () => {
                try {
                  const scoreResult = await fantasyFootball.finishMatch(
                    matchScore
                  );
                  matchStorage.delete(match.id);
                  job.stop();
                  console.log(
                    "match finished with score",
                    scoreResult,
                    matchScore,
                    match
                  );
                } catch (error) {
                  console.error(error);
                }
              }, 5 * 60 * 1000);
            } catch (error) {
              console.error("erro finishing match", match, error);
            }
            // if (matchStorage.size() == 0) {
            // }
          } else if (result && result?.status == MatchStatus.postponed) {
            await fantasyFootball.postponeMatch(match.id, result.status);
            matchStorage.delete(match.id);
            job.stop();
            console.log("match postponed", match);
          }
          {
            if (result) {
              let matchScore = {
                ...result,
                id: match.id,
              };
              try {
                const scoreResult = await fantasyFootball.updateMatchScore(
                  matchScore
                );
                console.log(
                  "match continued with score",
                  scoreResult,
                  matchScore
                );
              } catch (error) {
                console.error(
                  "error upadating match score",
                  match,
                  matchScore,
                  error
                );
              }
              console.log("still running", { id: match.id });
            }
            console.log({ id: match.id }, "still running");
          }
        }, // onTick
        () => {
          console.log("States are done, for:", { id: match.id });
        }, // onComplete
        true, // start
        null,
        null,
        true
      );
    });
  } catch (error) {
    console.error("\x1b[31m", "Error checking matches:", error);
  }
};
/**
 * Start a cron-job that will run every 30 minutes that will check for upcoming matches
 */
const statsJob = () => {
  // TODO uncomment
  // Run checkMatches every 20 minutes
  cron.schedule("*/20 * * * *", newCheckMatches);
  // Initial run
  newCheckMatches();
};

module.exports = {statsJob, updateStats};