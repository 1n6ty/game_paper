import React from "react";
import { IDependencies } from "../core/ui/contexts/DependenciesContext";
import { Theme } from "../themes/Theme";

export interface PageLayout {
  // Указываем ключи компонентов из реестра для шапки и подвала.
  // Они могут быть null, если шапка/подвал не нужны.
  header: string | null;
  footer: string | null;

  // Основной контент страницы
  widgets: string[];
}

// Описывает конфигурацию для одного маршрута
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
  widgetRegistry: Record<string, React.ComponentType>;
  routes: RouteConfig[];
  createDependencies: () => IDependencies;
}
