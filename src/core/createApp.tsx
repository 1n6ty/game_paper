import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IAppConfig } from "../configs/AppConfig";
import {
  DependenciesContext,
  IDependencies,
} from "./ui/contexts/DependenciesContext";
import { MainLayout } from "./ui/MainLayout";
import { DynamicPageRenderer } from "./ui/DynamicPageRenderer";
import { ThemeInjector } from "./ui/injectors/ThemeInjector";
import GlobalStyle from "../shared-kernel/ui/styles/global.css"; // Предположим, что это компонент
import { NavigationContext } from "./ui/contexts/NavigationContext";

/**
 * "Генподрядчик": фабрика, которая строит React-приложение по "чертежу" (конфигу).
 */
export function createApp(config: IAppConfig) {
  // Функция возвращает готовый React-компонент App
  return function App() {
    // 1. Извлекаем все "детали" из чертежа
    const { theme, routes, components, widgetRegistry, createDependencies } =
      config;

    // 2. СОЗДАЕМ ЗАВИСИМОСТИ: Вызываем фабрику из конфига.
    // Это происходит только один раз при монтировании компонента App.
    const dependencies: IDependencies = createDependencies();

    // 3. Готовим данные для навигации
    const navItems = routes
      .filter((route) => route.showInMenu)
      .map(({ path, label }) => ({ path, label }));

    // 4. СОБИРАЕМ ФИНАЛЬНОЕ ПРИЛОЖЕНИЕ
    return (
      <>
        {/* Внедряем CSS-переменные темы и глобальные стили */}
        <ThemeInjector theme={theme} />
        <GlobalStyle />

        {/* 4.1. ВНЕДРЯЕМ ЗАВИСИМОСТИ: Передаем собранный контейнер в провайдер.
             Все дочерние компоненты теперь могут получить к нему доступ через useContext. */}
        <DependenciesContext.Provider value={dependencies}>
          <NavigationContext.Provider value={navItems}>
            <BrowserRouter>
              <MainLayout
                HeaderComponent={components.Header}
                FooterComponent={components.Footer}
              >
                <Routes>
                  {routes.map(({ path, layout }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <DynamicPageRenderer
                          layout={layout}
                          registry={widgetRegistry}
                        />
                      }
                    />
                  ))}
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </NavigationContext.Provider>
        </DependenciesContext.Provider>
      </>
    );
  };
}
