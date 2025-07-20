import { Container } from "inversify";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { AuthService } from "@/app/shared-kernel/domain/ports/AuthService";
import { sharedIdentifiers } from "@/app/shared-kernel/sharedKernelDeps";
import { CouponPolicyRepository } from "./domain/ports/CouponPolicyRepository";
import { UserRewardsRepository } from "./domain/ports/UserRewardsRepository";
import { createUserRewardsRepositoryFacade } from "./infrastructure/repos/user-rewards-facade";

export const userFeatureIdentifiers = {
  UserRewardsRepository: Symbol.for("UserRewardsRepository"),
  CouponPolicyRepository: Symbol.for("CouponPolicyRepository"),
};

export const registerUserFeature = (container: Container) => {
  container
    .bind<UserRewardsRepository>(userFeatureIdentifiers.UserRewardsRepository)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(sharedIdentifiers.Logger);
      const httpClient = context.get<HttpClient>(sharedIdentifiers.HttpClient);
      const authService = context.get<AuthService>(
        sharedIdentifiers.AuthService
      );

      return createUserRewardsRepositoryFacade({
        logger,
        httpClient,
        authService,
      });
    });

  container
    .bind<CouponPolicyRepository>(userFeatureIdentifiers.UserRewardsRepository)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(sharedIdentifiers.Logger);
      const httpClient = context.get<HttpClient>(sharedIdentifiers.HttpClient);
      const authService = context.get<AuthService>(
        sharedIdentifiers.AuthService
      );

      return createUserRewardsRepositoryFacade({
        logger,
        httpClient,
        authService,
      });
    });
};
