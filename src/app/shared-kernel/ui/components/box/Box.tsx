import React from "react";
import cn from "classnames";

type BoxProps = {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>;

export const Box = ({
  as: Component = "div",
  className,
  ...props
}: BoxProps) => <Component className={cn("box", className)} {...props} />;
