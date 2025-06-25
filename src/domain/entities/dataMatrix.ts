/**
 * Результат успешного сканирования DataMatrix.
 */
export type DataMatrixScanResult = {
  newScore: number;
};

/**
 * DTO для ответа от API при сканировании.
 */
export type DataMatrixResponseDTO = {
  score: number;
  path?: string;
};