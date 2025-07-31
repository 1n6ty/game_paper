import React, { FC, SVGProps } from "react";
import styles from "@/app/features/feature-score/ui/widgets/ScoreBar/ScoreBar.module.css";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  title: string;
  currentScore: number;
  totalScore: number;
  IconComponent: FC<SVGProps<SVGSVGElement>>;
}

export const ScoreBarView = ({
  title,
  currentScore,
  totalScore,
  IconComponent,
}: Props) => {
  const processedScore = currentScore % totalScore;
  const percentage = totalScore > 0 ? (processedScore / totalScore) * 100 : 0;

  return (
    <Flex align="center" className={styles["score-bar"]}>
      <IconComponent className={styles["score-bar__icon"]} />

      <Flex direction="column" className={styles["score-bar__info"]}>
        <Flex justify="space-between" align="baseline">
          <Typography as="span" className={styles["score-bar__title"]}>
            {title}
          </Typography>
          <Typography as="span" className={styles["score-bar__value"]}>
            {`${processedScore}/${totalScore}`}
          </Typography>
        </Flex>

        <Box className={styles["score-bar__progress-bg"]}>
          <Box
            className={styles["score-bar__progress-fill"]}
            style={{ width: `${percentage}%` }}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
