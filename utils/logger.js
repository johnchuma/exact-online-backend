require("dotenv").config()
const winston = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

// Create a Logtail client
const logtail = new Logtail(process.env.LOGTAIL_TOKEN,{
  endpoint:`https://${process.env.LOGTAIL_URL}`
});
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [
    new LogtailTransport(logtail),
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
