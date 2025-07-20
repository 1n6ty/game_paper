import { Container } from "inversify";
import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { sharedIdentifiers } from "@/app/shared-kernel/sharedKernelDeps";
import { GameEngineFactory } from "./application/ports/GameEngineFactory";
import { GameRepository } from "./domain/ports/GameRepository";
import { createGameRepository } from "./infrastructure/repos/game";
import { createGameEngineFactory } from "./infrastructure/services/game-engine/factory";

export const gameFeatureIdentifiers = {
  GameRepository: Symbol.for("GameRepository"),
  GameEngineFactory: Symbol.for("GameEngineFactory"),
};

export const registerGameFeature = (container: Container) => {
  container
    .bind<GameRepository>(gameFeatureIdentifiers.GameRepository)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(sharedIdentifiers.Logger);
      const httpClient = context.get<HttpClient>(sharedIdentifiers.HttpClient);

      return createGameRepository({ logger, httpClient });
    });

  container
    .bind<GameEngineFactory>(gameFeatureIdentifiers.GameEngineFactory)
    .toDynamicValue((context) => {
      const logger = context.get<Logger>(sharedIdentifiers.Logger);
      const httpClient = context.get<HttpClient>(sharedIdentifiers.HttpClient);

      return createGameEngineFactory({ logger, httpClient });
    });
};
