import { useContext } from "react";
import { DependenciesContext } from "../../../core/ui/contexts/DependenciesContext";
import { Logger } from "../../application/ports/Logger";

/**
 * Предоставляет экземпляр логгера из DI-контейнера.
 */
export const useLogger = (): Logger => {
  const { logger } = useContext(DependenciesContext);

  if (!logger) {
    // Эта ошибка никогда не должна произойти в работающем приложении, но всё же...
    throw new Error(
      "Logger не найден в DependenciesContext. Убедитесь, что он предоставлен в конфиге."
    );
  }

  return logger;
};
