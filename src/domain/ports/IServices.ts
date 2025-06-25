import { TelegramUser } from "../entities/user";

/**
 * Порт для сервиса, предоставляющего данные для аутентификации.
 */
export interface IAuthService {
  getAuthData(): Promise<string>;
  getPlatformUser(): Promise<TelegramUser | null>;
}