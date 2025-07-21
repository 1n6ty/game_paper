export interface GameInitResponse {
  init: unknown;
}

export interface GameFinishResponse {
  score: number;
}

export interface GameEngineApiEndpoints {
  gameInit: string;
  gameFinish: string;
}
