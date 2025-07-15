import { HttpClient } from "../../../../../shared-kernel/application/ports/HttpClient";
import { Logger } from "../../../../../shared-kernel/application/ports/Logger";
import { UserRewards } from "../../../domain/entities/UserRewards";
import { UserRewardsRepository } from "../../../domain/ports/UserRewardsRepository";
import { mapScoreResponseToUserRewards } from "./mapper";
import { ScoreResponse } from "./types";

interface UserRewardsRepoDeps {
  httpClient: HttpClient;
  logger: Logger;
}

/**
 * Получает данные о счете пользователя с сервера.
 */
async function getUserRewardsImpl(
  authData: string,
  { httpClient, logger }: UserRewardsRepoDeps
): Promise<UserRewards> {
  const response = await httpClient.get<ScoreResponse>("/score/", {
    authData: authData,
  });

  return mapScoreResponseToUserRewards(response);
}

export function createUserRewardsRepository({
  httpClient,
  logger,
}: UserRewardsRepoDeps): UserRewardsRepository {
  return {
    getUserRewards: (authData) =>
      getUserRewardsImpl(authData, { httpClient, logger }),
  };
}
