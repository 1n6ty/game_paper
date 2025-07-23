import React from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { QrScannerButtonView } from "./view/QrScannerButton.view";

interface Props {
  to?: string;
  className?: string;
  variant?: "default" | "on-primary"; // Для разных фонов
}

export const QrScannerButton = ({
  to = "/scanner",
  variant = "default",
  className,
}: Props) => {
  const navigate = useNavigate();

  const handleQrClick = () => {
    navigate(to);
  };

  return (
    <QrScannerButtonView
      onClick={handleQrClick}
      className={cn(className, {
        "qr-scanner-button--on-primary": variant === "on-primary",
      })}
    />
  );
};
