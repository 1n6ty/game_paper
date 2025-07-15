import { render, cleanup } from "@testing-library/react";
import { FontInjector } from "./FontInjector";
import { Theme } from "../../../themes/Theme";

const mockThemeWithFont: Theme = {
  typography: {
    fontFamily: "Roboto",
    fontUrl: "https://example.com/font.css",
  },
} as Theme;

const mockThemeWithoutFont: Theme = {
  typography: { fontFamily: "Arial" },
} as Theme;

describe("FontInjector", () => {
  // Очищаем <head> после каждого теста
  afterEach(cleanup);

  it("должен добавлять тег <link> в head, если fontUrl предоставлен", () => {
    // ARRANGE & ACT
    render(<FontInjector theme={mockThemeWithFont} />);

    // ASSERT
    const linkElement = document.head.querySelector('link[rel="stylesheet"]');

    expect(linkElement).not.toBeNull();
    expect(linkElement?.getAttribute("href")).toBe(
      "https://example.com/font.css"
    );
  });

  it("не должен добавлять тег <link>, если fontUrl отсутствует", () => {
    // ARRANGE & ACT
    render(<FontInjector theme={mockThemeWithoutFont} />);

    // ASSERT
    const linkElement = document.head.querySelector('link[rel="stylesheet"]');

    expect(linkElement).toBeNull();
  });
});
