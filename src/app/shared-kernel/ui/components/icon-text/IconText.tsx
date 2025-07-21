import React from "react";
import cn from "classnames";
import { Flex } from "@/app/shared-kernel/ui/components/flex/Flex";
import { Icon } from "@/app/shared-kernel/ui/components/icon/Icon";
import { Typography } from "@/app/shared-kernel/ui/components/typography/Typography";
import styles from "./IconText.module.css";

interface IconTextProps {
  icon: React.ReactNode;
  text: string;
  direction?: "row" | "column";
  className?: string;
}

export const IconText = ({
  icon,
  text,
  direction = "column",
  className,
}: IconTextProps) => {
  return (
    <Flex
      direction={direction}
      align="center"
      className={cn(styles["icon-text"], className)}
    >
      <Icon>{icon}</Icon>
      <Typography variant="caption">{text}</Typography>
    </Flex>
  );
};
