import { UserWithRewards } from "@/app/features/feature-user/domain/entities/UserWithRewards";
import { UserRewardsRepository } from "@/app/features/feature-user/domain/ports/UserRewardsRepository";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { AppError } from "@/app/shared-kernel/domain/errors/AppError";
import { AuthService } from "@/app/shared-kernel/domain/ports/AuthService";

interface LoadUserDeps {
  authService: AuthService;
  userRewardsRepository: UserRewardsRepository;
  logger: Logger;
}

/**
 * Загружает и объединяет данные о пользователе с платформы и из API.
 */
export const loadUserWithRewards = async ({
  authService,
  userRewardsRepository,
  logger,
}: LoadUserDeps): Promise<UserWithRewards> => {
  logger.info("loadUser", "Начинаем загрузку пользователя");
  try {
    const [authRawData, user] = await Promise.all([
      authService.getAuthData(),
      authService.getAuthenticatedUser(),
    ]);

    const rewards = await userRewardsRepository.getUserRewards(authRawData);

    if (!authRawData || !user || !rewards) {
      throw new AppError("errors.userGet");
    }

    logger.info("loadUser", "Пользователь загружен", user);

    return { ...user, ...rewards };
  } catch (error: unknown) {
    logger.error(
      "loadUser",
      "Ошибка при загрузке пользователя",
      error as Error
    );
    throw new AppError((error as Error).message || "errors.user");
  }
};
