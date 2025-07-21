import {
  GameEngineFactory,
  GameEngineConfig,
} from "@/app/features/feature-game/application/ports/GameEngineFactory";
import { GameEngine } from "@/app/features/feature-game/domain/entities/GameEngine";
import { createGameEngine } from "@/app/features/feature-game/infrastructure/services/game-engine";
import { GameEngineApiEndpoints } from "@/app/features/feature-game/infrastructure/services/game-engine/types";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { GameModule, TmpState } from "./types";

interface GameEngineFactoryDependencies {
  httpClient: HttpClient;
  logger: Logger;
  endpoints: GameEngineApiEndpoints;
}

const loadModule = async (
  drawScriptUrl: string,
  onModuleLoad: () => void,
  logger: Logger
): Promise<GameModule | null> => {
  try {
    const module = await import(drawScriptUrl);

    const gameModule = (module.default || module) as GameModule;

    onModuleLoad();

    return gameModule;
  } catch (error) {
    logger.error(
      "loadModule",
      "Ошибка загрузки скрипта отрисовки",
      error as Error
    );

    return null;
  }
};

const createImpl = async (
  config: GameEngineConfig,
  { httpClient, logger, endpoints }: GameEngineFactoryDependencies
): Promise<GameEngine> => {
  const { drawScriptUrl, onModuleLoad } = config;

  const gameModule = await loadModule(drawScriptUrl, onModuleLoad, logger);

  // const finishGame = async (gameDataFromScript: unknown) => {
  //   try {
  //     const responseJson = await httpClient.post<GameFinishResponse>(
  //       "/gamefinish/",
  //       {
  //         body: gameDataFromScript,
  //         authData: authRawData,
  //       }
  //     );

  //     if (gameModule && typeof gameModule.deinit === "function") {
  //       gameModule.deinit(canvas, tmpState);
  //     }

  //     onFinish(responseJson.score);
  //   } catch (error) {
  //     logger.error("finishGame", "Ошибка завершения игры", error);
  //   }
  // };
  /** */
  // const start = async () => {
  //   if (!gameModule) {
  //     logger.error("start", "Ошибка: модуль игры еще не загружен");

  //     return;
  //   }

  //   try {
  //     const initGameData = await httpClient.post<GameInitResponse>(
  //       "/gameinit/",
  //       {
  //         body: { game_name: gameName },
  //         authData: authRawData,
  //       }
  //     );

  //     if (typeof gameModule.init !== "function") {
  //       logger.error("start", "Ошибка: функция init не найдена в модуле игры");

  //       return;
  //     }

  //     const camelInit = convertKeysToCamel<GameInitResponse>(initGameData.init);

  //     tmpState = gameModule.init(
  //       canvas,
  //       camelInit,
  //       tmpState,
  //       finishGame,
  //       onAssetsLoaded
  //     );
  //   } catch (error) {
  //     logger.error("start", "Ошибка инициализации игры", error);
  //   }
  // };

  const gameEngine = createGameEngine(gameModule, config, {
    httpClient,
    logger,
    endpoints,
  });

  return gameEngine;
};

export const createGameEngineFactory = ({
  httpClient,
  logger,
  endpoints,
}: GameEngineFactoryDependencies): GameEngineFactory => {
  return {
    create: (config) => createImpl(config, { httpClient, logger, endpoints }),
  };
};
