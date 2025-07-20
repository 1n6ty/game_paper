import { Container } from "inversify";
import { dataMatrixFeatureIdentifiers } from "./dataMatrixDeps";
import { DataMatrixRepository } from "./domain/ports/DataMatrixRepository";
import { mockDataMatrixRepository } from "./infrastructure/repos/data-matrix/__mocks__/mockDataMatrixRepository";

export const registerMockDataMatrixFeature = (container: Container) => {
  container
    .bind<DataMatrixRepository>(
      dataMatrixFeatureIdentifiers.DataMatrixRepository
    )
    .toConstantValue(mockDataMatrixRepository);
};
