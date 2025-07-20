import type { Game } from "@/app/features/feature-game/domain/entities/Game";

/**
 * Порт для взаимодействия с данными игр.
 */
export interface GameRepository {
  getGames(): Promise<Game[]>;
}
