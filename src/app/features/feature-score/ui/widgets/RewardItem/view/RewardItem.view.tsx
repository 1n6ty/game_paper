import React, { FC, SVGProps } from "react";
import styles from "@/app/features/feature-score/ui/widgets/RewardItem/RewardItem.module.css";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  count: string | number;
  LargeIcon?: FC<SVGProps<SVGSVGElement>>;
  SmallIcon?: FC<SVGProps<SVGSVGElement>>;
}

export const RewardItemView = ({ count, LargeIcon, SmallIcon }: Props) => {
  return (
    <Flex direction="column" align="center" className={styles["reward-item"]}>
      <Box className={styles["reward-item__visual"]}>
        {LargeIcon && (
          <LargeIcon className={styles["reward-item__icon--large"]} />
        )}
      </Box>

      <Flex align="center" className={styles["reward-item__info"]}>
        <Typography as="span" className={styles["reward-item__count"]}>
          {count}
        </Typography>
        {SmallIcon && (
          <SmallIcon className={styles["reward-item__icon--small"]} />
        )}
      </Flex>
    </Flex>
  );
};
