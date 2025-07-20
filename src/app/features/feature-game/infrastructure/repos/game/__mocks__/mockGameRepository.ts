import { GameRepository } from "@/app/features/feature-game/domain/ports/GameRepository";
import { mapGameLinksResponseToGames } from "@/app/features/feature-game/infrastructure/repos/game/mapper";
import { mockGameLinks } from "./mockGameLinks";

export const mockGameRepository: GameRepository = {
  getGames: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mockGames = mapGameLinksResponseToGames(mockGameLinks);

    return mockGames;
  },
};
