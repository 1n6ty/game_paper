import React from "react";
import cn from "classnames";
import { Box } from "@/app/shared-kernel/ui/components/box/Box";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  className,
}: ProgressBarProps) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <Box className={cn(styles["progress-bar"], className)}>
      <Box
        className={styles["progress-bar__value"]}
        style={{ width: `${percentage}%` }}
      />
    </Box>
  );
};
