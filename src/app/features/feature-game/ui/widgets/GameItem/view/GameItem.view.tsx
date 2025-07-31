import React from "react";
import styles from "@/app/features/feature-game/ui/widgets/GameItem/GameItem.module.css";
import { Card } from "@/app/shared-kernel/ui/components/headless/Card";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  title: string;
  imageUrl?: string;
  onClick: () => void;
}

export const GameItemView = ({ title, imageUrl, onClick }: Props) => {
  return (
    <Card className={styles["game-item"]} onClick={onClick}>
      <Box className={styles["game-item__image-container"]}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={styles["game-item__image"]}
          />
        ) : (
          // Placeholder, если картинки нет
          <Box className={styles["game-item__placeholder"]} />
        )}
      </Box>
      <Card.Body className={styles["game-item__body"]}>
        <Typography as="span" className={styles["game-item__title"]}>
          {title}
        </Typography>
      </Card.Body>
    </Card>
  );
};
