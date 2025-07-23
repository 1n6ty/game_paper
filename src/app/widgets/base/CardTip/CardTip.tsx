import { FC, SVGProps } from "react";
import "./CardTip.css";

interface CardTipProps {
  title: string;
  text: string;
  rightSvg?: FC<SVGProps<SVGSVGElement>>;
}

export default function CardTip({ 
  title,
  text,
  rightSvg: RightSvg
}: CardTipProps) {
  return (
    <div className="card-tip">
      {title && <h2 className="card-tip__title">{title}</h2>}
      {text && (
        <div className="card-tip__text-container">
          <p className="card-tip__text">{text}</p>
        </div>
      )}
      {RightSvg && <RightSvg className="card-tip__svg-right" />}
    </div>
  );
}
