import { GamePromoCard } from "@/app/features/feature-game/ui/widgets/GamePromoCard/GamePromoCard";
import { GamesList } from "@/app/features/feature-game/ui/widgets/GamesList/GamesList";
import { PrizeDrawCard } from "@/app/features/feature-score/ui/widgets/PrizeDrawCard/PrizeDrawCard";
import { ScannableProductsCard } from "@/app/features/feature-score/ui/widgets/ScannableProductsCard/ScannableProductsCard";
import { ScoreBar } from "@/app/features/feature-score/ui/widgets/ScoreBar/ScoreBar";
import { UserBadge } from "@/app/features/feature-score/ui/widgets/UserBadge/UserBadge";
import { CardTip } from "@/app/features/feature-tip/ui/widgets/CardTip/CardTip";
import { SplitLayout } from "@/app/shared-kernel/ui/components/headless/SplitLayout";
import { BottomNavBar } from "@/app/shell/ui/widgets/BottomNavBar/BottomNavBar";
import { EmblemCard } from "@/app/shell/ui/widgets/EmblemCard/EmblemCard";
import { DefaultBottomNavBar } from "./default/DefaultBottomNavBar/DefaultBottomNavBar";
import { DefaultFooter } from "./default/DefaultFooter/DefaultFooter";
import { DefaultHeader } from "./default/DefaultHeader/DefaultHeader";

/**
 * Регистр всех доступных компонентов для сборки приложения.
 */
export const widgetRegistry = {
  // Виджеты контента
  // GAME_LIST_MODERN: GameListModern,
  // ...

  // shared

  PRIZE_DRAW_CARD: PrizeDrawCard,
  GAME_PROMO: GamePromoCard,
  CARD_TIP: CardTip,
  SCANNABLE_PRODUCTS_CARD: ScannableProductsCard,
  GAMES_LIST: GamesList,
  SCORE_BAR: ScoreBar,
  PROFILE: () => (
    <SplitLayout style={{ gap: "15px" }}>
      <EmblemCard />
      <UserBadge />
    </SplitLayout>
  ),

  BOTTOM_NAV: BottomNavBar,

  // Виджеты каркаса
  HEADER_DEFAULT: DefaultHeader,
  FOOTER_DEFAULT: DefaultFooter,

  BOTTOM_NAV_DEFAULT: DefaultBottomNavBar,
};

export type WidgetRegistry = typeof widgetRegistry;
