import { Color } from "./types/Color";
import { Font } from "./types/Font";
import { Radius } from "./types/Radius";
import { Shadows } from "./types/Shadow";
import { Spacing } from "./types/Spacing";
import { Typography } from "./types/Typography";

/**
 * Описывает структуру объекта темы, содержащего дизайн-токены.
 */
export interface Theme {
  color: Color;
  spacing: Spacing;
  radius: Radius;
  shadows: Shadows;
  typography: Typography;
  font: Font;
}
