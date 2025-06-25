import { IUserRepository } from "../../../domain/ports/IRepositories";
import { UserScoreDTO } from "../../../domain/entities/user";
import httpClient from "./../../http";

/**
 * Получает данные о счете пользователя с сервера.
 */
async function getScoreImpl(authData: string): Promise<UserScoreDTO> {
  return httpClient.get<UserScoreDTO>("/score/", {
    authData: authData,
  });
}

const userRepository: IUserRepository = {
  getScore: getScoreImpl,
};

export default userRepository;