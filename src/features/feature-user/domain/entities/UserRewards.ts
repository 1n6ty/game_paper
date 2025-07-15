import { CouponPolicy } from "../value-objects/CouponPolicy";

/**
 * Описывает очки пользователя.
 */
export interface UserRewards {
  score: number;
  tickets: number;
  policy: CouponPolicy;
}
