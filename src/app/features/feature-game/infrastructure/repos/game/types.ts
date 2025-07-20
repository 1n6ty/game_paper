/**
 * DTO для ответа от API со списком игр.
 */
export interface GameLinksResponse {
  [gameName: string]: {
    draw_url: string;
    cover_url: string;
  };
}
