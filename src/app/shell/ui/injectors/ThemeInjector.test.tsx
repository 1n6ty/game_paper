import { render } from "@testing-library/react";
import { Theme } from "@/app/themes/Theme";
import { ThemeInjector } from "./ThemeInjector";

const mockTheme: Theme = {
  color: { primary: "rgb(0, 0, 255)", background: "#fff" },
  spacing: { medium: "8px" },
} as Theme;

describe("ThemeInjector", () => {
  // Очищаем стили после каждого теста
  afterEach(() => {
    document.documentElement.style.cssText = "";
  });

  it("должен устанавливать CSS-переменные на корневом элементе", () => {
    render(<ThemeInjector theme={mockTheme} />);

    const rootStyle = document.documentElement.style;

    expect(rootStyle.getPropertyValue("--color-primary")).toBe(
      "rgb(0, 0, 255)"
    );
    expect(rootStyle.getPropertyValue("--color-background")).toBe("#fff");
    expect(rootStyle.getPropertyValue("--spacing-medium")).toBe("8px");
  });

  it("не должен устанавливать переменные для отсутствующих полей", () => {
    render(<ThemeInjector theme={mockTheme} />);

    const rootStyle = document.documentElement.style;

    expect(rootStyle.getPropertyValue("--color-secondary")).toBe("");
  });
});
