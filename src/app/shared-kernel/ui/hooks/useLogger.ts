import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { sharedIdentifiers } from "@/app/shared-kernel/sharedKernelDeps";
import { useDIContainer } from "@/app/shell/ui/contexts/DIContext";

/**
 * Предоставляет экземпляр логгера из DI-контейнера.
 */
export const useLogger = (): Logger => {
  const logger = useDIContainer().get<Logger>(sharedIdentifiers.Logger);

  if (!logger) {
    // Эта ошибка никогда не должна произойти в работающем приложении, но всё же...
    throw new Error(
      "Logger не найден в DependenciesContext. Убедитесь, что он предоставлен в конфиге."
    );
  }

  return logger;
};
