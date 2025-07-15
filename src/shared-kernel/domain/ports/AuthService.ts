import { User } from "../entities/User";

/**
 * Порт для сервиса, предоставляющего данные для аутентификации.
 */
export interface AuthService {
  getAuthData(): Promise<string>;
  getAuthenticatedUser(): Promise<User>;
}
