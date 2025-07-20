import React from "react";
import { useCouponPolicyQuery } from "@/app/features/feature-user/infrastructure/queries/useCouponPolicyQuery";
import { useUserWithRewardsQuery } from "@/app/features/feature-user/infrastructure/queries/useUserWithRewardsQuery";
import { Card } from "@/app/shared-kernel/ui/components/Card/Card";
// import MilkGlassSvg from "@/assets/MilkGlass.svg?react";
import styles from "./ScoreBar.module.css";

export const ScoreBar = () => {
  const { data: user, isLoading: userIsLoading } = useUserWithRewardsQuery();
  const { data: policy, isLoading: policyIsLoading } = useCouponPolicyQuery();

  if (userIsLoading || !user || policyIsLoading || !policy) {
    return <div className={styles.skeleton}>Загрузка счета...</div>;
  }

  const { score } = user;
  const { priceInScore } = policy;
  const percentage = priceInScore > 0 ? (score / priceInScore) * 100 : 0;

  return (
    <Card.Root className={styles["score-bar"]}>
      {/* <MilkGlassSvg className={styles["score-bar__icon"]} /> */}
      <div className={styles["score-bar__info"]}>
        <div className={styles["score-bar__row"]}>
          <span className={styles["score-bar__title"]}>Ламбиксы</span>
          <span className={styles["score-bar__value"]}>
            {score}/{priceInScore}
          </span>
        </div>
        <div className={styles["score-bar__progressBg"]}>
          <div
            className={styles["score-bar__progressFill"]}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card.Root>
  );
};
