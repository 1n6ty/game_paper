import React from "react";
import cn from "classnames";
import styles from "./Icon.module.css";

interface IconProps {
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Icon = ({ children, className, size = "md" }: IconProps) => {
  const iconClasses = cn(styles.icon, styles[`icon--size-${size}`], className);

  return <span className={iconClasses}>{children}</span>;
};
