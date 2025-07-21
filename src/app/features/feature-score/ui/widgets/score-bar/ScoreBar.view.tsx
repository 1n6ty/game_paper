import React from "react";
import { Card } from "@/app/shared-kernel/ui/components/card/Card";
import { Flex } from "@/app/shared-kernel/ui/components/flex/Flex";
import { Icon } from "@/app/shared-kernel/ui/components/icon/Icon";
import { ProgressBar } from "@/app/shared-kernel/ui/components/progress-bar/ProgressBar";
import { Typography } from "@/app/shared-kernel/ui/components/typography/Typography";
// import MilkGlassSvg from "./assets/MilkGlass.svg?react";
import styles from "./ScoreBar.module.css";

interface ScoreBarProps {
  score: number;
  maxScore: number;
}

export const ScoreBarView = ({ score, maxScore }: ScoreBarProps) => {
  return (
    <Card.Root className={styles["score-bar"]}>
      <Flex align="center" gap="sm">
        <Icon size="lg" className={styles["score-bar__icon"]}>
          SVG
          {/* <MilkGlassSvg /> */}
        </Icon>
        <Flex direction="column" className={styles["score-bar__info"]}>
          <Flex justify="between" align="center">
            <Typography variant="body">Ламбиксы</Typography>
            <Typography variant="h3" className={styles["score-bar__value"]}>
              {score}/{maxScore}
            </Typography>
          </Flex>
          <ProgressBar value={score} max={maxScore} />
        </Flex>
      </Flex>
    </Card.Root>
  );
};
