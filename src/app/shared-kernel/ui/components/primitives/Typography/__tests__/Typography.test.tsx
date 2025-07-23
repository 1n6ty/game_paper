import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

describe("Primitive: Typography", () => {
  it('renders a "p" element by default', () => {
    render(<Typography>Hello World</Typography>);
    const textElement = screen.getByText("Hello World");

    expect(textElement.tagName).toBe("P");
  });

  it('renders the specified element with the "as" prop', () => {
    render(<Typography as="h1">Heading</Typography>);
    const headingElement = screen.getByRole("heading", { name: "Heading" });

    expect(headingElement.tagName).toBe("H1");
  });

  it("renders its children correctly", () => {
    render(
      <Typography>
        <span>Complex</span> children
      </Typography>
    );
    expect(screen.getByText("Complex")).toBeInTheDocument();
  });

  it("correctly places ref by tag", () => {
    render(<Typography as="h1">Heading</Typography>);

    // Проверяем, что компонент имеет тег H1
    expect(screen.getByText("Heading")).toBeInstanceOf(HTMLHeadingElement);
    expect(screen.getByText("Heading").tagName).toBe("H1");
  });

  it("correctly forwards ref to the polymorphic element", () => {
    const h1Ref = createRef<HTMLHeadingElement>();

    render(
      <Typography as="h1" ref={h1Ref}>
        Heading
      </Typography>
    );

    // Проверяем, что ref указывает на настоящий H1 элемент
    expect(h1Ref.current).toBeInstanceOf(HTMLHeadingElement);
    expect(h1Ref.current?.tagName).toBe("H1");
  });
});
