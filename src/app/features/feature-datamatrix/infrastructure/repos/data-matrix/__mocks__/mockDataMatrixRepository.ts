import { DataMatrixAlreadyScannedError } from "@/app/features/feature-datamatrix/application/errors/DataMatrixAlreadyScannedError";
import { DataMatrixRepository } from "@/app/features/feature-datamatrix/domain/ports/DataMatrixRepository";
import { mockDataMatrixScanResult } from "./mockDataMatrixScanResult";

let hasBeenScanned = false;

export const mockDataMatrixRepository: DataMatrixRepository = {
  scanDataMatrix: async ({ text }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (hasBeenScanned) {
      throw new DataMatrixAlreadyScannedError();
    }

    hasBeenScanned = true;

    return mockDataMatrixScanResult;
  },
};
