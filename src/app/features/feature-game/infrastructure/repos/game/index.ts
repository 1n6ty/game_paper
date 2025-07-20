import { Game } from "@/app/features/feature-game/domain/entities/Game";
import { GameRepository } from "@/app/features/feature-game/domain/ports/GameRepository";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { mapGameLinksResponseToGames } from "./mapper";
import { gameRepositoryPaths } from "./paths";
import { GameLinksResponse } from "./types";

interface GameRepoDependencies {
  httpClient: HttpClient;
  logger: Logger;
}

/**
 * Получает и преобразует список игр с сервера.
 */
const getGamesImpl = async (
  httpClient: HttpClient,
  logger: Logger
): Promise<Game[]> => {
  const response = await httpClient.get<GameLinksResponse>(
    gameRepositoryPaths.GAME_LINKS
  );

  logger.info("getGamesImpl", "Получен список игр (сырой вид):", response);

  const games = mapGameLinksResponseToGames(response);

  return games;
};

export const createGameRepository = ({
  httpClient,
  logger,
}: GameRepoDependencies): GameRepository => {
  return {
    getGames: () => getGamesImpl(httpClient, logger),
  };
};
