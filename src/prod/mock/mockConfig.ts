import { AppConfig } from "@/app/shell/app/AppConfig";
import { widgetRegistry } from "@/app/widgets/widgetRegistry";
import { baseTheme } from "@/prod/base/baseTheme";
import mockOverrides from "./locales/ru.override.json";
import { createMockDIContainer } from "./mockDeps";

export const mockConfig: AppConfig = {
  theme: baseTheme,
  widgetRegistry: widgetRegistry,
  routes: [
    {
      path: "/",
      label: "Главная",
      showInMenu: true,
      layout: {
        gap: "m",
        padding: {
          x: "m",
          y: "m",
        },
        header: "PROFILE", // Эта страница имеет шапку
        footer: "FOOTER_DEFAULT", // и подвал
        widgets: [
          "SCORE_BAR",
          "SCANNABLE_PRODUCTS_CARD",
          "PRIZE_DRAW_CARD",
          "CARD_TIP",
        ],
      },
    },
    {
      path: "/games/",
      label: "Игра",
      showInMenu: true,
      layout: {
        gap: "m",
        padding: {
          x: "m",
          y: "m",
        },
        header: "PROFILE",
        footer: "FOOTER_DEFAULT",
        widgets: ["SCORE_BAR", "GAME_PROMO", "GAMES_LIST"],
      },
    },
  ],
  bottomNav: "BOTTOM_NAV",
  createDIContainer: createMockDIContainer,
  localeOverrides: mockOverrides,
};
