import { GameInitResponse } from "@/app/features/feature-game/infrastructure/services/game-engine/types";

export type TmpState = unknown;

export interface GameModule {
  init: (
    canvas: HTMLElement,
    gameInitData: GameInitResponse,
    tmpState: TmpState,
    finishGameCallback: (gameData: unknown) => Promise<void>,
    onAssetsLoaded: () => void
  ) => TmpState;
  deinit: (canvas: HTMLElement, tmpState: TmpState) => void;
}
