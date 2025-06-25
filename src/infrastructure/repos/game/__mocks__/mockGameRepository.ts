import { IGameRepository } from "../../../../domain/ports/IRepositories";
import mockGames from "./mockGames";

const mockGameRepository: IGameRepository = {
  getGames: async () => {
    console.log("MOCK: [GameRepository] getGames called");
    await new Promise(res => setTimeout(res, 300));
    return mockGames;
  },
};

export default mockGameRepository;