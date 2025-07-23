import React from "react";
import { useTranslation } from "react-i18next";
import MilkGlassSvg from "./assets/MilkGlass.svg?react";
import RewardItem1Svg from "./assets/RewardItem1.svg?react";
import RewardItem2Svg from "./assets/RewardItem2.svg?react";
import RewardItem3Svg from "./assets/RewardItem3.svg?react";
import { ScannableProductsCardView } from "./view/ScannableProductsCard.view";

// Моковые данные, которые в будущем придут с сервера
const MOCK_REWARDS = [
  { id: 1, count: 10, LargeIcon: RewardItem1Svg, SmallIcon: MilkGlassSvg },
  { id: 2, count: 20, LargeIcon: RewardItem2Svg, SmallIcon: MilkGlassSvg },
  { id: 3, count: 30, LargeIcon: RewardItem3Svg, SmallIcon: MilkGlassSvg },
];

export const ScannableProductsCard = () => {
  const { t } = useTranslation();

  // В будущем здесь будет хук для получения списка наград
  const rewards = MOCK_REWARDS;

  return (
    <ScannableProductsCardView
      title={t("widgets.scannableProductsCard.title")}
      rewards={rewards}
    />
  );
};
