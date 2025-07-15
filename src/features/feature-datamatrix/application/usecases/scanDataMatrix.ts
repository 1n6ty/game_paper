import { Logger } from "../../../../shared-kernel/application/ports/Logger";
import { AppError } from "../../../../shared-kernel/domain/errors/AppError";
import { AuthService } from "../../../../shared-kernel/domain/ports/AuthService";
import { DataMatrixScanResult } from "../../domain/entities/DataMatrixScanResult";
import { DataMatrixRepository } from "../../domain/ports/DataMatrixRepository";
import { DataMatrixAlreadyScannedError } from "../errors/DataMatrixAlreadyScannedError";

interface ScanDataMatrixDependencies {
  authService: AuthService;
  dataMatrixRepository: DataMatrixRepository;
  logger: Logger;
}

/**
 * Отправляет отсканированный DataMatrix на сервер и обрабатывает результат.
 */
export async function scanDataMatrix(
  dataMatrixText: string,
  { authService, dataMatrixRepository, logger }: ScanDataMatrixDependencies
): Promise<DataMatrixScanResult> {
  try {
    const authData = await authService.getAuthData();
    const result = await dataMatrixRepository.scan({
      text: dataMatrixText,
      authData,
    });

    logger.info("scanDataMatrix", "Код просканирован", result);

    return result;
  } catch (error: unknown) {
    logger.error("scanDataMatrix", "Ошибка сканирования", error as Error);
    if (error instanceof DataMatrixAlreadyScannedError) {
      throw error;
    } else {
      throw new AppError(
        (error as Error).message || "Неизвестная ошибка сканирования."
      );
    }
  }
}
