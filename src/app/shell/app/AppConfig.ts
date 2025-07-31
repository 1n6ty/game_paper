import { Container } from "inversify";
import { Theme } from "@/app/themes/Theme";
import { Spacing } from "@/app/themes/types/Spacing";
import { WidgetRegistry } from "@/app/widgets/widgetRegistry";

type WidgetKey = keyof WidgetRegistry;

export interface PageLayout {
  header: WidgetKey | null;
  footer: WidgetKey | null;

  widgets: WidgetKey[];

  gap?: keyof Spacing;
  padding?: {
    x: keyof Spacing;
    y: keyof Spacing;
  };
}

export interface RouteConfig {
  path: string;
  layout: PageLayout;
  label: string;
  showInMenu: boolean;
  exact?: boolean;
}

/**
 * Интерфейс для конфига сборки.
 * Описывает "чертеж", по которому фабрика createApp собирает приложение.
 */
export interface AppConfig {
  theme: Theme;
  widgetRegistry: WidgetRegistry;
  routes: RouteConfig[];
  bottomNav?: WidgetKey | null;

  createDIContainer: () => Container;
  localeOverrides?: Record<string, any>;
}
