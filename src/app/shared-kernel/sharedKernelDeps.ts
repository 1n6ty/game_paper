import { Container } from "inversify";
import { ApiConfig } from "./application/ports/ApiConfig";
import { HttpClient } from "./application/ports/HttpClient";
import { Logger } from "./application/ports/Logger";
import { AuthService } from "./domain/ports/AuthService";

export const sharedIdentifiers = {
  Logger: Symbol.for("Logger"),
  HttpClient: Symbol.for("HttpClient"),
  AuthService: Symbol.for("AuthService"),
  ApiConfig: Symbol.for("ApiConfig"),
};

export interface SharedKernelImplementations {
  logger: Logger;
  httpClient: HttpClient;
  authService: AuthService;
  apiConfig: ApiConfig;
}

export const registerSharedKernel = (
  container: Container,
  impls: SharedKernelImplementations
) => {
  container
    .bind<Logger>(sharedIdentifiers.Logger)
    .toConstantValue(impls.logger);
  container
    .bind<HttpClient>(sharedIdentifiers.HttpClient)
    .toConstantValue(impls.httpClient);
  container
    .bind<AuthService>(sharedIdentifiers.AuthService)
    .toConstantValue(impls.authService);
  container
    .bind<ApiConfig>(sharedIdentifiers.ApiConfig)
    .toConstantValue(impls.apiConfig);
};
