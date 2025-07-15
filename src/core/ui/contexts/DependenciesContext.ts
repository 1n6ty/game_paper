import { createContext } from "react";
import { ILogger } from "../../../shared-kernel/application/ports/Logger";
import { IAuthService } from "../../../shared-kernel/domain/ports/AuthService";
import { IUserRewardsRepository } from "../../../features/feature-user/domain/ports/UserRewardsRepository";

export interface IDependencies {
  logger: ILogger;
  authService: IAuthService;
  // appConfigRepository: IAppConfigRepository;
  userRewardsRepository: IUserRewardsRepository;
  // ... и все остальные зависимости
}

const unimplemented = (name: string) => () => {
  throw new Error(
    `[DependenciesContext] Попытка вызвать метод '${name}', но зависимость не была предоставлена.`
  );
};

const initialDependencies: IDependencies = {
  logger: {
    info: unimplemented("logger.info"),
    warn: unimplemented("logger.warn"),
    error: unimplemented("logger.error"),
    createScope: unimplemented("logger.createScope"),
  },
  authService: {
    getAuthenticatedUser: unimplemented("authService.getAuthenticatedUser"),
    getAuthData: unimplemented("authService.getAuthData"),
  },
  // appConfigRepository: {
  //   getConfig: unimplemented("appConfigRepository.getConfig"),
  // },
  userRewardsRepository: {
    getUserRewards: unimplemented("userRewardsRepository.getUserRewards"),
  },
  // ... и так далее для всех зависимостей
};

export const DependenciesContext =
  createContext<IDependencies>(initialDependencies);
