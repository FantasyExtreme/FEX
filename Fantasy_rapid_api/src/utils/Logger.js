const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
};

function logger(message, obj, color) {
  const colorCode = colors[color] || colors.cyan; // Default to white if color is not found
  if (process.env.NODE_ENV == "development") {
    console.log(`${colorCode}${message}${colors.reset}`, obj);
  }
}
module.exports = logger;
