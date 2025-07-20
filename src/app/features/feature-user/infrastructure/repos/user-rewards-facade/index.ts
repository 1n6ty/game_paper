import { CouponPolicyRepository } from "@/app/features/feature-user/domain/ports/CouponPolicyRepository";
import { UserRewardsRepository } from "@/app/features/feature-user/domain/ports/UserRewardsRepository";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { AuthService } from "@/app/shared-kernel/domain/ports/AuthService";
import {
  mapScoreResponseToCouponPolicy,
  mapScoreResponseToUserRewards,
} from "./mapper";
import { userRewardsRepositoryPath } from "./paths";
import { ScoreResponse } from "./types";

interface UserRewardsRepoDeps {
  httpClient: HttpClient;
  logger: Logger;
  authService: AuthService;
}

interface CachedData {
  data: ScoreResponse;
  timestamp: number;
}

export const createUserRewardsRepositoryFacade = ({
  httpClient,
  logger,
  authService,
}: UserRewardsRepoDeps): UserRewardsRepository & CouponPolicyRepository => {
  let cache: CachedData | null = null;

  // Функция, которая делает реальный запрос или возвращает из кэша
  const fetchAndCacheData = async (
    authData: string
  ): Promise<ScoreResponse> => {
    if (cache && Date.now() - cache.timestamp < 10000) {
      logger.info("fetchAndCacheData", "Возвращаем данные из кэша");

      return cache.data;
    }

    logger.info("fetchAndCacheData", "Выполняем запрос к API");
    const dto = await httpClient.get<ScoreResponse>(
      userRewardsRepositoryPath.SCORE,
      {
        authData,
      }
    );

    cache = { data: dto, timestamp: Date.now() };

    return dto;
  };

  return {
    getUserRewards: async (authData: string) => {
      const dto = await fetchAndCacheData(authData);

      return mapScoreResponseToUserRewards(dto);
    },
    getCouponPolicy: async () => {
      const authData = await authService.getAuthData();
      const dto = await fetchAndCacheData(authData);

      return mapScoreResponseToCouponPolicy(dto);
    },
  };
};
