import { fetchGameLinks } from "../infrastructure";
import GameApi from "../infrastructure/GameApi";

// Возвращает названия доступных игр
// В формате { game_name_1: cover_url_1, game_name_2: cover_url_2, ... }
export async function loadGames() {
  try {
    const gameLinks = await fetchGameLinks();
    const result = {};
    Object.keys(gameLinks).forEach(gameName => {
      result[gameName] = "/media/" + gameLinks[gameName].cover_url;
    });
    return result;    
  } catch (e) {
    throw new Error("Games loading failed: " + e.message);
  }
}

// Возвращает имя и url игры с именем gameName
export async function loadGameData(gameName) {
  try {
    const gameLinks = await fetchGameLinks();
    return {
      gameName,
      gameUrl: "/media/" + gameLinks[gameName].draw_url
    };
  } catch (e) {
    throw new Error("Game data loading failed: " + e.message);
  }
}

/**
 * Запускает игру (запрашивает инициализационные данные, вызывает модуль инициализации).
 * @param {GameApi} gameApi - экземпляр GameApi.
 */
export function startGame(gameApi) {
  if (!gameApi)
    console.error("[gameUseCases] startGame: gameApi является null или undefined!");
  else
    gameApi.start();
}

/**
 * Завершает игру, не передавая никакие данные в неё (запрашивает инициализационные данные, вызывает модуль завершения).
 * @param {GameApi} gameApi - экземпляр GameApi.
 */
export function finishGame(gameApi) {
  if (!gameApi)
    console.error("[gameUseCases] finishGame: gameApi является null или undefined!");
  else
    gameApi.finish({});
}

/**
 * Инициализация игрового процесса с настройкой колбэков.
 * @param {Object} params
 * @param {HTMLCanvasElement} params.canvas
 * @param {string} params.authRawData
 * @param {string} params.gameName
 * @param {string} params.drawScriptUrl
 * @param {Function} params.onModuleLoad
 * @param {Function} params.onAssetsLoaded
 * @param {Function} params.onFinish
 * @returns {GameApi}
 */
export function initGameApi({
  canvas,
  authRawData,
  gameName,
  drawScriptUrl,
  onModuleLoad = () => {},
  onAssetsLoaded = () => {},
  onFinish = () => {}
}) {
  const api = new GameApi(
    canvas,
    authRawData,
    gameName,
    drawScriptUrl,
    onModuleLoad,
    onAssetsLoaded
  );
  api.onFinish = onFinish;
  return api;
}