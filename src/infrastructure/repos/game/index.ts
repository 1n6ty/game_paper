import { IGameRepository } from "../../../domain/ports/IRepositories";
import { Game, GameLinksDTO } from "../../../domain/entities/game";
import { mapGameLinksDTOToGames } from "../../mappers/gameMappers";
import httpClient from "../../http";

/**
 * Получает и преобразует список игр с сервера.
 */
async function getGamesImpl(): Promise<Game[]> {
  const data = await httpClient.get<GameLinksDTO>("/gamelinks/");
  return mapGameLinksDTOToGames(data);
}

const gameRepository: IGameRepository = {
  getGames: getGamesImpl,
};

export default gameRepository;