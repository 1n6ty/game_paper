import type { Game } from "../entities/Game";

/**
 * Порт для взаимодействия с данными игр.
 */
export interface GameRepository {
  getGames(): Promise<Game[]>;
}
