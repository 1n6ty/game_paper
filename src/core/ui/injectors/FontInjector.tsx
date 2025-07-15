import React, { useLayoutEffect } from "react";
import { ITheme } from "../../../themes/Theme";

interface IFontInjectorProps {
  theme: ITheme;
}

/**
 * Компонент-эффект, который динамически подключает шрифты,
 * указанные в объекте темы.
 */
export const FontInjector = ({ theme }: IFontInjectorProps) => {
  useLayoutEffect(() => {
    const fontUrl = theme.typography.fontUrl;

    if (!fontUrl) return;

    // Чтобы избежать дублирования, проверяем, не был ли уже добавлен этот шрифт
    const existingLink = document.head.querySelector(`link[href="${fontUrl}"]`);

    if (existingLink) return;

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);

    // Очистка при размонтировании (хотя в SPA это редко нужно)
    return () => {
      document.head.removeChild(link);
    };
  }, [theme.typography.fontUrl]); // Эффект зависит только от URL шрифта

  return null;
};
