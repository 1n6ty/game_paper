import React from "react";
import { Card } from "@/app/shared-kernel/ui/components/headless/Card";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import styles from "./GameItem.skeleton.module.css";

export const GameItemSkeleton = () => {
  return (
    <Card className={styles["game-item-skeleton"]}>
      <Box className={styles["skeleton-image"]} />
      <Card.Body className={styles["skeleton-body"]}>
        <Box className={styles["skeleton-text"]} />
      </Card.Body>
    </Card>
  );
};
