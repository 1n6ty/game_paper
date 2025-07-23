import React from "react";
import { render, screen } from "@testing-library/react";
import { Flex } from "@/app/shared-kernel/ui/primitives/Flex";

describe("Primitive: Flex", () => {
  it("renders a div element by default", () => {
    render(<Flex data-testid="flex" />);
    const flexElement = screen.getByTestId("flex");

    expect(flexElement.tagName).toBe("DIV");
  });

  it("applies basic flex styles by default", () => {
    render(<Flex data-testid="flex" />);
    const flexElement = screen.getByTestId("flex");

    expect(flexElement).toHaveStyle("display: flex");
  });

  it("applies flex properties based on props", () => {
    render(
      <Flex
        data-testid="flex"
        direction="column"
        align="center"
        justify="space-between"
        gap="16px"
      />
    );
    const flexElement = screen.getByTestId("flex");

    expect(flexElement).toHaveStyle("flex-direction: column");
    expect(flexElement).toHaveStyle("align-items: center");
    expect(flexElement).toHaveStyle("justify-content: space-between");
    expect(flexElement).toHaveStyle("gap: 16px");
  });

  it('renders as a different element when "as" prop is used', () => {
    render(<Flex as="section" data-testid="flex-section" />);
    const sectionElement = screen.getByTestId("flex-section");

    expect(sectionElement.tagName).toBe("SECTION");
    expect(sectionElement).toHaveStyle("display: flex");
  });
});
