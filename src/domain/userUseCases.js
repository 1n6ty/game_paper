import { fetchScore } from '../infrastructure/index';

async function loadUserScore(authRawData) {
  try {
    const data = await fetchScore(authRawData); // data: { score: number, score_for_coupon: number }

    if (typeof data.score !== 'number' || typeof data.score_for_coupon !== 'number') {
      throw new Error("Неверный формат данных");
    }

    const processedScore = data.score % data.score_for_coupon;
    const tickets = Math.floor(data.score / data.score_for_coupon);

    return {
      score: processedScore,
      tickets,
      totalScore: data.score_for_coupon,
    };
  } catch (error) {
    console.error("Ошибка в loadUserScore:", error);
    throw error;
  }
}

export { loadUserScore };