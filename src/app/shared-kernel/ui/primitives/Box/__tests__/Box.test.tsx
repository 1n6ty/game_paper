import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Box } from "@/app/shared-kernel/ui/primitives/Box";

describe("Primitive: Box", () => {
  it("renders a div element by default", () => {
    render(<Box data-testid="box" />);
    const boxElement = screen.getByTestId("box");

    expect(boxElement.tagName).toBe("DIV");
  });

  it('renders the specified element with the "as" prop', () => {
    render(<Box as="nav" data-testid="box-nav" />);
    const navElement = screen.getByTestId("box-nav");

    expect(navElement.tagName).toBe("NAV");
  });

  it("passes through standard HTML attributes", () => {
    render(<Box data-testid="my-box" id="my-box-id" className="test-class" />);
    const boxElement = screen.getByTestId("my-box");

    expect(boxElement).toHaveAttribute("id", "my-box-id");
    expect(boxElement).toHaveClass("test-class");
  });

  it("forwards the ref to a polymorphic element", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(<Box as="a" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
