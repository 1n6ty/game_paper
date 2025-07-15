/**
 * DTO для ответа от API при сканировании.
 */
export interface DataMatrixResponse {
  score: number;
  path?: string;
}
