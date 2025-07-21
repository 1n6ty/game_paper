import { Logger } from "@/app/shared-kernel/application/ports/Logger";

const logStyles = {
  INFO: "color: #00A36C; font-weight: bold;",
  WARN: "color: #F7B500; font-weight: bold;",
  ERROR: "color: #D8000C; font-weight: bold;",
  SCOPE: "color: #007BFF;",
  FUNCTION: "color: #7199FF;",
};

const createConsoleLogger = (scope?: string): Logger => {
  const scopePrefix = scope ? `[%c${scope}%c]` : "";
  const scopeArgs = scope ? [logStyles.SCOPE, ""] : [];

  return {
    info: (functionName, message, payload) => {
      console.log(
        `%c[INFO]%c ${scopePrefix} %c${functionName}%c: ${message}`,
        logStyles.INFO,
        "",
        ...scopeArgs,
        logStyles.FUNCTION,
        "",
        payload || ""
      );
    },
    warn: (functionName, message, payload) => {
      console.warn(
        `%c[WARN]%c ${scopePrefix} %c${functionName}%c: ${message}`,
        logStyles.WARN,
        "",
        ...scopeArgs,
        logStyles.FUNCTION,
        "",
        payload || ""
      );
    },
    error: (functionName, message, error, payload) => {
      console.error(
        `%c[ERROR]%c ${scopePrefix} %c${functionName}%c: ${message}`,
        logStyles.ERROR,
        "",
        ...scopeArgs,
        logStyles.FUNCTION,
        "",
        { error, payload }
      );
    },

    createScope: (newScope: string) => {
      return createConsoleLogger(newScope);
    },
  };
};

export const rootLogger = createConsoleLogger();
