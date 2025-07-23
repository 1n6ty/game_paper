import React, { ElementType, forwardRef } from "react";
import {
  Box,
  BoxProps,
} from "@/app/shared-kernel/ui/components/primitives/Box";

export type ButtonProps<T extends ElementType = "button"> = BoxProps<T> & {
  disabled?: boolean;
};

export const Button = forwardRef(
  <T extends ElementType = "button">(
    props: ButtonProps<T>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return <Box as="button" type="button" {...props} ref={ref} />;
  }
);

Button.displayName = "Button";
