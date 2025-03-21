import { fetchScore } from '../infrastructure/index';

async function loadUserScore(userName, defaultTotalScore = 1000) {
  try {
    const data = await fetchScore(userName); // data: { score: number, score_for_coupon: number }

    // Проверяем, что поля существуют
    if (typeof data.score !== 'number' || typeof data.score_for_coupon !== 'number') {
      throw new Error("Неверный формат данных");
    }

    // Применяем бизнес-логику: вычисляем остаток и билеты
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