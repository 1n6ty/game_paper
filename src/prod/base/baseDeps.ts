import { Container } from "inversify";
import { registerDataMatrixFeature } from "@/app/features/feature-datamatrix/dataMatrixDeps";
import { createDataMatrixRepository } from "@/app/features/feature-datamatrix/infrastructure/repos/data-matrix";
import { registerGameFeature } from "@/app/features/feature-game/gameDeps";
import { createGameRepository } from "@/app/features/feature-game/infrastructure/repos/game";
import { createGameEngineFactory } from "@/app/features/feature-game/infrastructure/services/game-engine-factory";
import { createUserRewardsRepositoryFacade } from "@/app/features/feature-score/infrastructure/repos/user-rewards-facade";
import { registerUserFeature } from "@/app/features/feature-score/userDeps";
import { ApiConfig } from "@/app/shared-kernel/application/ports/ApiConfig";
import { createHttpClient } from "@/app/shared-kernel/infrastructure/http";
import { telegramAuthService } from "@/app/shared-kernel/infrastructure/services/auth-telegram";
import { rootLogger } from "@/app/shared-kernel/infrastructure/services/logger-console";
import {
  registerSharedKernel,
  sharedIdentifiers,
} from "@/app/shared-kernel/sharedKernelDeps";
import { baseApiConfig } from "./baseApiConfig";

export const createBaseDIContainer = (): Container => {
  const container = new Container();

  const shared = {
    logger: rootLogger,
    httpClient: createHttpClient(),
    authService: telegramAuthService,
    apiConfig: baseApiConfig,
  };

  registerSharedKernel(container, shared);

  const apiConfig = container.get<ApiConfig>(sharedIdentifiers.ApiConfig);

  registerUserFeature(container, {
    userRewardsRepository: createUserRewardsRepositoryFacade({
      ...shared,
      endpoints: {
        getUserRewards: apiConfig.endpoints.user.rewards,
      },
    }),
    couponPolicyRepository: createUserRewardsRepositoryFacade({
      ...shared,
      endpoints: {
        getUserRewards: apiConfig.endpoints.user.rewards,
      },
    }),
  });
  registerGameFeature(container, {
    gameRepository: createGameRepository({
      ...shared,
      endpoints: {
        getGames: apiConfig.endpoints.game.list,
      },
    }),
    gameEngineFactory: createGameEngineFactory({
      ...shared,
      endpoints: {
        gameInit: apiConfig.endpoints.game.initialize,
        gameFinish: apiConfig.endpoints.game.finish,
      },
    }),
  });
  registerDataMatrixFeature(container, {
    dataMatrixRepository: createDataMatrixRepository({
      ...shared,
      endpoints: {
        scanDataMatrix: apiConfig.endpoints.datamatrix.scan,
      },
    }),
  });

  return container;
};
