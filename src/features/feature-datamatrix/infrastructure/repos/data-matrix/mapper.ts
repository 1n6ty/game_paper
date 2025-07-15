import { DataMatrixResponse } from "./types";
import { DataMatrixScanResult } from "../../../domain/entities/DataMatrixScanResult";

export function mapDataMatrixResponseToDataMatrixScanResult(
  response: DataMatrixResponse
): DataMatrixScanResult {
  return {
    newScore: response.score,
    path: response.path,
  };
}
