import { fetchScore } from "../infrastructure/index";

export async function loadUserScore(authRawData) {
  try {
    const data = await fetchScore(authRawData); // data: { score: number, scores_for_coupon: number }

    // if (typeof data.scores !== "number" || typeof data.coupons !== "number" || typeof data.scores_for_coupon !== "number") {
    //   throw new Error("Неверный формат данных");
    // }

    return {
      score: data.scores,  // word scores is not good
      tickets: data.coupons,
      totalScore: data.scores_for_coupon, // word scores_for_coupon is not good 
    };
  } catch (error) {
    console.error("Ошибка в loadUserScore:", error);
    throw error;
  }
}