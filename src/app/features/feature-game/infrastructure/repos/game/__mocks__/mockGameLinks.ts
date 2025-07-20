import { GameLinksResponse } from "@/app/features/feature-game/infrastructure/repos/game/types";

export const mockGameLinks: GameLinksResponse = {
  "Fruit Catcher": {
    cover_url: "/mock-covers/fruit.png",
    draw_url: "/mock-draw/fruit.js",
  },
  "Coin Runner": {
    cover_url: "/mock-covers/runner.png",
    draw_url: "/mock-draw/runner.js",
  },
};
