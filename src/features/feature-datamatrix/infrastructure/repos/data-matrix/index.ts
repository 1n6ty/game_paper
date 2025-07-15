import { HttpClient } from "../../../../../shared-kernel/application/ports/HttpClient";
import { Logger } from "../../../../../shared-kernel/application/ports/Logger";
import { DataMatrixAlreadyScannedError } from "../../../application/errors/DataMatrixAlreadyScannedError";
import { DataMatrixScanResult } from "../../../domain/entities/DataMatrixScanResult";
import { DataMatrixRepository } from "../../../domain/ports/DataMatrixRepository";
import { mapDataMatrixResponseToDataMatrixScanResult } from "./mapper";
import { DataMatrixResponse } from "./types";

interface DataMatrixRepoDependencies {
  httpClient: HttpClient;
  logger: Logger;
}

/**
 * Отправляет текст DataMatrix на сервер для проверки.
 */
async function scanImpl(
  text: string,
  authData: string,
  httpClient: HttpClient,
  logger: Logger
): Promise<DataMatrixScanResult> {
  logger.info("scanImpl", `Отправка запроса на сканирование`, {
    textLength: text.length,
  });

  try {
    const dto = await httpClient.post<DataMatrixResponse>("/datamatrix/", {
      body: { text },
      authData: authData,
    });

    logger.info("scanImpl", "Сканирование успешно завершено");

    return mapDataMatrixResponseToDataMatrixScanResult(dto);
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
}

export function createDataMatrixRepository({
  httpClient,
  logger,
}: DataMatrixRepoDependencies): DataMatrixRepository {
  return {
    scan: ({ text, authData }) => scanImpl(text, authData, httpClient, logger),
  };
}
