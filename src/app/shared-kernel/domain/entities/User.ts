/**
 * Основная сущность пользователя в приложении.
 */
export interface User {
  username?: string;
  firstName?: string;
  lastName?: string;
}

export const getFullName = (user: User) => {
  return `${user.firstName} ${user.lastName}`;
};
