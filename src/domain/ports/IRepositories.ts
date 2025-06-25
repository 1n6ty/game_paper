import { UserScoreDTO } from "../entities/user";
import { Game } from "../entities/game";
import { DataMatrixScanResult } from "../entities/dataMatrix";

/**
 * Порт для взаимодействия с данными пользователя.
 */
export interface IUserRepository {
  getScore(authData: string): Promise<UserScoreDTO>;
}

/**
 * Порт для взаимодействия с данными игр.
 */
export interface IGameRepository {
  getGames(): Promise<Game[]>;
}

/**
 * Порт для взаимодействия с данными DataMatrix.
 */
export interface IDataMatrixRepository {
  scan(text: string, authData: string): Promise<DataMatrixScanResult>;
}