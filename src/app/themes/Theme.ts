import { Color } from "./types/Color";
import { Radius } from "./types/Radius";
import { Spacing } from "./types/Spacing";
import { Typography } from "./types/Typography";

/**
 * Описывает структуру объекта темы, содержащего дизайн-токены.
 */
export interface Theme {
  color: Color;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
}
