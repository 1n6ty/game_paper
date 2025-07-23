import React from "react";
import cn from "classnames";
import { Button } from "@/app/shared-kernel/ui/components/headless/Button";
import { Icon } from "@/app/shared-kernel/ui/components/primitives/Icon";
import styles from "@/app/widgets/base/IconButton/IconButton.module.css";

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  "aria-label": string;
  type?: "button" | "submit" | "reset";
}

export const IconButtonView = ({ children, className, ...rest }: Props) => {
  const rootClassName = cn(styles["icon-button"], className);

  return (
    <Button className={rootClassName} {...rest}>
      <Icon>{children}</Icon>
    </Button>
  );
};
