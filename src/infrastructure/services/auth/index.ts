import { TelegramUser } from "../../../domain/entities/user";
import { IAuthService } from "../../../domain/ports/IServices";

let cachedAuthData: string | null = null;
let cachedPlatformUser: TelegramUser | null = null;
let isInitialized = false;

/**
 * Инициализирует и кэширует данные из Telegram WebApp.
 */
function initialize() {
  if (isInitialized) return;
  const tg = (window as any).Telegram?.WebApp;
  if (tg) {
    cachedAuthData = tg.initData || null;
    cachedPlatformUser = tg.initDataUnsafe?.user || null;
  }
  isInitialized = true;
}

const telegramAuthService: IAuthService = {
  getAuthData: async () => {
    initialize();
    if (cachedAuthData) return cachedAuthData;
    throw new Error("Telegram auth data not available.");
  },
  getPlatformUser: async () => {
    initialize();
    return cachedPlatformUser;
  },
};

export default telegramAuthService;