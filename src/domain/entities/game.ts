/**
 * Сущность игры.
 */
export type Game = {
  name: string;
  coverUrl: string;
  drawScriptUrl: string;
};

/**
 * DTO для ответа от API со списком игр.
 */
export type GameLinksDTO = {
  [gameName: string]: {
    draw_url: string;
    cover_url: string;
  };
};