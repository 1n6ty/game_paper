import React, { ElementType, ComponentPropsWithRef, forwardRef } from "react";

type PolymorphicProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, "as">;

type PolymorphicRef<T extends ElementType> = ComponentPropsWithRef<T>["ref"];

export type BoxProps<T extends ElementType = "div"> = PolymorphicProps<T>;

export const Box = forwardRef(
  <T extends ElementType = "div">(
    { as, ...props }: BoxProps<T>,
    ref: PolymorphicRef<T>
  ) => {
    const Component = as || "div";

    console.log(props.style);

    return <Component ref={ref} {...props} />;
  }
);

Box.displayName = "Box";
