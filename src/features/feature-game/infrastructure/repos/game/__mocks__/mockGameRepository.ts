import { GameRepository } from "../../../../domain/ports/GameRepository";
import { mapGameLinksResponseToGames } from "../mapper";
import { mockGameLinks } from "./mockGameLinks";

export const mockGameRepository: GameRepository = {
  getGames: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mockGames = mapGameLinksResponseToGames(mockGameLinks);

    return mockGames;
  },
};
