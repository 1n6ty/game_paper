import React from "react";
import { useTranslation } from "react-i18next";
import { useCouponPolicyQuery } from "@/app/features/feature-score/infrastructure/queries/useCouponPolicyQuery";
import { useUserWithRewardsQuery } from "@/app/features/feature-score/infrastructure/queries/useUserWithRewardsQuery";
import MilkGlassSvg from "./assets/MilkGlass.svg?react";
import { ScoreBarView } from "./view/ScoreBar.view";

export const ScoreBar = () => {
  const { t } = useTranslation();

  const { data: couponPolicy, isLoading: isPolicyLoading } =
    useCouponPolicyQuery();
  const { data: score, isLoading: isScoreLoading } = useUserWithRewardsQuery();

  if (!couponPolicy || !score || isPolicyLoading || isScoreLoading)
    return <div>Загрузка...</div>;

  console.log(couponPolicy.priceInScore);

  return (
    <ScoreBarView
      title={t("widgets.scoreBar.title")}
      currentScore={score?.score}
      totalScore={couponPolicy.priceInScore}
      IconComponent={MilkGlassSvg}
    />
  );
};
