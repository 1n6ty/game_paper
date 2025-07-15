import { DataMatrixAlreadyScannedError } from "../../../../application/errors/DataMatrixAlreadyScannedError";
import { DataMatrixRepository } from "../../../../domain/ports/DataMatrixRepository";
import { DataMatrixScanResult } from "../../../../domain/entities/DataMatrixScanResult";

let hasBeenScanned = false;

export const mockDataMatrixRepository: DataMatrixRepository = {
  scan: async ({ text }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (hasBeenScanned) {
      throw new DataMatrixAlreadyScannedError("Этот мок-код уже сканировали!");
    }

    hasBeenScanned = true;
    const result: DataMatrixScanResult = { newScore: 1600 };

    return result;
  },
};
