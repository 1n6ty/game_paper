import { fetchDataMatrix } from "../infrastructure/index";

// Возвращает список всех видео
// В формате { game_name_1: cover_url_1, game_name_2: cover_url_2, ... }
// export async function loadDMVideos() {
//     const gameLinks = await fetchDMVideoLinks();
//     const result = {};
//     Object.keys(gameLinks).forEach(gameName => {
//       result[gameName] = "/media/" + gameLinks[gameName].cover_url;
//     });
//     return result;
//   };

export async function getScoreAndPathByDatamatrix(authRawData, dataMatrixText) {
  try {
    const data = await fetchDataMatrix(authRawData, dataMatrixText);

    if (typeof data.score !== "number") {
      throw new Error("Unexpected response format: score is not a number");
    }

    return {
      score: data.score,
      path: data.path || null,
      scanned: false,
    };
  } catch (e) {
    if (e.isClientError) {
      // Уже просканировано (или другая 4xx)
      return {
        score: null,
        path: null,
        scanned: true,
      };
    }

    // Пробрасываем все прочие ошибки дальше
    throw e;
  }
}