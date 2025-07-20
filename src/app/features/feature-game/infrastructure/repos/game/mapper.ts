import { Game } from "@/app/features/feature-game/domain/entities/Game";
import { GameLinksResponse } from "./types";

/**
 * Преобразует DTO со списком игр в массив доменных сущностей Game.
 */
export const mapGameLinksResponseToGames = (
  response: GameLinksResponse
): Game[] => {
  return Object.entries(response).map(([name, links]) => ({
    name: name,
    coverUrl: "/media/" + links.cover_url,
    drawScriptUrl: "/media/" + links.draw_url,
  }));
};
