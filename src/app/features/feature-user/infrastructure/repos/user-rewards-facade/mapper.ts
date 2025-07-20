import { CouponPolicy } from "@/app/features/feature-user/domain/entities/CouponPolicy";
import { UserRewards } from "@/app/features/feature-user/domain/entities/UserRewards";
import { ScoreResponse } from "./types";

export const mapScoreResponseToUserRewards = (
  response: ScoreResponse
): UserRewards => {
  return {
    score: response.score,
    tickets: response.coupons,
  };
};

export const mapScoreResponseToCouponPolicy = (
  response: ScoreResponse
): CouponPolicy => {
  return {
    priceInScore: response.score_for_coupon,
  };
};
