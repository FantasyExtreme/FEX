const express = require("express");

const Controller = require("../../controllers/fantasy_controller");

const router = express.Router();
// router.route("/uploadTournaments").post(Controller.uploadTournamentsAsync);

// router
//   .route("/uploadTournamentsAndSeasons")
//   .post(Controller.uploadTournamentsAndSeasons);

router
  .route("/uploadTournamentsByIdsAsync")
  .post(Controller.uploadTournamentsByIdsAsync);

router.route("/uploadSeasonsAsync").post(Controller.uploadSeasonsAsync);

router.route("/uploadTeams").post(Controller.getTeamsBySeasonAsync);

router.route("/uploadSquad").post(Controller.fetchAndTransformSquads);

router.route("/getfeatures").get(Controller.getUpcomingFixtures);

router.route("/uploadMatchFixtures").post(Controller.uploadUpcomingFixtures);
router.route("/uploadLeague").post(Controller.uploadLeague);
router.route("/updateMatchStats").post(Controller.updateMatchStats);
router.route("/uploadTransfer").post(Controller.uploadTransfers);

router.route("/getupcommingMatches").get(Controller.getCommingMatches);
router.route("/sendcontactusform").post(Controller.sendcontactUsform);

module.exports = router;
