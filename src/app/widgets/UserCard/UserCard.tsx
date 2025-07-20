import React from "react";
import { useCouponPolicyQuery } from "@/app/features/feature-user/infrastructure/queries/useCouponPolicyQuery";
import { useUserWithRewardsQuery } from "@/app/features/feature-user/infrastructure/queries/useUserWithRewardsQuery";
import { getFullName } from "@/app/shared-kernel/domain/entities/User";
import { Card } from "@/app/shared-kernel/ui/components/Card/Card";
// import MilkTicketSvg from "@/assets/MilkTicket.svg?react";
import styles from "./UserCard.module.css";

export const UserCard = () => {
  const { data: user, isLoading: userIsLoading } = useUserWithRewardsQuery();
  const { data: policy, isLoading: policyIsLoading } = useCouponPolicyQuery();

  if (userIsLoading || !user || policyIsLoading || !policy) {
    return <div className={styles.skeleton}>Загрузка...</div>;
  }

  const { firstName } = user;
  const { tickets } = user;

  return (
    <Card.Root variant="secondary" className={styles["user-card"]}>
      {/* <MilkTicketSvg className={styles["user-card__icon"]} /> */}
      <div>
        <p className={styles["user-card__name"]}>
          {firstName || getFullName(user)}
        </p>
        <p className={styles["user-card__tickets"]}>{tickets}</p>
      </div>
    </Card.Root>
  );
};
