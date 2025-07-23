import React from "react";
import cn from "classnames";
import styles from "@/app/features/feature-datamatrix/ui/widgets/QrScannerButton/QrScannerButton.module.css";
import QrSvg from "@/app/shared-kernel/ui/assets/icons/Qr.svg?react";
import { IconButton } from "@/app/widgets/base/IconButton/IconButton";

interface Props {
  onClick: () => void;
  className?: string;
}

export const QrScannerButtonView = ({ onClick, className }: Props) => {
  return (
    <IconButton
      className={cn(styles["qr-scanner-button"], className)}
      onClick={onClick}
      aria-label="Перейти к сканеру QR-кода"
    >
      <QrSvg className={styles["qr-scanner-button__svg"]} />
    </IconButton>
  );
};
