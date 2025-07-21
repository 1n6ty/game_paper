import React from "react";
import { Card } from "@/app/shared-kernel/ui/components/card/Card";
import { Flex } from "@/app/shared-kernel/ui/components/flex/Flex";
import { Skeleton } from "@/app/shared-kernel/ui/components/skeleton/Skeleton";
import styles from "./CardSkeleton.module.css";

export const CardSkeleton = () => {
  return (
    <Card.Root className={styles["card-skeleton"]}>
      <Flex direction="column" gap="md">
        <Skeleton className={styles["card-skeleton__title"]} />
        <Skeleton className={styles["card-skeleton__line"]} />
        <Skeleton className={styles["card-skeleton__line--short"]} />
      </Flex>
    </Card.Root>
  );
};
