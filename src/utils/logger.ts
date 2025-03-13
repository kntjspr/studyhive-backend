import winston from "winston";
import config from "../config";

/**
 * Custom format for console logs
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

/**
 * Custom format for file logs
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json()
);

/**
 * Winston logger configuration
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.json(),
  defaultMeta: { service: "studyhive-api" },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// Add file transports in production
if (config.nodeEnv === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

export default logger; 