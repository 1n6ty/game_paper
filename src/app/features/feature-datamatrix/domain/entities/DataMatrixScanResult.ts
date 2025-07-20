/**
 * Результат успешного сканирования DataMatrix.
 */
export interface DataMatrixScanResult {
  newScore: number;
  path?: string;
}
