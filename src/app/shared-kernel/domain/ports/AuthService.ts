import { User } from "@/app/shared-kernel/domain/entities/User";

/**
 * Порт для сервиса, предоставляющего данные для аутентификации.
 */
export interface AuthService {
  getAuthData(): Promise<string>;
  getAuthenticatedUser(): Promise<User>;
}
