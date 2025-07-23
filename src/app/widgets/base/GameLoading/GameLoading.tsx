import BottleSvg from "../../../assets/Bottle.svg?react";

import BottleClipSvgUrl from "/bottleClip.svg";

import "./GameLoading.css";

interface GameLoadingProps {
  progress: number;
}

export default function GameLoading({ 
  progress
}: GameLoadingProps) {
  return (
    <div className="game-loading">
      <div className="game-loading__bg" />
      <div className="game-loading__circle">
        <div className="game-loading__bottle-container">
          
          <div
            className="game-loading__fill"
            style={{ 
              height: `${progress}%`,
              maskImage: `url('${BottleClipSvgUrl}')`,
              WebkitMaskImage: `url('${BottleClipSvgUrl}')`
            }}
          />

          <BottleSvg className="game-loading__bottle" />

          <div className="game-loading__percent">{progress}%</div>
        </div>
      </div>
    </div>
  );
}