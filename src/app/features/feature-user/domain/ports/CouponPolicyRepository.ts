import { CouponPolicy } from "@/app/features/feature-user/domain/entities/CouponPolicy";

export interface CouponPolicyRepository {
  // Не принимает токен, так как политика - общая
  getCouponPolicy(): Promise<CouponPolicy>;
}
