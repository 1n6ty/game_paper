import { FC, SVGProps } from "react";

import "./CardReward.css";

interface CardRewardProps {
  count: string;
  svgLarge?: FC<SVGProps<SVGSVGElement>>;
  svgSmall?: FC<SVGProps<SVGSVGElement>>;
}

export default function CardReward({ 
  count,
  svgLarge: SvgLarge,
  svgSmall: SvgSmall
}: CardRewardProps) {
  return (
    <div className="card-reward">
      <div className="card-reward__visual">
        {SvgLarge && <SvgLarge className="card-reward__svg card-reward__svg--large" />}
      </div>
      <div className="card-reward__info">
        <span className="card-reward__count">{count}</span>
        {SvgSmall && <SvgSmall className="card-reward__svg card-reward__svg--small" />}
      </div>
    </div>
  );
}