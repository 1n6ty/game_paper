import { Container } from "inversify";
import { GameEngineFactory } from "./application/ports/GameEngineFactory";
import { GameRepository } from "./domain/ports/GameRepository";

export const gameFeatureIdentifiers = {
  GameRepository: Symbol.for("GameRepository"),
  GameEngineFactory: Symbol.for("GameEngineFactory"),
};

export interface GameFeatureImplementations {
  gameRepository: GameRepository;
  gameEngineFactory: GameEngineFactory;
}

export const registerGameFeature = (
  container: Container,
  impls: GameFeatureImplementations
) => {
  container
    .bind<GameRepository>(gameFeatureIdentifiers.GameRepository)
    .toConstantValue(impls.gameRepository);
  container
    .bind<GameEngineFactory>(gameFeatureIdentifiers.GameEngineFactory)
    .toConstantValue(impls.gameEngineFactory);
};
