import { render, screen } from "@testing-library/react";
import { noopLogger } from "@/app/shared-kernel/infrastructure/services/logger-console/__mocks__/noopLogger";
import { createMockDIContainer } from "@/prod/mock/mockDeps";
import { DIContext } from "./DIContext";

const TestConsumer = () => {
  const logger = noopLogger;
  const scope = logger.createScope("Test");

  return <div>{scope ? "Logger provided" : "Logger not provided"}</div>;
};

describe("DIContext", () => {
  it("должен предоставлять зависимости дочерним компонентам", () => {
    render(
      <DIContext.Provider value={createMockDIContainer()}>
        <TestConsumer />
      </DIContext.Provider>
    );

    expect(screen.getByText("Logger provided")).toBeInTheDocument();
  });
});
