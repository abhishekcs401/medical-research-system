import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default log level to 'info'
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'logs/app.log' }), // Log to a file
  ],
});

export default logger;
