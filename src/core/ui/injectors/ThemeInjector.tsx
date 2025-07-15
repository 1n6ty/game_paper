import { useLayoutEffect } from "react";
import { Theme } from "../../../themes/Theme";

// Рекурсивная функция для преобразования вложенного объекта темы
// в плоский список CSS-переменных.
// Например, { color: { primary: '#000' } } -> { 'color-primary': '#000' }
function flattenTheme(
  obj: Record<string, any>,
  prefix = ""
): Record<string, string> {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "-" : "";

    if (typeof obj[k] === "object" && obj[k] !== null) {
      Object.assign(acc, flattenTheme(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }

    return acc;
  }, {} as Record<string, string>);
}

interface IThemeInjectorProps {
  theme: Theme;
}

/**
 * Компонент-эффект, который "внедряет" дизайн-токены из объекта темы
 * в CSS Custom Properties на корневом элементе документа.
 */
export const ThemeInjector = ({ theme }: IThemeInjectorProps) => {
  useLayoutEffect(() => {
    const flatTheme = flattenTheme(theme);
    const root = document.documentElement;

    for (const key in flatTheme) {
      root.style.setProperty(`--${key}`, flatTheme[key]);
    }
  }, [theme]); // Эффект перезапускается только при смене объекта темы

  return null; // Ничего не рендерит
};
