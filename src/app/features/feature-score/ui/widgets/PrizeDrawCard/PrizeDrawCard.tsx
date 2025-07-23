import React from "react";
import { useTranslation } from "react-i18next";
import { useUserWithRewardsQuery } from "@/app/features/feature-score/infrastructure/queries/useUserWithRewardsQuery";
import TicketSvgUrl from "./assets/ticket.svg";
import { PrizeDrawCardView } from "./view/PrizeDrawCard.view";

export const PrizeDrawCard = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useUserWithRewardsQuery();

  const ticketsText = t("widgets.prizeDrawCard.ticketsText", {
    count: data?.tickets,
  });

  return (
    <PrizeDrawCardView
      title={t("widgets.prizeDrawCard.title")}
      ticketsText={ticketsText}
      ticketImageUrl={TicketSvgUrl}
    />
  );
};
