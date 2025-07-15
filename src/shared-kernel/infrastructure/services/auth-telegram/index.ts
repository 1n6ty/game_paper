import { AuthService } from "../../../domain/ports/AuthService";
import { mapTelegramUserToUser } from "./mapper";
import { TelegramUser } from "./types";

let cachedAuthData: string | null = null;
let cachedTelegramUser: TelegramUser | null = null;
let isInitialized = false;

/**
 * Инициализирует и кэширует данные из Telegram WebApp.
 */
function initialize() {
  if (isInitialized) return;
  const tg = (window as Window).Telegram?.WebApp;

  if (tg) {
    cachedAuthData = tg.initData || null;
    cachedTelegramUser = tg.initDataUnsafe?.user || null;
  }

  isInitialized = true;
}

export const telegramAuthService: AuthService = {
  getAuthData: async () => {
    initialize();
    if (cachedAuthData) {
      return cachedAuthData;
    }

    throw new Error("Telegram auth data is not available.");
  },
  getAuthenticatedUser: async () => {
    initialize();
    if (cachedTelegramUser) {
      return mapTelegramUserToUser(cachedTelegramUser);
    }

    throw new Error("Telegram user data is not available.");
  },
};
