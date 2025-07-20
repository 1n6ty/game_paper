import { AppError } from "@/app/shared-kernel/domain/errors/AppError";

/**
 * Специфичная ошибка для случая, когда DataMatrix уже был отсканирован.
 */
export class DataMatrixAlreadyScannedError extends AppError {
  constructor() {
    super("errors.alreadyScanned");
  }
}
