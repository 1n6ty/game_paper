/**
 * Базовый класс для всех кастомных ошибок приложения.
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
