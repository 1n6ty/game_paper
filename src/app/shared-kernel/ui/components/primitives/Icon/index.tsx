import React, { ElementType, forwardRef } from "react";
import {
  Box,
  BoxProps,
} from "@/app/shared-kernel/ui/components/primitives/Box";

type PolymorphicRef<T extends ElementType> =
  React.ComponentPropsWithRef<T>["ref"];

export type IconProps<T extends ElementType = "span"> = BoxProps<T>;

export const Icon = forwardRef(
  <T extends ElementType = "span">(
    { style, ...props }: IconProps<T>,
    ref: PolymorphicRef<T>
  ) => {
    const iconStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0, // Предотвращает сжатие иконки во flex-контейнере
      ...style,
    };

    return <Box as="span" style={iconStyles} {...props} ref={ref} />;
  }
);

Icon.displayName = "Icon";
