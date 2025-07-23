import React from "react";
import { useTranslation } from "react-i18next";
import CowSvg from "./assets/Cow.svg?react";
import { CardTipView } from "./view/CardTip.view";
// import { useTipQuery } from '...'; // <-- ТАК ЭТО БУДЕТ В БУДУЩЕМ

const MockSvg = () => {
  return <svg />;
};

export const CardTip = () => {
  const { t } = useTranslation();

  // В будущем здесь будет хук для получения данных с сервера
  // const { data: tip, isLoading } = useTipQuery();
  // if (isLoading) return <CardTipSkeleton />;

  return (
    <CardTipView
      title={t("widgets.cardTip.title")}
      text={t("widgets.cardTip.text")}
      RightSvg={CowSvg}
    />
  );
};
