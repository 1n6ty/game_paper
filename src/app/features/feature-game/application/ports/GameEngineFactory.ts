import { GameEngine } from "@/app/features/feature-game/domain/entities/GameEngine";

/**
 * Конфигурация для создания экземпляра игрового движка.
 */
export interface GameEngineConfig {
  canvas: HTMLElement; // По идее, является частью инфраструктуры, но и является частью Application. Поэтому оставляем здесь.
  authRawData: string;
  gameName: string;
  drawScriptUrl: string;
  onFinish: (score: number) => void;
  onAssetsLoaded: () => void;
  onModuleLoad: () => void;
}

/**
 * Порт для сервиса, управляющего жизненным циклом игры (Фабрика).
 */
export interface GameEngineFactory {
  create(config: GameEngineConfig): Promise<GameEngine>;
}
