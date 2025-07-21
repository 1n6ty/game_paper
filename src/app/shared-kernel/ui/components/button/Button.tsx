import React from "react";
import cn from "classnames";
import { Icon } from "@/app/shared-kernel/ui/components/icon/Icon";
import { Typography } from "@/app/shared-kernel/ui/components/typography/Typography";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonSize = "md" | "lg";

type RootProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Root = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}: RootProps) => {
  const buttonClasses = cn(
    styles.button,
    styles[`button--variant-${variant}`],
    styles[`button--size-${size}`],
    className
  );

  return <button className={buttonClasses} {...props} />;
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography as="span" variant="caption" className={styles.button__label}>
    {children}
  </Typography>
);

const IconSlot = ({ children }: { children: React.ReactNode }) => (
  <Icon size="sm">{children}</Icon>
);

export const Button = {
  Root,
  Label,
  Icon: IconSlot,
};
