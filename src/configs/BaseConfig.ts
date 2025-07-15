import { IDependencies } from "../core/ui/contexts/DependenciesContext";
import { AppConfig } from "./AppConfig";

export const baseConfig: AppConfig = {
  theme: "",
  widgetRegistry: undefined,
  routes: [
    {
      path: "/",
      label: "Главная",
      showInMenu: true,
      layout: {
        header: "HEADER_DEFAULT", // Эта страница имеет шапку
        footer: "FOOTER_DEFAULT", // и подвал
        widgets: ["GAME_LIST_MODERN"],
      },
    },
    {
      path: "/game/:id",
      label: "Игра",
      showInMenu: false,
      layout: {
        header: null, // А эта страница (полноэкранная игра) не имеет ни шапки,
        footer: null, // ни подвала
        widgets: ["GAME_RUNNER"],
      },
    },
  ],
  createDependencies: function (): IDependencies {
    throw new Error("Function not implemented.");
  },
};
