/**
 * Основная сущность пользователя в приложении.
 */
export type User = {
  username?: string;
  firstName?: string;
  score: number;
  tickets: number;
};

/**
 * Сырые данные, получаемые от платформы (Telegram).
 */
export type TelegramUser = {
  id: number | string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

/**
 * DTO (Data Transfer Object) для ответа от нашего API о счете.
 */
export type UserScoreDTO = {
  scores: number;
  coupons: number;
  scores_for_coupon: number;
};