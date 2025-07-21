import { Game } from "@/app/features/feature-game/domain/entities/Game";
import { GameRepository } from "@/app/features/feature-game/domain/ports/GameRepository";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { mapGameLinksResponseToGames } from "./mapper";
import { GameApiEndpoints, GameLinksResponse } from "./types";

interface GameRepoDependencies {
  httpClient: HttpClient;
  logger: Logger;
  endpoints: GameApiEndpoints;
}

/**
 * Получает и преобразует список игр с сервера.
 */
const getGamesImpl = async ({
  httpClient,
  logger,
  endpoints,
}: GameRepoDependencies): Promise<Game[]> => {
  const response = await httpClient.get<GameLinksResponse>(endpoints.getGames);

  logger.info("getGamesImpl", "Получен список игр (сырой вид):", response);

  const games = mapGameLinksResponseToGames(response);

  return games;
};

export const createGameRepository = ({
  httpClient,
  logger,
  endpoints,
}: GameRepoDependencies): GameRepository => {
  return {
    getGames: () => getGamesImpl({ httpClient, logger, endpoints }),
  };
};
