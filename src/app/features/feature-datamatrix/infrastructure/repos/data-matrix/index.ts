import { DataMatrixAlreadyScannedError } from "@/app/features/feature-datamatrix/application/errors/DataMatrixAlreadyScannedError";
import { DataMatrixScanResult } from "@/app/features/feature-datamatrix/domain/entities/DataMatrixScanResult";
import { DataMatrixRepository } from "@/app/features/feature-datamatrix/domain/ports/DataMatrixRepository";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { mapDataMatrixResponseToDataMatrixScanResult } from "./mapper";
import { dataMatrixRepositoryPaths } from "./paths";
import { DataMatrixResponse } from "./types";

interface DataMatrixRepoDependencies {
  httpClient: HttpClient;
  logger: Logger;
}

/**
 * Отправляет текст DataMatrix на сервер для проверки.
 */
const scanImpl = async (
  text: string,
  authData: string,
  httpClient: HttpClient,
  logger: Logger
): Promise<DataMatrixScanResult> => {
  logger.info("scanImpl", `Отправка запроса на сканирование`, {
    textLength: text.length,
  });

  try {
    const response = await httpClient.post<DataMatrixResponse>(
      dataMatrixRepositoryPaths.DATAMATRIX,
      {
        body: { text },
        authData: authData,
      }
    );

    logger.info("scanImpl", "Сканирование успешно завершено");

    return mapDataMatrixResponseToDataMatrixScanResult(response);
  } catch (error: unknown) {
    // Наша обертка теперь бросает ошибку, которую мы можем проверить
    if ((error as Error).message.includes("409")) {
      // 409 Conflict
      logger.error("scanImpl", "Ошибка: уже просканировано", error as Error);
      throw new DataMatrixAlreadyScannedError();
    }

    logger.error(
      "scanImpl",
      "Неизвестная ошибка при выполнении запроса на сканирование",
      error as Error
    );
    throw error;
  }
};

export const createDataMatrixRepository = ({
  httpClient,
  logger,
}: DataMatrixRepoDependencies): DataMatrixRepository => {
  return {
    scanDataMatrix: ({ text, authData }) =>
      scanImpl(text, authData, httpClient, logger),
  };
};
