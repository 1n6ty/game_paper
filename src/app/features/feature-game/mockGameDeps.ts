import { Container } from "inversify";
import { GameEngineFactory } from "./application/ports/GameEngineFactory";
import { GameRepository } from "./domain/ports/GameRepository";
import { gameFeatureIdentifiers } from "./gameDeps";
import { mockGameRepository } from "./infrastructure/repos/game/__mocks__/mockGameRepository";
import { mockGameEngineFactory } from "./infrastructure/services/game-engine/factory/__mocks__/mockGameEngineFactory";

export const registerMockGameFeature = (container: Container) => {
  container
    .bind<GameRepository>(gameFeatureIdentifiers.GameRepository)
    .toConstantValue(mockGameRepository);

  container
    .bind<GameEngineFactory>(gameFeatureIdentifiers.GameEngineFactory)
    .toConstantValue(mockGameEngineFactory);
};
