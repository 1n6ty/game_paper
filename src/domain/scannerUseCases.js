import { fetchDataMatrix } from '../infrastructure/index';

// Возвращает список всех 
// В формате { game_name_1: cover_url_1, game_name_2: cover_url_2, ... }
// async function loadDMVideos() {
//     const gameLinks = await fetchDMVideoLinks();
//     const result = {};
//     Object.keys(gameLinks).forEach(gameName => {
//       result[gameName] = "/media/" + gameLinks[gameName].cover_url;
//     });
//     return result;
//   };

async function getScoreByDatamatrix(authRawData, dataMatrixText) {
    // {score: int}
    const data = await fetchDataMatrix(authRawData, dataMatrixText); 
    const score = data.score;
    if (typeof score !== 'number') {
        console.log("Неверный формат данных!");
    }

    return score, data.path; 
}

export { getScoreByDatamatrix };