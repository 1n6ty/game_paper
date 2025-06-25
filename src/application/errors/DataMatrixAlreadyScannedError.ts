import AppError from "../../domain/errors/AppError";

/**
 * Специфичная ошибка для случая, когда DataMatrix уже был отсканирован.
 */
export default class DataMatrixAlreadyScannedError extends AppError {
  constructor(message: string = "Этот код уже был отсканирован.") {
    super(message);
  }
}