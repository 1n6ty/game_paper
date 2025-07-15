export interface Logger {
  info(functionName: string, message: string, ...payload: unknown[]): void;
  warn(functionName: string, message: string, ...payload: unknown[]): void;
  error(
    functionName: string,
    message: string,
    error?: Error,
    ...payload: unknown[]
  ): void;

  // Метод для создания скоупированного логгера
  createScope(scope: string): Logger;
}
