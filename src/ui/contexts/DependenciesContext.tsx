import { createContext, useContext, ReactNode } from "react";
import { IUserRepository, IGameRepository, IDataMatrixRepository } from "../../domain/ports/IRepositories";
import { IAuthService } from "../../domain/ports/IServices";
import IGameEngineService from "../../application/ports/IGameEngineService";

/**
 * Единый интерфейс, описывающий все зависимости в приложении.
 */
export interface Dependencies {
  userRepository: IUserRepository;
  gameRepository: IGameRepository;
  dataMatrixRepository: IDataMatrixRepository;
  authService: IAuthService;
  gameEngineService: IGameEngineService;
}

const DependenciesContext = createContext<Dependencies | null>(null);

/**
 * Хук для удобного доступа к зависимостям.
 */
export function useDeps(): Dependencies {
  const ctx = useContext(DependenciesContext);
  if (!ctx) throw new Error("useDeps must be used within a DependenciesProvider");
  return ctx;
}

/**
 * Провайдер, который делает зависимости доступными для всего приложения.
 */
export function DependenciesProvider({ value, children }: { value: Dependencies; children: ReactNode }) {
  return (
    <DependenciesContext.Provider value={value}>
      {children}
    </DependenciesContext.Provider>
  );
}