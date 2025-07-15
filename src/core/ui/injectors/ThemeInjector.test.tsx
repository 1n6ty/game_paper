import { render } from "@testing-library/react";
import { ThemeInjector } from "./ThemeInjector";
import { Theme } from "../../../themes/Theme";

// Моковая тема для теста
const mockTheme: Theme = {
  colors: { primary: "rgb(0, 0, 255)", background: "#fff" },
  spacing: { medium: "8px" },
} as unknown as Theme; // Используем as, чтобы не мокать все поля

describe("ThemeInjector", () => {
  // Очищаем стили после каждого теста
  afterEach(() => {
    document.documentElement.style.cssText = "";
  });

  it("должен устанавливать CSS-переменные на корневом элементе", () => {
    // ARRANGE & ACT
    render(<ThemeInjector theme={mockTheme} />);

    // ASSERT
    const rootStyle = document.documentElement.style;

    expect(rootStyle.getPropertyValue("--colors-primary")).toBe(
      "rgb(0, 0, 255)"
    );
    expect(rootStyle.getPropertyValue("--colors-background")).toBe("#fff");
    expect(rootStyle.getPropertyValue("--spacing-medium")).toBe("8px");
  });

  it("не должен устанавливать переменные для отсутствующих полей", () => {
    // ARRANGE & ACT
    render(<ThemeInjector theme={mockTheme} />);

    // ASSERT
    const rootStyle = document.documentElement.style;

    expect(rootStyle.getPropertyValue("--colors-secondary")).toBe("");
  });
});
