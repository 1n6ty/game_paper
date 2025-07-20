import { GameEngineConfig } from "@/app/features/feature-game/application/ports/GameEngineFactory";
import { GameEngine } from "@/app/features/feature-game/domain/entities/GameEngine";

export const createMockGameEngine = (config: GameEngineConfig): GameEngine => {
  const { onFinish, onAssetsLoaded, onModuleLoad } = config;

  setTimeout(() => {
    onModuleLoad();
  }, 500);

  const start = async () => {
    setTimeout(() => {
      onAssetsLoaded();
    }, 800);

    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 5000) + 100;

      onFinish(mockScore);
    }, 3500);
  };

  return {
    start,
    finish: async () => {},
  };
};
