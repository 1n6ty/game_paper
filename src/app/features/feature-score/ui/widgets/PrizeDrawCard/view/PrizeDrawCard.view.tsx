import React from "react";
import { QrScannerButton } from "@/app/features/feature-datamatrix/ui/widgets/QrScannerButton/QrScannerButton";
import styles from "@/app/features/feature-score/ui/widgets/PrizeDrawCard/PrizeDrawCard.module.css";
import { Card } from "@/app/shared-kernel/ui/components/headless/Card";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  title: string;
  ticketsText: string;
  ticketImageUrl: string;
}

export const PrizeDrawCardView = ({
  title,
  ticketsText,
  ticketImageUrl,
}: Props) => {
  return (
    <Card className={styles["prize-draw-card"]}>
      <Flex
        justify="space-between"
        align="flex-start"
        className={styles["prize-draw-card__header"]}
      >
        <Card.Title className={styles["prize-draw-card__title"]}>
          {title}
        </Card.Title>
        <QrScannerButton variant="on-primary" />
      </Flex>
      <Card.Body className={styles["prize-draw-card__body"]}>
        <Typography>{ticketsText}</Typography>
        <img
          src={ticketImageUrl}
          alt="Билет на розыгрыш"
          className={styles["prize-draw-card__ticket-img"]}
        />
      </Card.Body>
    </Card>
  );
};
