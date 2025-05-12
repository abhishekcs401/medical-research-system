import { createLogger, format, transports } from 'winston';
import * as path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

// Define the logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // Default log level
  format: combine(
    errors({ stack: true }), // Include error stack trace
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to each log
    logFormat // Apply custom log format
  ),
  transports: [
    // Console logging with colorization
    new transports.Console({
      format: combine(colorize(), logFormat), // Apply color to logs in console
    }),

    // File logging for error logs
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error', // Only log errors here
    }),

    // File logging for all logs
    new transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
    }),
  ],
  exitOnError: false, // Prevent process from exiting on log errors
});

export default logger;
