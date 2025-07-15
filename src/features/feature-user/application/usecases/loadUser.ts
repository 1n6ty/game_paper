import { User } from "../../../../shared-kernel/domain/entities/User";
import { AppError } from "../../../../shared-kernel/domain/errors/AppError";
import { AuthService } from "../../../../shared-kernel/domain/ports/AuthService";
import { Logger } from "../../../../shared-kernel/application/ports/Logger";

interface LoadUserDeps {
  authService: AuthService;
  logger: Logger;
}

/**
 * Загружает и объединяет данные о пользователе с платформы и из API.
 */
export async function loadUser({
  authService,
  logger,
}: LoadUserDeps): Promise<User> {
  logger.info("loadUser", "Начинаем загрузку пользователя");
  try {
    const user = await authService.getAuthenticatedUser();

    if (!user) {
      throw new AppError("Не удалось получить данные пользователя.");
    }

    logger.info("loadUser", "Пользователь загружен", user);

    return user;
  } catch (error: unknown) {
    logger.error(
      "loadUser",
      "Ошибка при загрузке пользователя",
      error as Error
    );
    throw new AppError(
      (error as Error).message || "Ошибка загрузки данных пользователя."
    );
  }
}
