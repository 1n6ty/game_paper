import { HttpClient } from "../../../../../shared-kernel/application/ports/HttpClient";
import { Logger } from "../../../../../shared-kernel/application/ports/Logger";
import {
  GameEngineConfig,
  GameEngine,
} from "../../../application/ports/GameEngineFactory";
import { GameModule, TmpState } from "../game-engine-factory/types";
import { convertKeysFromSnakeToCamel } from "./mapper";
import { GameFinishResponse, GameInitResponse } from "./types";

interface GameEngineDependencies {
  httpClient: HttpClient;
  logger: Logger;
}

let tmpState: TmpState;

async function startImpl(
  gameModule: GameModule | null,
  config: GameEngineConfig,
  { httpClient, logger }: GameEngineDependencies
) {
  const { canvas, authRawData, gameName, onAssetsLoaded } = config;

  if (!gameModule) {
    logger.error("startImpl", "Ошибка: модуль игры еще не загружен");

    return;
  }

  try {
    const initGameData = await httpClient.post<GameInitResponse>("/gameinit/", {
      body: { game_name: gameName },
      authData: authRawData,
    });

    if (typeof gameModule.init !== "function") {
      logger.error(
        "startImpl",
        "Ошибка: функция init не найдена в модуле игры"
      );

      return;
    }

    const camelInit = convertKeysFromSnakeToCamel<GameInitResponse>(
      initGameData.init
    );

    tmpState = gameModule.init(
      canvas,
      camelInit,
      tmpState,
      (gameData) =>
        finishImpl(gameData, gameModule, config, { httpClient, logger }),
      onAssetsLoaded
    );
  } catch (error) {
    logger.error("startImpl", "Ошибка инициализации игры", error);
  }
}

async function finishImpl(
  gameDataFromScript: unknown,
  gameModule: GameModule | null,
  config: GameEngineConfig,
  { httpClient, logger }: GameEngineDependencies
) {
  const { canvas, authRawData, onFinish } = config;

  if (!gameModule) {
    logger.error("finishImpl", "Ошибка: модуль игры еще не загружен");

    return;
  }

  try {
    const responseJson = await httpClient.post<GameFinishResponse>(
      "/gamefinish/",
      {
        body: gameDataFromScript,
        authData: authRawData,
      }
    );

    if (gameModule && typeof gameModule.deinit === "function") {
      gameModule.deinit(canvas, tmpState);
    }

    onFinish(responseJson.score);
  } catch (error) {
    logger.error("finishImpl", "Ошибка завершения игры", error);
  }
}

export function createGameEngine(
  gameModule: GameModule | null,
  config: GameEngineConfig,
  { httpClient, logger }: GameEngineDependencies
): GameEngine {
  tmpState = {};

  return {
    start: () => startImpl(gameModule, config, { httpClient, logger }),
    finish: () =>
      finishImpl(
        {
          // пусто, либо можно добавить какие-нибудь данные, чтобы сервер обработал
        },
        gameModule,
        config,
        { httpClient, logger }
      ),
  };
}
