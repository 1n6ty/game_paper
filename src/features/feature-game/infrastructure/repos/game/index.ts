import { HttpClient } from "../../../../../shared-kernel/application/ports/HttpClient";
import { Logger } from "../../../../../shared-kernel/application/ports/Logger";
import { GameRepository } from "../../../domain/ports/GameRepository";
import { Game } from "../../../domain/entities/Game";
import { mapGameLinksResponseToGames } from "./mapper";
import { GameLinksResponse } from "./types";

interface GameRepoDependencies {
  httpClient: HttpClient;
  logger: Logger;
}

/**
 * Получает и преобразует список игр с сервера.
 */
async function getGamesImpl(
  httpClient: HttpClient,
  logger: Logger
): Promise<Game[]> {
  const response = await httpClient.get<GameLinksResponse>("/gamelinks/");

  logger.info("getGamesImpl", "Получен список игр (сырой вид):", response);

  const games = mapGameLinksResponseToGames(response);

  return games;
}

export function createGameRepository({
  httpClient,
  logger,
}: GameRepoDependencies): GameRepository {
  return {
    getGames: () => getGamesImpl(httpClient, logger),
  };
}
