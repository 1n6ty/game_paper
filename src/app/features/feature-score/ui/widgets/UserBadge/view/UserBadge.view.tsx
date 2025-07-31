import React, { FC, SVGProps } from "react";
import styles from "@/app/features/feature-score/ui/widgets/UserBadge/UserBadge.module.css";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  userName: string;
  ticketsCount: number;
  IconComponent: FC<SVGProps<SVGSVGElement>>;
}

export const UserBadgeView = ({
  userName,
  ticketsCount,
  IconComponent,
}: Props) => {
  return (
    <Flex align="center" className={styles["user-badge"]}>
      <IconComponent className={styles["user-badge__icon"]} />
      <Box>
        <Typography className={styles["user-badge__name"]}>
          {userName}
        </Typography>
        <Typography className={styles["user-badge__tickets"]}>
          {ticketsCount}
        </Typography>
      </Box>
    </Flex>
  );
};
