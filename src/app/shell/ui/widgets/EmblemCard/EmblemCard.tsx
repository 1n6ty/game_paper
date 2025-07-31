import React from "react";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import EmblemSvgUrl from "./assets/emblem.svg";
import styles from "./EmblemCard.module.css";

export const EmblemCard = () => {
  return (
    <Box className={styles["emblem-card"]}>
      <img
        src={EmblemSvgUrl}
        alt="Эмблема"
        className={styles["emblem-card__image"]}
      />
    </Box>
  );
};
