import { Container } from "inversify";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { sharedIdentifiers } from "@/app/shared-kernel/sharedKernelDeps";
import { DataMatrixRepository } from "./domain/ports/DataMatrixRepository";
import { createDataMatrixRepository } from "./infrastructure/repos/data-matrix";

export const dataMatrixFeatureIdentifiers = {
  DataMatrixRepository: Symbol.for("DataMatrixRepository"),
};

export const registerDataMatrixFeature = (container: Container) => {
  container
    .bind<DataMatrixRepository>(
      dataMatrixFeatureIdentifiers.DataMatrixRepository
    )
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(sharedIdentifiers.Logger);
      const httpClient = context.get<HttpClient>(sharedIdentifiers.HttpClient);

      return createDataMatrixRepository({ logger, httpClient });
    });
};
