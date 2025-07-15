import { Logger } from "../../../../shared-kernel/application/ports/Logger";
import { AppError } from "../../../../shared-kernel/domain/errors/AppError";
import { AuthService } from "../../../../shared-kernel/domain/ports/AuthService";

interface LoadAuthDataDeps {
  authService: AuthService;
  logger: Logger;
}

export async function loadAuthData({
  authService,
  logger,
}: LoadAuthDataDeps): Promise<string> {
  try {
    const authData = await authService.getAuthData();

    logger.info("loadAuthData", "Начинаем загрузку токена авторизации");

    if (!authData)
      throw new AppError("Не удалось получить токена авторизации.");

    logger.info("loadAuthData", "Токен загружен", authData);

    return authData;
  } catch (error: unknown) {
    logger.error(
      "loadAuthData",
      "Ошибка при загрузке токена авторизации",
      error as Error
    );
    throw new AppError(
      (error as Error).message || "Ошибка загрузки токена авторизации."
    );
  }
}
