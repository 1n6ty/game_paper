/**
 * Экземпляр запущенной игры.
 */
export interface GameEngine {
  start(): Promise<void>;
  finish(): Promise<void>;
}
