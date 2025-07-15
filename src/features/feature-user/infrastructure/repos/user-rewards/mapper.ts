import { UserRewards } from "../../../domain/entities/UserRewards";
import { ScoreResponse } from "./types";

export function mapScoreResponseToUserRewards(
  response: ScoreResponse
): UserRewards {
  return {
    score: response.score,
    tickets: response.coupons,
    policy: {
      priceInScore: response.score_for_coupon,
    },
  };
}
