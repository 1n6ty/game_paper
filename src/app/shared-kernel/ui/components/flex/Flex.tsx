import React from "react";
import cn from "classnames";
import { Box } from "@/app/shared-kernel/ui/components/box/Box";
import styles from "./Flex.module.css";

type FlexProps = {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
} & React.HTMLAttributes<HTMLElement>;

export const Flex = ({
  className,
  direction,
  align,
  justify,
  gap,
  ...props
}: FlexProps) => {
  const flexClasses = cn(
    styles.flex,
    {
      [styles[`flex--direction-${direction}`]]: direction,
      [styles[`flex--align-${align}`]]: align,
      [styles[`flex--justify-${justify}`]]: justify,
      [styles[`flex--gap-${gap}`]]: gap,
    },
    className
  );

  return <Box className={flexClasses} {...props} />;
};
