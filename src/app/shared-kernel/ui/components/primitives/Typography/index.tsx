import React, { ElementType, forwardRef } from "react";
import {
  Box,
  BoxProps,
} from "@/app/shared-kernel/ui/components/primitives/Box";

type PolymorphicRef<T extends ElementType> =
  React.ComponentPropsWithRef<T>["ref"];

export type TypographyProps<T extends ElementType = "p"> = BoxProps<T>;

export const Typography = forwardRef(
  <T extends ElementType = "p">(
    props: TypographyProps<T>,
    ref: PolymorphicRef<T>
  ) => {
    return <Box as="p" {...props} ref={ref} />;
  }
);

Typography.displayName = "Typography";
