import React from "react";
import { IconButtonView } from "./view/IconButton.view";

type Props = React.ComponentProps<typeof IconButtonView>;

export const IconButton = (props: Props) => {
  return <IconButtonView {...props} />;
};
