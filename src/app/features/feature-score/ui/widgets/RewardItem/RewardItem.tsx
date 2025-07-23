import React, { FC, SVGProps } from "react";
import { RewardItemView } from "./view/RewardItem.view";

interface Props {
  count: string | number;
  LargeIcon?: FC<SVGProps<SVGSVGElement>>;
  SmallIcon?: FC<SVGProps<SVGSVGElement>>;
}

export const RewardItem = (props: Props) => {
  return <RewardItemView {...props} />;
};
