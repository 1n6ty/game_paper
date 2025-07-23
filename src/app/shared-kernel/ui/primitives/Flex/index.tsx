import React, { ElementType, forwardRef } from "react";
import { Box, BoxProps } from "@/app/shared-kernel/ui/primitives/Box";

interface FlexSpecificProps {
  direction?: "row" | "column";
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  gap?: string;
}

export type FlexProps<T extends ElementType = "div"> = FlexSpecificProps &
  BoxProps<T>;

export const Flex = forwardRef(
  <T extends ElementType = "div">(
    { direction, align, justify, gap, style, ...rest }: FlexProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const flexStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      gap: gap,
      ...style,
    };

    return <Box style={flexStyles} {...rest} ref={ref} />;
  }
);

Flex.displayName = "Flex";
