import {
  GameEngineFactory,
  GameEngine,
  GameEngineConfig,
} from "../../../../application/ports/GameEngineFactory";

async function create(config: GameEngineConfig): Promise<GameEngine> {
  // 500ms + 800ms + 3500ms = ~4.8s на весь цикл

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
}

export const mockGameEngineService: GameEngineFactory = {
  create,
};
