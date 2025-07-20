import { DataMatrixAlreadyScannedError } from "@/app/features/feature-datamatrix/application/errors/DataMatrixAlreadyScannedError";
import { DataMatrixScanResult } from "@/app/features/feature-datamatrix/domain/entities/DataMatrixScanResult";
import { DataMatrixRepository } from "@/app/features/feature-datamatrix/domain/ports/DataMatrixRepository";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { AppError } from "@/app/shared-kernel/domain/errors/AppError";
import { AuthService } from "@/app/shared-kernel/domain/ports/AuthService";

interface ScanDataMatrixDependencies {
  authService: AuthService;
  dataMatrixRepository: DataMatrixRepository;
  logger: Logger;
}

export const scanDataMatrix = async (
  dataMatrixText: string,
  { authService, dataMatrixRepository, logger }: ScanDataMatrixDependencies
): Promise<DataMatrixScanResult> => {
  try {
    const authData = await authService.getAuthData();
    const result = await dataMatrixRepository.scanDataMatrix({
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
};
