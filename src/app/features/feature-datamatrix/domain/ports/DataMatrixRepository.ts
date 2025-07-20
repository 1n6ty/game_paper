import { DataMatrixScanResult } from "@/app/features/feature-datamatrix/domain/entities/DataMatrixScanResult";

export interface ScanParams {
  text: string;
  authData: string;
}

/**
 * Порт для взаимодействия с данными DataMatrix.
 */
export interface DataMatrixRepository {
  scanDataMatrix(params: ScanParams): Promise<DataMatrixScanResult>;
}
