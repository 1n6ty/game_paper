import AppError from "../../domain/errors/AppError";

/**
 * Универсальный выходной порт для всех use-кейсов.
 * @template T - Тип данных при успешном выполнении.
 */
export interface IUseCaseOutputPort<T> {
  onSuccess(result: T): void;
  onFailure(error: AppError): void;
}