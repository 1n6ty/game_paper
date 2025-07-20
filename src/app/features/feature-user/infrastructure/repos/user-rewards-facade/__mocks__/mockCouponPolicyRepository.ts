import { CouponPolicyRepository } from "@/app/features/feature-user/domain/ports/CouponPolicyRepository";
import { mockCouponPolicy } from "./mockCouponPolicy";

export const mockCouponPolicyRepository: CouponPolicyRepository = {
  getCouponPolicy: async () => mockCouponPolicy,
};
