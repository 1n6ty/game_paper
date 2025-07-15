/**
 * DTO (Data Transfer Object) для ответа от нашего API о счете.
 */
export interface ScoreResponse {
  score: number;
  coupons: number;
  score_for_coupon: number;
}
