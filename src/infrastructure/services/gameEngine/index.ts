import IGameEngineService, {
  IGameEngine,
  GameEngineConfig,
} from "../../../application/ports/IGameEngineService";

import httpClient from "../../http";

type GameInitDTO = { init: unknown };
type GameFinishResponseDTO = { score: number };

function create(config: GameEngineConfig): IGameEngine {
  const {
    canvas,
    authRawData,
    gameName,
    drawScriptUrl,
    onFinish,
    onAssetsLoaded,
    onModuleLoad,
  } = config;

  let tmpState: unknown = {};
  let gameModule: any = null;

  (async () => {
    try {
      const module = await import(/* webpackIgnore: true */ drawScriptUrl);
      gameModule = module.default || module;
      onModuleLoad();
    } catch (reason) {
      console.error(`[ERROR] Ошибка загрузки скрипта отрисовки: ${reason}`);
    }
  })();

  const finishGame = async (gameDataFromScript: unknown) => {
    try {
      const responseJson = await httpClient.post<GameFinishResponseDTO>("/gamefinish/", {
        body: gameDataFromScript,
        authData: authRawData,
      });

      if (gameModule && typeof gameModule.deinit === 'function') {
        gameModule.deinit(canvas, tmpState);
      }
      onFinish(responseJson.score);
    } catch (error) {
      console.error(`[ERROR] Ошибка завершения игры: ${error}`);
    }
  };

  const start = async () => {
    if (!gameModule) {
      console.error("[ERROR] Модуль игры еще не загружен.");
      return;
    }
    try {
      const initGameData = await httpClient.post<GameInitDTO>("/gameinit/", {
        body: { game_name: gameName },
        authData: authRawData,
      });

      if (typeof gameModule.init !== 'function') {
        console.error("[ERROR] Функция init не найдена в модуле игры.");
        return;
      }

      tmpState = gameModule.init(
        canvas, initGameData.init, tmpState, finishGame, onAssetsLoaded
      );
    } catch (error) {
      console.error(`[ERROR] Ошибка инициализации игры: ${error}`);
    }
  };

  return {
    start,
  };
}

const gameEngineService: IGameEngineService = {
  create,
};

export default gameEngineService;