import React from "react";
import EmblemSvgUrl from "/emblem.svg";
import { Card } from "@/app/shared-kernel/ui/components/card/Card";
import styles from "./EmblemCard.module.css";

export const EmblemCard = () => {
  return (
    <Card.Root className={styles["emblem-card"]}>
      <img
        src={EmblemSvgUrl}
        alt="Эмблема"
        className={styles["emblem-card__img"]}
      />
    </Card.Root>
  );
};
