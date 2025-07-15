/**
 * Описывает структуру объекта темы, содержащего дизайн-токены.
 */
export interface Theme {
  color: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  radii: {
    small: string;
    medium: string;
    large: string;
  };
  typography: {
    fontFamily: string; // Основной шрифт приложения
    fontUrl?: string; // URL для импорта шрифта, если он нужен
  };
  // Можно добавить другие секции, например, typography, shadows, z-index...
}
