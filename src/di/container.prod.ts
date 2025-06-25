import { Dependencies } from "../ui/contexts/DependenciesContext";
import userRepository from "../infrastructure/repos/user";
import gameRepository from "../infrastructure/repos/game";
import dataMatrixRepository from "../infrastructure/repos/dataMatrix";
import telegramAuthService from "../infrastructure/services/auth";
import gameEngineService from "../infrastructure/services/gameEngine";

export const container: Dependencies = {
  userRepository,
  gameRepository,
  dataMatrixRepository,
  authService: telegramAuthService,
  gameEngineService,
};