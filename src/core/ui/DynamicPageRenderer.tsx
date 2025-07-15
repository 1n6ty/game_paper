import React from "react";
import { PageLayout } from "../../configs/AppConfig";
import styles from "./DynamicPageRenderer.module.css";

interface IDynamicPageRendererProps {
  layout: PageLayout;
  registry: Record<string, React.ComponentType>;
}

export const DynamicPageRenderer = ({
  layout,
  registry,
}: IDynamicPageRendererProps) => {
  const HeaderComponent = layout.header ? registry[layout.header] : null;
  const FooterComponent = layout.footer ? registry[layout.footer] : null;

  return (
    <>
      {HeaderComponent && <HeaderComponent />}
      <main className={styles.content}>
        {layout.widgets.map((widgetKey) => {
          const WidgetComponent = registry[widgetKey];

          if (!WidgetComponent) return null;

          return <WidgetComponent key={widgetKey} />;
        })}
      </main>
      {FooterComponent && <FooterComponent />}
    </>
  );
};
