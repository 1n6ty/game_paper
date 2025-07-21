import { CouponPolicyRepository } from "@/app/features/feature-score/domain/ports/CouponPolicyRepository";
import { mockCouponPolicy } from "./mockCouponPolicy";

export const mockCouponPolicyRepository: CouponPolicyRepository = {
  getCouponPolicy: async () => mockCouponPolicy,
};
