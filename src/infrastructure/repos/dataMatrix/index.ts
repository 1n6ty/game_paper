import { IDataMatrixRepository } from "../../../domain/ports/IRepositories";
import { DataMatrixResponseDTO, DataMatrixScanResult } from "../../../domain/entities/dataMatrix";
import DataMatrixAlreadyScannedError from "../../../application/errors/DataMatrixAlreadyScannedError";
import { mapDataMatrixDTOToScanResult } from "../../mappers/dataMatrixMappers";
import httpClient from "../../http";

/**
 * Отправляет текст DataMatrix на сервер для проверки.
 */
async function scanImpl(text: string, authData: string): Promise<DataMatrixScanResult> {
  try {
    const dto = await httpClient.post<DataMatrixResponseDTO>("/datamatrix/", {
      body: { text },
      authData: authData,
    });
    return mapDataMatrixDTOToScanResult(dto);
  } catch (error: any) {
    // Наша обертка теперь бросает ошибку, которую мы можем проверить
    if (error.message.includes("Статус: 409")) { // 409 Conflict
      throw new DataMatrixAlreadyScannedError();
    }

    throw error;
  }
}

const dataMatrixRepository: IDataMatrixRepository = {
  scan: scanImpl,
};

export default dataMatrixRepository;