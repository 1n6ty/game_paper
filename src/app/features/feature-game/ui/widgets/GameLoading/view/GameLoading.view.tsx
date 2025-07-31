import React, { FC, SVGProps } from "react";
import styles from "@/app/features/feature-game/ui/widgets/GameLoading/GameLoading.module.css";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  progress: number;
  BottleIcon: FC<SVGProps<SVGSVGElement>>;
  maskImageUrl: string;
}

export const GameLoadingView = ({
  progress,
  BottleIcon,
  maskImageUrl,
}: Props) => {
  return (
    <Flex justify="center" align="center" className={styles["game-loading"]}>
      <Box className={styles["game-loading__bg"]} />
      <Flex
        justify="center"
        align="center"
        className={styles["game-loading__circle"]}
      >
        <Box className={styles["game-loading__bottle-container"]}>
          <Box
            className={styles["game-loading__fill"]}
            style={{
              height: `${progress}%`,
              maskImage: `url('${maskImageUrl}')`,
              WebkitMaskImage: `url('${maskImageUrl}')`,
            }}
          />
          <BottleIcon className={styles["game-loading__bottle"]} />
          <Typography as="div" className={styles["game-loading__percent"]}>
            {progress}%
          </Typography>
        </Box>
      </Flex>
    </Flex>
  );
};
