import { DataMatrixScanResult } from "../../domain/entities/dataMatrix";
import AppError from "../../domain/errors/AppError";
import { IAuthService } from "../../domain/ports/IServices";
import { IDataMatrixRepository } from "../../domain/ports/IRepositories";
import { IUseCaseOutputPort } from "../ports/IUseCaseOutputPort";
import DataMatrixAlreadyScannedError from "../errors/DataMatrixAlreadyScannedError";

/**
 * Отправляет отсканированный DataMatrix на сервер и обрабатывает результат.
 */
export async function scanDataMatrix(
  dataMatrixText: string,
  dataMatrixRepository: IDataMatrixRepository,
  authService: IAuthService,
  outputPort: IUseCaseOutputPort<DataMatrixScanResult>
): Promise<void> {
  try {
    const authData = await authService.getAuthData();
    const result = await dataMatrixRepository.scan(dataMatrixText, authData);
    outputPort.onSuccess(result);
  } catch (error: any) {
    if (error instanceof DataMatrixAlreadyScannedError) {
      outputPort.onFailure(error);
    } else {
      outputPort.onFailure(new AppError(error.message || "Неизвестная ошибка сканирования."));
    }
  }
}