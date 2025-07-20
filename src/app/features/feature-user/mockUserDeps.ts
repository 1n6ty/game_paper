import { Container } from "inversify";
import { CouponPolicyRepository } from "./domain/ports/CouponPolicyRepository";
import { UserRewardsRepository } from "./domain/ports/UserRewardsRepository";
import { mockCouponPolicyRepository } from "./infrastructure/repos/user-rewards-facade/__mocks__/mockCouponPolicyRepository";
import { mockUserRewardsRepository } from "./infrastructure/repos/user-rewards-facade/__mocks__/mockUserRewardsRepository";
import { userFeatureIdentifiers } from "./userDeps";

export const registerMockUserFeature = (container: Container) => {
  container
    .bind<UserRewardsRepository>(userFeatureIdentifiers.UserRewardsRepository)
    .toConstantValue(mockUserRewardsRepository);

  container
    .bind<CouponPolicyRepository>(userFeatureIdentifiers.CouponPolicyRepository)
    .toConstantValue(mockCouponPolicyRepository);
};
