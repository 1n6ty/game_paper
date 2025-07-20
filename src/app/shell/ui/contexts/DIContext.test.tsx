import { render, screen } from "@testing-library/react";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { createMockDIContainer } from "@/prod/mock/mockDeps";
import { DIContext, useDIContainer } from "./DIContext";

const TestConsumer = () => {
  const container = useDIContainer();
  const logger: Logger = {
    info: (
      functionName: string,
      message: string,
      ...payload: unknown[]
    ): void => {},
    warn: (
      functionName: string,
      message: string,
      ...payload: unknown[]
    ): void => {},
    error: (
      functionName: string,
      message: string,
      error?: Error,
      ...payload: unknown[]
    ): void => {},
    createScope: (scope: string): Logger => {
      return logger;
    },
  };
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
