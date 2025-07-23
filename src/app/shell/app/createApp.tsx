import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DIContext } from "@/app/shell/ui/contexts/DIContext";
import { NavigationContext } from "@/app/shell/ui/contexts/NavigationContext";
import { FontInjector } from "@/app/shell/ui/injectors/FontInjector";
import { ThemeInjector } from "@/app/shell/ui/injectors/ThemeInjector";
import { MainLayout } from "@/app/shell/ui/MainLayout/MainLayout";
import { AppConfig } from "./AppConfig";
import { DynamicPageRenderer } from "./DynamicPageRenderer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Здесь можно задать глобальные настройки для всех запросов
      // staleTime: 5 * 60 * 1000, // 5 минут
      // refetchOnWindowFocus: false, // Отключаем по умолчанию для мобильных приложений
    },
  },
});

export const createApp = (config: AppConfig) => {
  return () => {
    const { theme, routes, bottomNav, widgetRegistry, createDIContainer } =
      config;

    const diContainer = useMemo(() => createDIContainer(), [createDIContainer]);

    const navItems = routes
      .filter((route) => route.showInMenu)
      .map(({ path, label }) => ({ path, label }));

    const BottomNavComponent = bottomNav ? widgetRegistry[bottomNav] : null;

    return (
      <>
        <ThemeInjector theme={theme} />
        <FontInjector theme={theme} />

        <QueryClientProvider client={queryClient}>
          <DIContext.Provider value={diContainer}>
            <NavigationContext.Provider value={navItems}>
              <BrowserRouter>
                <MainLayout>
                  <Routes>
                    {routes.map(({ path, layout }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <DynamicPageRenderer
                            theme={theme}
                            layout={layout}
                            registry={widgetRegistry}
                          />
                        }
                      />
                    ))}
                  </Routes>
                </MainLayout>

                {BottomNavComponent && <BottomNavComponent />}
              </BrowserRouter>
            </NavigationContext.Provider>
          </DIContext.Provider>
        </QueryClientProvider>
      </>
    );
  };
};
