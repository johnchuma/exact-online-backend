const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "logs/warning.log",
      level: "warning",
    }),
    new winston.transports.File({
      filename: "logs/exception.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/critical.log",
      level: "crit",
    }),
  ],
});

module.exports = logger;
