import React from "react";
// import { useTranslation } from "react-i18next";
import { useUserWithRewardsQuery } from "@/app/features/feature-score/infrastructure/queries/useUserWithRewardsQuery";
import { getFullName } from "@/app/shared-kernel/domain/entities/User";
import MilkTicketSvg from "./assets/MilkTicket.svg?react";
import { UserBadgeView } from "./view/UserBadge.view";
// import { useUser } from 'entities/user';

export const UserBadge = () => {
  const { data: user, isLoading } = useUserWithRewardsQuery();

  if (!user || isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <UserBadgeView
      userName={getFullName(user)}
      ticketsCount={user.tickets}
      IconComponent={MilkTicketSvg}
    />
  );
};
