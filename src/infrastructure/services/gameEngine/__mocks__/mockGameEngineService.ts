import IGameEngineService, {
  IGameEngine,
  GameEngineConfig,
} from "../../../../application/ports/IGameEngineService";

/**
 * Моковая фабрика, создающая предсказуемый игровой движок для тестов.
 */
function create(config: GameEngineConfig): IGameEngine {
  // 500ms + 800ms + 3500ms = ~4.8s на весь цикл 

  const { onFinish, onAssetsLoaded, onModuleLoad } = config;

  console.log(`MOCK: [GameEngine] Создан для игры "${config.gameName}"`);

  setTimeout(() => {
    console.log("MOCK: [GameEngine] Модуль игры 'загружен'.");
    onModuleLoad();
  }, 500);

  /**
   * Моковый метод старта игры.
   */
  const start = () => {
    console.log("MOCK: [GameEngine] Вызван start(). Начало 'игры'.");

    setTimeout(() => {
      console.log("MOCK: [GameEngine] Игровые ассеты 'загружены'.");
      onAssetsLoaded();
    }, 800);

    // Имитируем игровой процесс, который завершается через несколько секунд
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 5000) + 100;
      console.log(`MOCK: [GameEngine] Игра 'завершена' со счетом ${mockScore}.`);
      onFinish(mockScore);
    }, 3500); 
    
  };

  return {
    start,
  };
}

const mockGameEngineService: IGameEngineService = {
  create,
};

export default mockGameEngineService;