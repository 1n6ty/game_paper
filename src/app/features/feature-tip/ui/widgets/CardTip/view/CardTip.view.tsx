import React, { FC, SVGProps } from "react";
import styles from "@/app/features/feature-tip/ui/widgets/CardTip/CardTip.module.css";
import { Card } from "@/app/shared-kernel/ui/components/headless/Card";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  title: string;
  text: string;
  RightSvg?: FC<SVGProps<SVGSVGElement>>;
}

export const CardTipView = ({ title, text, RightSvg }: Props) => {
  return (
    <Card className={styles["card-tip"]}>
      <Card.Title className={styles["card-tip__title"]}>{title}</Card.Title>

      <Flex className={styles["card-tip__content"]} align="flex-end">
        <Box className={styles["card-tip__text-container"]}>
          {/* Заменяем p на Typography */}
          <Typography className={styles["card-tip__text"]}>{text}</Typography>
        </Box>
        {RightSvg && <RightSvg className={styles["card-tip__svg-right"]} />}
      </Flex>
    </Card>
  );
};
