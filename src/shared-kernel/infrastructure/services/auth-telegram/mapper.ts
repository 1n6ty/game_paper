import { User } from "../../../domain/entities/User";
import { TelegramUser } from "./types";

/**
 * Преобразует специфичный для Telegram объект пользователя в
 * универсальный платформо-независимый объект.
 */
export function mapTelegramUserToUser(tgUser: TelegramUser): User {
  return {
    username: tgUser.username,
    firstName: tgUser.first_name,
    lastName: tgUser.last_name,
  };
}
