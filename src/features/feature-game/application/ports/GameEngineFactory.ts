/**
 * Конфигурация для создания экземпляра игрового движка.
 */
export interface GameEngineConfig {
  canvas: HTMLElement;
  authRawData: string;
  gameName: string;
  drawScriptUrl: string;
  onFinish: (score: number) => void;
  onAssetsLoaded: () => void;
  onModuleLoad: () => void;
}

/**
 * Интерфейс, описывающий экземпляр запущенной игры.
 */
export interface GameEngine {
  start(): Promise<void>;
  finish(): Promise<void>;
}

/**
 * Порт для сервиса, управляющего жизненным циклом игры (Фабрика).
 */
export interface GameEngineFactory {
  create(config: GameEngineConfig): Promise<GameEngine>;
}
