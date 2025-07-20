import { DataMatrixScanResult } from "@/app/features/feature-datamatrix/domain/entities/DataMatrixScanResult";
import { DataMatrixResponse } from "./types";

export const mapDataMatrixResponseToDataMatrixScanResult = (
  response: DataMatrixResponse
): DataMatrixScanResult => {
  return {
    newScore: response.score,
    path: response.path,
  };
};
