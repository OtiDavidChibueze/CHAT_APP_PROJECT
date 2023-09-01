// Logger Config
const { transports, format, createLogger } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.json(),
    format.splat(),
    format.errors({ stacks: true }),
    format.timestamp({ format: "MMM, MM, ddd, YYYY, hh:mm" }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp.toUpperCase()}] - [${level.toUpperCase()}] - ${message}`;
    })
  ),

  transports: [
    new transports.Console(format.combine(format.colorize(), format.simple())),
    new transports.File({ filename: "appDevelopment.log" }),
  ],

  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],

  exitOnError: false,
});

module.exports = logger;
