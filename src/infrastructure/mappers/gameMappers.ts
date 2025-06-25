import { Game, GameLinksDTO } from "../../domain/entities/game";

/**
 * Преобразует DTO со списком игр в массив доменных сущностей Game.
 */
export function mapGameLinksDTOToGames(dto: GameLinksDTO): Game[] {
  return Object.entries(dto).map(([name, links]) => ({
    name: name,
    coverUrl: "/media/" + links.cover_url,
    drawScriptUrl: "/media/" + links.draw_url,
  }));
}