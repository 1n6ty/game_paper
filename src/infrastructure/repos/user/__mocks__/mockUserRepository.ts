import { IUserRepository } from "../../../../domain/ports/IRepositories";
import mockScore from "./mockScore";

const mockUserRepository: IUserRepository = {
  getScore: async (authData: string) => {
    console.log("MOCK: [UserRepository] getScore called");
    await new Promise(res => setTimeout(res, 250));
    return mockScore;
  },
};

export default mockUserRepository;