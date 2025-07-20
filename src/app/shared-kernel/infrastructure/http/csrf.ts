/**
 * Получает CSRF-токен из глобального объекта window.
 * Это единственное место в приложении, которое знает, как получить токен.
 */
export const getCsrfToken = (): string | null => {
  // Предполагаем, что токен устанавливается в window.CSRF_TOKEN
  // серверным шаблонизатором (в нашем случае Django).
  const token = (window as Window).CSRF_TOKEN;

  if (!token) {
    console.warn("[WARN] CSRF-токен не найден в window.CSRF_TOKEN");
  }

  return token || null;
};
