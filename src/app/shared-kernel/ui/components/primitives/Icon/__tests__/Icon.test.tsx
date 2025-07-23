import React from "react";
import { render, screen } from "@testing-library/react";
import { Icon } from "@/app/shared-kernel/ui/components/primitives/Icon";

const MockSvg = () => <svg data-testid="mock-svg" />;

describe("Primitive: Icon", () => {
  it('renders a "span" element by default', () => {
    render(<Icon />);
    // span не имеет явной роли, ищем по testid контейнера
    render(<Icon data-testid="icon" />);
    expect(screen.getByTestId("icon").tagName).toBe("SPAN");
  });

  it("renders its children (the SVG component)", () => {
    render(
      <Icon>
        <MockSvg />
      </Icon>
    );
    expect(screen.getByTestId("mock-svg")).toBeInTheDocument();
  });

  it("applies functional inline-flex styles", () => {
    render(<Icon data-testid="icon" />);
    const iconElement = screen.getByTestId("icon");

    expect(iconElement).toHaveStyle("display: inline-flex");
    expect(iconElement).toHaveStyle("align-items: center");
    expect(iconElement).toHaveStyle("justify-content: center");
    expect(iconElement).toHaveStyle("flex-shrink: 0");
  });
});
