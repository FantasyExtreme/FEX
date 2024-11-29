
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const { Ed25519KeyIdentity } = require("@dfinity/identity");
const { statsJob } = require("./cron-jobs/StatsJob");

let server;

server = app.listen(
  config.port, //config.port
  () => {
    logger.info(`Listening to port ${config.port}`);
  }
);

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

// const identity = Ed25519KeyIdentity.generate();

// Serialize the identity
// const serializedIdentity = JSON.stringify(identity.toJSON());

// Save to a file (ensure this is stored securely!)
// fs.writeFileSync("identity.json", serializedIdentity);

// start cron-job
statsJob();

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
