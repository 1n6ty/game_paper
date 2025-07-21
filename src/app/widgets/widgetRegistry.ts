import { BrandAndUserView } from "@/app/features/feature-score/ui/widgets/brand-and-user/BrandAndUser.view";
import { CardReward } from "./CardReward/CardReward";
import { DefaultBottomNavBar } from "./default/DefaultBottomNavBar/DefaultBottomNavBar";
import { DefaultFooter } from "./default/DefaultFooter/DefaultFooter";
import { DefaultHeader } from "./default/DefaultHeader/DefaultHeader";
import { SomeWidget } from "./default/SomeWidget/SomeWidget";
import { ScoreBar } from "./ScoreBar/ScoreBar";
import { UserCard } from "./UserCard/UserCard";

/**
 * Регистр всех доступных компонентов для сборки приложения.
 */
export const widgetRegistry = {
  // Виджеты контента
  // GAME_LIST_MODERN: GameListModern,
  // ...

  SOME_WIDGET: SomeWidget,

  // shared
  USER_CARD: UserCard,
  SCORE_BAR: ScoreBar,
  CARD_REWARD: CardReward,

  // Виджеты каркаса
  HEADER_DEFAULT: DefaultHeader,
  FOOTER_DEFAULT: DefaultFooter,

  BRAND_AND_USER: BrandAndUserView,

  BOTTOM_NAV_DEFAULT: DefaultBottomNavBar,
};

export type WidgetRegistry = typeof widgetRegistry;
