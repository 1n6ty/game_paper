import { GameEngineConfig } from "@/app/features/feature-game/application/ports/GameEngineFactory";
import { GameEngine } from "@/app/features/feature-game/domain/entities/GameEngine";
import {
  GameModule,
  TmpState,
} from "@/app/features/feature-game/infrastructure/services/game-engine-factory/types";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { convertKeysFromSnakeToCamel } from "./mapper";
import {
  GameEngineApiEndpoints,
  GameFinishResponse,
  GameInitResponse,
} from "./types";

interface GameEngineDependencies {
  httpClient: HttpClient;
  logger: Logger;
  endpoints: GameEngineApiEndpoints;
}

let tmpState: TmpState;

const startImpl = async (
  gameModule: GameModule | null,
  config: GameEngineConfig,
  { httpClient, logger, endpoints }: GameEngineDependencies
) => {
  const { canvas, authRawData, gameName, onAssetsLoaded } = config;

  if (!gameModule) {
    logger.error("startImpl", "Ошибка: модуль игры еще не загружен");

    return;
  }

  try {
    const initGameData = await httpClient.post<GameInitResponse>(
      endpoints.gameInit,
      {
        body: { game_name: gameName },
        authData: authRawData,
      }
    );

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
        finishImpl(gameData, gameModule, config, {
          httpClient,
          logger,
          endpoints,
        }),
      onAssetsLoaded
    );
  } catch (error) {
    logger.error("startImpl", "Ошибка инициализации игры", error as Error);
  }
};

const finishImpl = async (
  gameDataFromScript: unknown,
  gameModule: GameModule | null,
  config: GameEngineConfig,
  { httpClient, logger, endpoints }: GameEngineDependencies
) => {
  const { canvas, authRawData, onFinish } = config;

  if (!gameModule) {
    logger.error("finishImpl", "Ошибка: модуль игры ещё не загружен");

    return;
  }

  try {
    const responseJson = await httpClient.post<GameFinishResponse>(
      endpoints.gameFinish,
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
    logger.error("finishImpl", "Ошибка завершения игры", error as Error);
  }
};

export const createGameEngine = (
  gameModule: GameModule | null,
  config: GameEngineConfig,
  { httpClient, logger, endpoints }: GameEngineDependencies
): GameEngine => {
  tmpState = {};

  return {
    start: () =>
      startImpl(gameModule, config, { httpClient, logger, endpoints }),
    finish: () =>
      finishImpl(
        {
          // пусто, либо можно добавить какие-нибудь данные, чтобы сервер обработал
        },
        gameModule,
        config,
        { httpClient, logger, endpoints }
      ),
  };
};
