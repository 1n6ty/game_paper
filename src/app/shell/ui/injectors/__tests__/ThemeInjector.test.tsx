import { render } from "@testing-library/react";
import { ThemeInjector } from "@/app/shell/ui/injectors/ThemeInjector";
import { Theme } from "@/app/themes/Theme";

const mockTheme: Theme = {
  color: { primary: "rgb(0, 0, 255)", background: "#fff" },
  spacing: { medium: "8px" },
  font: {
    h1: {
      fontFamily: "Roboto",
      fontSize: "16px",
      fontWeight: "500",
      lineHeight: "1",
    },
  },
} as unknown as Theme;

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

  it("проверка чтения свойств font", () => {
    render(<ThemeInjector theme={mockTheme} />);

    const rootStyle = document.documentElement.style;

    expect(rootStyle.getPropertyValue("--font-h1-font-family")).toBe("Roboto");
    expect(rootStyle.getPropertyValue("--font-h1-font-size")).toBe("16px");
    expect(rootStyle.getPropertyValue("--font-h1-font-weight")).toBe("500");
    expect(rootStyle.getPropertyValue("--font-h1-line-height")).toBe("1");
  });
});
