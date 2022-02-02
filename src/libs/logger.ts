/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any */
export class Logger {
  private static log(
    logLevel: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    const logger = logFunctionForType(logLevel)!;
    if (process.env.IS_LOCAL) {
      logger(`${logLevel.toUpperCase()} - ${message}`);
      if (details) logger(details);
      logger();
      return;
    }
    const logObject: Record<string, unknown> = {
      logLevel,
      message,
      ...details,
    };
    logger(JSON.stringify(logObject));
  }

  public static debug(
    message: string,
    details?: Record<string, unknown>
  ): void {
    Logger.log("debug", message, details);
  }

  public static error(
    message: string,
    details?: Record<string, unknown>
  ): void {
    Logger.log("error", message, details);
  }

  public static info(message: string, details?: Record<string, unknown>): void {
    Logger.log("info", message, details);
  }

  public static warn(message: string, details?: Record<string, unknown>): void {
    Logger.log("warn", message, { error: details });
  }
}

function logFunctionForType(
  type: string
): ((message?: any, ...optionalParams: any[]) => void) | undefined {
  switch (type) {
    case "info":
      return console.info;
    case "warn":
      return console.warn;
    case "error":
      return console.error;
    case "debug":
      return console.debug;
  }
  return undefined;
}
