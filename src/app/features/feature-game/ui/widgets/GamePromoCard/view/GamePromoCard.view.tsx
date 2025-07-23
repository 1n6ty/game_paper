import React from "react";
import { QrScannerButton } from "@/app/features/feature-datamatrix/ui/widgets/QrScannerButton/QrScannerButton";
import styles from "@/app/features/feature-game/ui/widgets/GamePromoCard/GamePromoCard.module.css";
import { Card } from "@/app/shared-kernel/ui/components/headless/Card";

interface Props {
  title: string;
  description: string;
}

export const GamePromoCardView = ({ title, description }: Props) => {
  return (
    <Card className={styles["game-promo-card"]}>
      <div className={styles["game-promo-card__header"]}>
        <Card.Title className={styles["game-promo-card__title"]}>
          {title}
        </Card.Title>
        <QrScannerButton />
      </div>

      <Card.Body className={styles["game-promo-card__body"]}>
        {description}
      </Card.Body>
    </Card>
  );
};
