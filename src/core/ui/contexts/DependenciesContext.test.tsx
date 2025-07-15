import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { DependenciesContext, IDependencies } from "./DependenciesContext";
import { noopLogger } from "../../../shared-kernel/domain/ports/__mocks__/noopLogger";

// Моковые зависимости для теста
const mockDependencies: IDependencies = {
  logger: noopLogger,
  // ... другие моковые зависимости
} as IDependencies;

// Тестовый компонент, который использует контекст
const TestConsumer = () => {
  const { logger } = useContext(DependenciesContext);
  // Используем логгер, чтобы проверить, что он был получен
  const scope = logger.createScope("Test");

  return <div>{scope ? "Logger provided" : "Logger not provided"}</div>;
};

describe("DependenciesContext", () => {
  it("должен предоставлять зависимости дочерним компонентам", () => {
    // ARRANGE & ACT
    render(
      <DependenciesContext.Provider value={mockDependencies}>
        <TestConsumer />
      </DependenciesContext.Provider>
    );

    // ASSERT
    // Проверяем, что компонент получил зависимость и отрендерил ожидаемый текст
    expect(screen.getByText("Logger provided")).toBeInTheDocument();
  });
});
