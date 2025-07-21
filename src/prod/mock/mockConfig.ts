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
        gap: "small",
        header: "HEADER_DEFAULT", // Эта страница имеет шапку
        footer: "FOOTER_DEFAULT", // и подвал
        widgets: [
          "USER_CARD",
          "SCORE_BAR",
          "CARD_REWARD",
          "BRAND_AND_USER",
          "SOME_WIDGET",
          "SOME_WIDGET",
        ],
      },
    },
    {
      path: "/games/",
      label: "Игра",
      showInMenu: true,
      layout: {
        header: "HEADER_DEFAULT",
        footer: null,
        widgets: [],
      },
    },
  ],
  bottomNav: "BOTTOM_NAV_DEFAULT",
  createDIContainer: createMockDIContainer,
  localeOverrides: mockOverrides,
};
