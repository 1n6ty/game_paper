import { useLayoutEffect } from "react";
import { Theme } from "@/app/themes/Theme";

const toKebab = (str: string): string =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // вставляем дефис перед заглавными
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // обрабатываем последовательности заглавных
    .toLowerCase();

// Рекурсивная функция для преобразования вложенного объекта темы
// в плоский список CSS-переменных.
// Например, { color: { primary: '#000' } } -> { 'color-primary': '#000' }
const flattenTheme = <T extends object>(
  obj: T,
  prefix = ""
): Record<string, string> => {
  return Object.keys(obj).reduce((acc, k) => {
    const kebabKey = toKebab(k);
    // если у нас уже есть префикс, добавляем между ними дефис
    const newPrefix = prefix ? `${prefix}-${kebabKey}` : kebabKey;
    const value = obj[k];

    if (value !== null && typeof value === "object") {
      Object.assign(
        acc,
        flattenTheme(value as Record<string, unknown>, newPrefix)
      );
    } else {
      acc[newPrefix] = String(value);
    }

    return acc;
  }, {} as Record<string, string>);
};

interface ThemeInjectorProps {
  theme: Theme;
}

/**
 * Компонент-эффект, который "внедряет" дизайн-токены из объекта темы
 * в CSS Custom Properties на корневом элементе документа.
 */
export const ThemeInjector = ({ theme }: ThemeInjectorProps) => {
  useLayoutEffect(() => {
    const flatTheme = flattenTheme(theme);
    const root = document.documentElement;

    for (const key in flatTheme) {
      root.style.setProperty(`--${key}`, flatTheme[key]);
    }
  }, [theme]);

  return null; // Ничего не рендерит
};
