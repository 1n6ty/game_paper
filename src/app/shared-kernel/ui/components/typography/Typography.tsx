import React from "react";
import cn from "classnames";
import styles from "./Typography.module.css";

type TypographyVariant = "h1" | "h2" | "h3" | "body" | "caption";

interface TypographyProps {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  variant?: TypographyVariant;
}

export const Typography = ({
  as,
  variant = "body",
  className,
  ...props
}: TypographyProps) => {
  const tagMap: Record<TypographyVariant, React.ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    body: "p",
    caption: "span",
  };
  const Component = as || tagMap[variant];
  const typographyClasses = cn(
    styles.typography,
    styles[`typography--variant-${variant}`],
    className
  );

  return <Component className={typographyClasses} {...props} />;
};
