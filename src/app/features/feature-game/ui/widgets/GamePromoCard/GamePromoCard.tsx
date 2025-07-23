import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GamePromoCardView } from "./view/GamePromoCard.view";

export const GamePromoCard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleQrClick = () => {
    navigate("/scanner");
  };

  return (
    <GamePromoCardView
      title={t("widgets.promoCard.title")}
      description={t("widgets.promoCard.description")}
      onQrClick={handleQrClick}
    />
  );
};
