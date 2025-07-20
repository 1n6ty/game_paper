import React from "react";
import { PageLayout } from "./AppConfig";
import styles from "./DynamicPageRenderer.module.css";

interface DynamicPageRendererProps {
  layout: PageLayout;
  registry: Record<string, React.ComponentType>;
}

export const DynamicPageRenderer = ({
  layout,
  registry,
}: DynamicPageRendererProps) => {
  const HeaderComponent = layout.header ? registry[layout.header] : null;
  const FooterComponent = layout.footer ? registry[layout.footer] : null;
  const gap = layout.gap;

  return (
    <>
      {HeaderComponent && <HeaderComponent />}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `var(--spacing-${gap})`,
        }}
      >
        {layout.widgets.map((widgetKey, index) => {
          const WidgetComponent = registry[widgetKey];

          if (!WidgetComponent) return null;

          const key = `${widgetKey}-${index}`;

          return <WidgetComponent key={key} />;
        })}
      </main>
      {FooterComponent && <FooterComponent />}
    </>
  );
};
