import { Container } from "inversify";
import { CouponPolicyRepository } from "./domain/ports/CouponPolicyRepository";
import { UserRewardsRepository } from "./domain/ports/UserRewardsRepository";

export const userFeatureIdentifiers = {
  UserRewardsRepository: Symbol.for("UserRewardsRepository"),
  CouponPolicyRepository: Symbol.for("CouponPolicyRepository"),
};

export interface UserFeatureImplementations {
  userRewardsRepository: UserRewardsRepository;
  couponPolicyRepository: CouponPolicyRepository;
}

export const registerUserFeature = (
  container: Container,
  impls: UserFeatureImplementations
) => {
  container
    .bind<UserRewardsRepository>(userFeatureIdentifiers.UserRewardsRepository)
    .toConstantValue(impls.userRewardsRepository);
  container
    .bind<CouponPolicyRepository>(userFeatureIdentifiers.CouponPolicyRepository)
    .toConstantValue(impls.couponPolicyRepository);
};
