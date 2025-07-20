import { Container } from "inversify";
import { HttpClient } from "./application/ports/HttpClient";
import { Logger } from "./application/ports/Logger";
import { AuthService } from "./domain/ports/AuthService";
import { createHttpClient } from "./infrastructure/http";
import { telegramAuthService } from "./infrastructure/services/auth-telegram";
import { rootLogger } from "./infrastructure/services/logger-console";

export const sharedIdentifiers = {
  Logger: Symbol.for("Logger"),
  HttpClient: Symbol.for("HttpClient"),
  AuthService: Symbol.for("AuthService"),
};

export const registerSharedKernel = (container: Container) => {
  container.bind<Logger>(sharedIdentifiers.Logger).toConstantValue(rootLogger);
  container
    .bind<HttpClient>(sharedIdentifiers.HttpClient)
    .toConstantValue(createHttpClient());

  container
    .bind<AuthService>(sharedIdentifiers.AuthService)
    .toDynamicValue((context) => {
      return telegramAuthService; // У него пока нет зависимостей
    });
};
