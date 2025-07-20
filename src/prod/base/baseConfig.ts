import { AppConfig } from "@/app/shell/app/AppConfig";
import { widgetRegistry } from "@/app/widgets/widgetRegistry";
import { createBaseDIContainer } from "./baseDeps";
import { baseTheme } from "./baseTheme";

export const baseConfig: AppConfig = {
  theme: baseTheme,
  widgetRegistry: widgetRegistry,
  routes: [
    {
      path: "/",
      label: "Главная",
      showInMenu: true,
      layout: {
        header: "HEADER_DEFAULT", // Эта страница имеет шапку
        footer: "FOOTER_DEFAULT", // и подвал
        widgets: ["BOTTOM_NAV_DEFAULT", ["BOTTOM_NAV_DEFAULT"]],
      },
    },
    {
      path: "/games/",
      label: "Игра",
      showInMenu: false,
      layout: {
        header: null, // А эта страница (полноэкранная игра) не имеет ни шапки,
        footer: null, // ни подвала
        widgets: [],
      },
    },
  ],
  createDIContainer: createBaseDIContainer,
};
