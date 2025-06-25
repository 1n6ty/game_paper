/**
 * Конфигурация для создания экземпляра игрового движка.
 */
export type GameEngineConfig = {
  canvas: HTMLElement;
  authRawData: string;
  gameName: string;
  drawScriptUrl: string;
  onFinish: (score: number) => void;
  onAssetsLoaded: () => void;
  onModuleLoad: () => void;
};

/**
 * Интерфейс, описывающий экземпляр запущенной игры.
 */
export interface IGameEngine {
  start(): void;
}

/**
 * Порт для сервиса, управляющего жизненным циклом игры (Фабрика).
 * Находится в application, так как это специфичный для приложения сценарий.
 */
export default interface IGameEngineService {
  create(config: GameEngineConfig): IGameEngine;
}