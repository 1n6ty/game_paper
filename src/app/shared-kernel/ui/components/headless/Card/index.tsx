import React, { ElementType, forwardRef } from "react";
import {
  Box,
  BoxProps,
} from "@/app/shared-kernel/ui/components/primitives/Box";
import {
  Typography,
  TypographyProps,
} from "@/app/shared-kernel/ui/components/primitives/Typography";

const CardRoot = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <Box {...props} ref={ref} />;
});

CardRoot.displayName = "CardRoot";

const CardTitle = forwardRef<HTMLHeadingElement, TypographyProps<"h2">>(
  (props, ref) => {
    return <Typography as="h2" {...props} ref={ref} />;
  }
);

CardTitle.displayName = "CardTitle";

const CardBody = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <Box {...props} ref={ref} />;
});

CardBody.displayName = "CardBody";

export const Card = Object.assign(CardRoot, {
  Title: CardTitle,
  Body: CardBody,
});
