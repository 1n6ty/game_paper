import { AppError } from "../../../../shared-kernel/domain/errors/AppError";

/**
 * Специфичная ошибка для случая, когда DataMatrix уже был отсканирован.
 */
export class DataMatrixAlreadyScannedError extends AppError {
  constructor(message: string = "Этот код уже был отсканирован.") {
    super(message);
  }
}
