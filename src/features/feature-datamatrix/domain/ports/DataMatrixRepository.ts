import { DataMatrixScanResult } from "../entities/DataMatrixScanResult";

export interface ScanParams {
  text: string;
  authData: string;
}

/**
 * Порт для взаимодействия с данными DataMatrix.
 */
export interface DataMatrixRepository {
  scan(params: ScanParams): Promise<DataMatrixScanResult>;
}
