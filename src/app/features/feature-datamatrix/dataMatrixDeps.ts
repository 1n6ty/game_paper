import { Container } from "inversify";
import { DataMatrixRepository } from "./domain/ports/DataMatrixRepository";

export const dataMatrixFeatureIdentifiers = {
  DataMatrixRepository: Symbol.for("DataMatrixRepository"),
};

export interface DataMatrixFeatureImplementations {
  dataMatrixRepository: DataMatrixRepository;
}

export const registerDataMatrixFeature = (
  container: Container,
  impls: DataMatrixFeatureImplementations
) => {
  container
    .bind<DataMatrixRepository>(
      dataMatrixFeatureIdentifiers.DataMatrixRepository
    )
    .toConstantValue(impls.dataMatrixRepository);
};
