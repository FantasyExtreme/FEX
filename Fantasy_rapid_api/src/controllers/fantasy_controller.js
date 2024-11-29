const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { fantasy_service, emailService } = require("../services");


const getTournamentsAsync = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    // console.log(formData ,'')
    // const unixTime = moment('your date goes here').unix()

    const countries = await fantasy_service.getTournaments(data);

    res.status(httpStatus.OK).send(countries);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const uploadTournamentsAsync = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    // console.log(formData ,'')
    // const unixTime = moment('your date goes here').unix()

    const upload = await fantasy_service.uploadTournaments(data);

    res.status(httpStatus.OK).send(upload);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const uploadSeasonsAsync = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    // console.log(formData ,'')
    // const unixTime = moment('your date goes here').unix()

    const upload = await fantasy_service.uploadSeasons(data);

    res.status(httpStatus.OK).send(upload);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const uploadTournamentsByIdsAsync = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    // console.log(formData ,'')
    // const unixTime = moment('your date goes here').unix()

    const upload = await fantasy_service.uploadTournamentsbyIds(data);

    res.status(httpStatus.OK).send(upload);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});

const uploadTournamentsAndSeasons = catchAsync(async (req, res) => {
  try {
    const data = req.body;
    // console.log(formData ,'')
    // const unixTime = moment('your date goes here').unix()

    const upload = await fantasy_service.uploadTournamentsAndSeasons(data);

    res.status(httpStatus.OK).send(upload);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const getTeamsBySeasonAsync = catchAsync(async (req, res) => {
  try {
    const formData = req.body;
    // console.log(formData ,'')

    const countries = await fantasy_service.fetchAndTransformTeams(formData);

    res.status(httpStatus.OK).send(countries);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const fetchAndTransformSquads = catchAsync(async (req, res) => {
  try {
    const formData = req.body;
    // console.log(formData ,'')

    const countries = await fantasy_service.fetchAndTransformSquads(formData);

    res.status(httpStatus.OK).send(countries);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const uploadLeague = catchAsync(async (req, res) => {
  try {
    const params = req.query;
    const { leagueId } = params;
    const resp = await fantasy_service.uploadLeague(leagueId);

    res.status(httpStatus.OK).send(resp);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const uploadTransfers = catchAsync(async (req, res) => {
  try {
    const params = req.query;
    const { leagueId } = params;
    const resp = await fantasy_service.transferLeaguePlayers(leagueId);

    res.status(httpStatus.OK).send(resp);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});

const updateStats = catchAsync(async (req, res) => {
  try {
    const formData = req.body;
    // console.log(formData ,'')

    // const countries = await fantasy_service.updateStats(formData);

    // res.status(httpStatus.OK).send(countries);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const getUpcomingFixtures = catchAsync(async (req, res) => {
  try {
    const formData = req.body;
    // console.log(formData ,'')

    const countries = await fantasy_service.getUpcomingFixtures(759);

    res.status(httpStatus.OK).send(countries);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const uploadUpcomingFixtures = catchAsync(async (req, res) => {
  try {
    const formData = req.body;
    // console.log(formData ,'')

    const countries = await fantasy_service.uploadMatchesFixtures(759);

    res.status(httpStatus.OK).send(countries);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
const getCommingMatches = catchAsync(async (req, res) => {
  try {
    const formData = req.body;
    // console.log(formData ,'')

    const countries = await fantasy_service.getMatchesForUpcomingDays();

    res.status(httpStatus.OK).send(countries);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
/**
 * sendcontactUsform use to send email to support or admin with contact us form data from user
 * {res,res} default params
 */
const sendcontactUsform = catchAsync(async (req, res) => {
  try {
    const { name, email, phone, message, principal, url } = req.body;

    const sendEmail = await emailService.contactUsFormEmail({
      name,
      email,
      phone,
      message,
      principal,
      url,
    });

    res
      .status(httpStatus.OK)
      .send(
        "Your message has been successfully submitted. We'll get back to you shortly. Thank you!"
      );
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});
/**
 * updateMatchStats use to update match stats of a specific match
 * {res,res} default params
 */
const updateMatchStats = catchAsync(async (req, res) => {
  try {
    const params = req.query;
    const { matchId } = params;
    const resp = await fantasy_service.updateMatchStats(matchId);

    res.status(httpStatus.OK).send(resp);
  } catch (error) {
    // Handle and send appropriate error response
    if (!error.statusCode) {
      error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    res.status(error.statusCode).json({ message: error.message });
  }
});

module.exports = {
  getTournamentsAsync,
  uploadTournamentsAsync,
  uploadTournamentsAndSeasons,
  getTeamsBySeasonAsync,
  fetchAndTransformSquads,
  getUpcomingFixtures,
  uploadUpcomingFixtures,
  getCommingMatches,
  updateStats,
  uploadTournamentsByIdsAsync,
  uploadSeasonsAsync,
  uploadLeague,
  uploadTransfers,
  sendcontactUsform,
  updateMatchStats,
};
