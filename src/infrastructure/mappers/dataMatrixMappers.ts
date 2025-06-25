import { DataMatrixResponseDTO, DataMatrixScanResult } from "../../domain/entities/dataMatrix";

/**
 * Преобразует DTO ответа сканирования в доменную сущность.
 */
export function mapDataMatrixDTOToScanResult(dto: DataMatrixResponseDTO): DataMatrixScanResult {
  return {
    newScore: dto.score,
  };
}