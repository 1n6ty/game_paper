export interface ShadowStyle {
  offsetX: string;
  offsetY: string;
  blurRadius: string;
  spreadRadius: string;
  color: string;
}

// В комментариях указаны примеры использования.
export interface Shadows {
  light?: ShadowStyle; // Для ховер-эффектов и мелких элементов
  medium: ShadowStyle; // Основная тень
  strong?: ShadowStyle; // Для модальных окон и всплывающих элементов
}
