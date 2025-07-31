import React from "react";
import { useTranslation } from "react-i18next";
import MilkTicketSvg from "./assets/MilkTicket.svg?react";
import { UserBadgeView } from "./view/UserBadge.view";
// import { useUser } from 'entities/user';

export const UserBadge = () => {
  const { t } = useTranslation();
  // const { user, tickets } = useUser();
  const MOCK_USER = { name: "Иван Иванов", tickets: 5 };

  return (
    <UserBadgeView
      userName={MOCK_USER.name}
      ticketsCount={MOCK_USER.tickets}
      IconComponent={MilkTicketSvg}
    />
  );
};
