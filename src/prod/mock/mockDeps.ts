import { Container } from "inversify";
import { registerDataMatrixFeature } from "@/app/features/feature-datamatrix/dataMatrixDeps";
import { mockDataMatrixRepository } from "@/app/features/feature-datamatrix/infrastructure/repos/data-matrix/__mocks__/mockDataMatrixRepository";
import { registerGameFeature } from "@/app/features/feature-game/gameDeps";
import { mockGameRepository } from "@/app/features/feature-game/infrastructure/repos/game/__mocks__/mockGameRepository";
import { mockGameEngineFactory } from "@/app/features/feature-game/infrastructure/services/game-engine-factory/__mocks__/mockGameEngineFactory";
import { mockCouponPolicyRepository } from "@/app/features/feature-score/infrastructure/repos/user-rewards-facade/__mocks__/mockCouponPolicyRepository";
import { mockUserRewardsRepository } from "@/app/features/feature-score/infrastructure/repos/user-rewards-facade/__mocks__/mockUserRewardsRepository";
import { registerUserFeature } from "@/app/features/feature-score/userDeps";
import { mockHttpClient } from "@/app/shared-kernel/infrastructure/http/__mocks__/mockHttpClient";
import { mockAuthService } from "@/app/shared-kernel/infrastructure/services/auth-telegram/__mocks__/mockAuthService";
import { noopLogger } from "@/app/shared-kernel/infrastructure/services/logger-console/__mocks__/noopLogger";
import { registerSharedKernel } from "@/app/shared-kernel/sharedKernelDeps";
import { mockApiConfig } from "./mockApiConfig";

export const createMockDIContainer = (): Container => {
  const container = new Container();

  registerSharedKernel(container, {
    logger: noopLogger,
    httpClient: mockHttpClient,
    authService: mockAuthService,
    apiConfig: mockApiConfig,
  });
  registerUserFeature(container, {
    userRewardsRepository: mockUserRewardsRepository,
    couponPolicyRepository: mockCouponPolicyRepository,
  });
  registerGameFeature(container, {
    gameRepository: mockGameRepository,
    gameEngineFactory: mockGameEngineFactory,
  });
  registerDataMatrixFeature(container, {
    dataMatrixRepository: mockDataMatrixRepository,
  });

  return container;
};
