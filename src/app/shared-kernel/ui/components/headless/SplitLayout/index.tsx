import React from "react";
import {
  Flex,
  FlexProps,
} from "@/app/shared-kernel/ui/components/primitives/Flex";

type SplitLayoutProps = FlexProps<"div">;

export const SplitLayout = (props: SplitLayoutProps) => {
  // Этот компонент просто является Flex'ом, чтобы семантически обозначить
  // его роль в коде - разделение экрана на части.
  return <Flex {...props} />;
};
