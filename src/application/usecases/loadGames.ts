import { Game } from "../../domain/entities/game";
import AppError from "../../domain/errors/AppError";
import { IGameRepository } from "../../domain/ports/IRepositories";
import { IUseCaseOutputPort } from "../ports/IUseCaseOutputPort";

let cachedGames: Game[] | null = null;

/**
 * Загружает список игр, используя кэш в памяти.
 */
export async function loadGames(
  gameRepository: IGameRepository,
  outputPort: IUseCaseOutputPort<Game[]>,
  forceRefresh: boolean = false
): Promise<void> {
  try {
    if (cachedGames && !forceRefresh) {
      return outputPort.onSuccess(cachedGames);
    }

    const games = await gameRepository.getGames();
    cachedGames = games;
    outputPort.onSuccess(games);
  } catch (error: any) {
    outputPort.onFailure(new AppError(error.message || "Ошибка загрузки списка игр."));
  }
}