import winston, { transports, createLogger, format } from 'winston';

// Create a custom format for logs
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
  })
);

// Create a logger instance
const logger = createLogger({
  level: 'info', // default log level, can be 'debug', 'info', 'warn', 'error'
  format: logFormat,
  transports: [
    new transports.Console({ level: 'info' }), // Output to console
    new transports.File({ filename: 'logs/app.log', level: 'info' }), // Log to a file
  ],
});

export default logger;
