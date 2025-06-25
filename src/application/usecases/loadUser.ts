import { User } from "../../domain/entities/user";
import AppError from "../../domain/errors/AppError";
import { IUserRepository } from "../../domain/ports/IRepositories";
import { IAuthService } from "../../domain/ports/IServices";
import { IUseCaseOutputPort } from "../ports/IUseCaseOutputPort";

/**
 * Загружает и объединяет данные о пользователе с платформы и из API.
 */
export async function loadUser(
  authService: IAuthService,
  userRepository: IUserRepository,
  outputPort: IUseCaseOutputPort<User>
): Promise<void> {
  try {
    const [platformUser, authData] = await Promise.all([
      authService.getPlatformUser(),
      authService.getAuthData(),
    ]);

    if (!platformUser || !authData) {
      throw new AppError("Не удалось получить данные для аутентификации.");
    }

    const scoreData = await userRepository.getScore(authData);

    const user: User = {
      username: platformUser.username,
      firstName: platformUser.first_name,
      score: scoreData.scores,
      tickets: scoreData.coupons,
    };

    outputPort.onSuccess(user);
  } catch (error: any) {
    outputPort.onFailure(new AppError(error.message || "Ошибка загрузки данных пользователя."));
  }
}