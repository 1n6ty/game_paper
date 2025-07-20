import { Container } from "inversify";
import { HttpClient } from "./application/ports/HttpClient";
import { Logger } from "./application/ports/Logger";
import { AuthService } from "./domain/ports/AuthService";
import { mockHttpClient } from "./infrastructure/http/__mocks__/mockHttpClient";
import { mockAuthService } from "./infrastructure/services/auth-telegram/__mocks__/mockAuthService";
import { rootLogger } from "./infrastructure/services/logger-console";
import { sharedIdentifiers } from "./sharedKernelDeps";

export const registerMockSharedKernel = (container: Container) => {
  // Регистрируем реальный логгер, чтобы видеть логи в консоли во время мок-разработки
  container.bind<Logger>(sharedIdentifiers.Logger).toConstantValue(rootLogger);

  // Регистрируем моковый HTTP-клиент, чтобы не делать реальных запросов
  container
    .bind<HttpClient>(sharedIdentifiers.HttpClient)
    .toConstantValue(mockHttpClient);

  // Регистрируем моковый сервис аутентификации
  container
    .bind<AuthService>(sharedIdentifiers.AuthService)
    .toConstantValue(mockAuthService);
};
