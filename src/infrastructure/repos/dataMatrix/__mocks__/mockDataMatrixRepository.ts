import { IDataMatrixRepository } from "../../../../domain/ports/IRepositories";
import { DataMatrixScanResult } from "../../../../domain/entities/dataMatrix";
import DataMatrixAlreadyScannedError from "../../../../application/errors/DataMatrixAlreadyScannedError";

let hasBeenScanned = false;

const mockDataMatrixRepository: IDataMatrixRepository = {
  scan: async (text: string, authData: string) => {
    console.log("MOCK: [DataMatrixRepository] scan called with text:", text);
    await new Promise(res => setTimeout(res, 500));
    if (hasBeenScanned) {
      throw new DataMatrixAlreadyScannedError("Этот мок-код уже сканировали!");
    }
    hasBeenScanned = true;
    const result: DataMatrixScanResult = { newScore: 1600 };
    return result;
  },
};

export default mockDataMatrixRepository;