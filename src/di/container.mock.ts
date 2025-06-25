import { Dependencies } from "../ui/contexts/DependenciesContext";
import mockUserRepository from "../infrastructure/repos/user/__mocks__/mockUserRepository";
import mockGameRepository from "../infrastructure/repos/game/__mocks__/mockGameRepository";
import mockDataMatrixRepository from "../infrastructure/repos/dataMatrix/__mocks__/mockDataMatrixRepository";
import mockAuthService from "../infrastructure/services/auth/__mocks__/mockAuthService";
import mockGameEngineService from "../infrastructure/services/gameEngine/__mocks__/mockGameEngineService";

export const container: Dependencies = {
  userRepository: mockUserRepository,
  gameRepository: mockGameRepository,
  dataMatrixRepository: mockDataMatrixRepository,
  authService: mockAuthService,
  gameEngineService: mockGameEngineService,
};