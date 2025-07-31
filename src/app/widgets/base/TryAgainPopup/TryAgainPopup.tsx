import React from "react";
import { useTranslation } from "react-i18next";
import { TryAgainPopupView } from "./view/TryAgainPopup.view";

interface Props {
  isOpen: boolean;
  text: string;
  onConfirm: () => void;
}

export const TryAgainPopup = ({ isOpen, text, onConfirm }: Props) => {
  const { t } = useTranslation();

  return (
    <TryAgainPopupView
      isOpen={isOpen}
      text={text}
      buttonText={t("widgets.tryAgainPopup.buttonText")}
      onConfirm={onConfirm}
    />
  );
};
