/**
 * Базовый класс для всех кастомных ошибок приложения.
 */
export class AppError extends Error {
  /**
   * @param message - Ключ для перевода из i18next.
   * @param interpolationParams - Опциональные параметры для интерполяции.
   */
  constructor(
    public readonly message: string,
    public readonly interpolationParams?: Record<string, unknown>
  ) {
    super(message);
    // Восстанавливаем прототип для корректной работы `instanceof`
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}
