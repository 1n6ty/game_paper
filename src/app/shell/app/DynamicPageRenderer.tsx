import React from "react";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Theme } from "@/app/themes/Theme";
import { PageLayout } from "./AppConfig";

interface DynamicPageRendererProps {
  theme: Theme;
  layout: PageLayout;
  registry: Record<string, React.ComponentType>;
}

export const DynamicPageRenderer = ({
  theme,
  layout,
  registry,
}: DynamicPageRendererProps) => {
  const HeaderComponent = layout.header ? registry[layout.header] : null;
  const FooterComponent = layout.footer ? registry[layout.footer] : null;
  const gap = layout.gap ? theme.spacing[layout.gap] : "0px";
  const padding = layout.padding;
  const paddingVar = { x: "", y: "" };

  if (padding) {
    paddingVar.x = theme.spacing[padding.x];
    paddingVar.y = theme.spacing[padding.y];
  }

  return (
    <Flex direction="column" gap={gap} style={{ flexGrow: 1 }}>
      {HeaderComponent && <HeaderComponent />}
      <Flex as="main" direction="column" gap={gap} style={{ padding: "0px" }}>
        {layout.widgets.map((widgetKey, index) => {
          const WidgetComponent = registry[widgetKey];

          if (!WidgetComponent) return null;

          const key = `${widgetKey}-${index}`;

          return <WidgetComponent key={key} />;
        })}
      </Flex>
      {FooterComponent && <FooterComponent />}
    </Flex>
  );
};
