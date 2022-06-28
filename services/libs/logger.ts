import winston from 'winston';

const consoleFormat = winston.format.printf(({ level, message, requestId, ...details }) => {
  // eslint-disable-next-line
  let requestIde = requestId; // makes ESLint happt
  let detailString: string | undefined;
  if (Object.keys(details).length > 1) {
    detailString = JSON.stringify(details, null, 2);
  } else if (Object.keys(details).length == 1) {
    detailString = JSON.stringify(details[Object.keys(details)[0]], null, 2);
  } else {
    detailString = undefined;
  }
  return `${level.toUpperCase()} - ${message}\n${detailString ?? ''}\n`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.IS_LOCAL
    ? winston.format.combine(consoleFormat)
    : winston.format.combine(winston.format.json(), winston.format.timestamp()),
  transports: [new winston.transports.Console()],
});
