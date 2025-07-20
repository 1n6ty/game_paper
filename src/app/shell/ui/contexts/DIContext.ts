import { createContext, useContext } from "react";
import { Container } from "inversify";

export const DIContext = createContext<Container | null>(null);

/**
 * Кастомный хук для удобного доступа к DI-контейнеру из любого
 * UI-компонента или другого хука.
 */
export const useDIContainer = (): Container => {
  const container = useContext(DIContext);

  if (!container) {
    // Эта ошибка говорит о том, что была допущена ошибка на уровне сборки приложения.
    throw new Error(
      "DIContainer не был предоставлен. Убедитесь, что приложение обернуто в DIContext.Provider."
    );
  }

  return container;
};
