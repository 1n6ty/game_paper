import { GameEngineFactory } from "@/app/features/feature-game/application/ports/GameEngineFactory";
import { createMockGameEngine } from "@/app/features/feature-game/infrastructure/services/game-engine/__mocks__/createMockGameEngine";

export const mockGameEngineFactory: GameEngineFactory = {
  create: async (config) => createMockGameEngine(config),
};
