import { HttpClient } from "../../../../../shared-kernel/application/ports/HttpClient";
import { Logger } from "../../../../../shared-kernel/application/ports/Logger";
import {
  GameEngineFactory,
  GameEngine,
  GameEngineConfig,
} from "../../../application/ports/GameEngineFactory";
import { createGameEngine } from "../game-engine";
import { GameModule, TmpState } from "./types";

interface GameEngineFactoryDependencies {
  httpClient: HttpClient;
  logger: Logger;
}

async function loadModule(
  drawScriptUrl: string,
  onModuleLoad: () => void,
  logger: Logger
): Promise<GameModule | null> {
  try {
    const module = await import(drawScriptUrl);

    const gameModule = (module.default || module) as GameModule;

    onModuleLoad();

    return gameModule;
  } catch (error) {
    logger.error("loadModule", "Ошибка загрузки скрипта отрисовки", error);

    return null;
  }
}

async function createImpl(
  config: GameEngineConfig,
  { httpClient, logger }: GameEngineFactoryDependencies
): Promise<GameEngine> {
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
  });

  return gameEngine;
}

export function createGameEngineService({
  httpClient,
  logger,
}: GameEngineFactoryDependencies): GameEngineFactory {
  return {
    create: (config) => createImpl(config, { httpClient, logger }),
  };
}
