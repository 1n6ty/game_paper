import React from "react";
import BottleSvg from "assets/Bottle.svg?react";
import BottleClipSvgUrl from "./assets/bottleClip.svg";
import { GameLoadingView } from "./view/GameLoading.view";

interface Props {
  progress: number;
}

export const GameLoading = ({ progress }: Props) => {
  return (
    <GameLoadingView
      progress={progress}
      BottleIcon={BottleSvg}
      maskImageUrl={BottleClipSvgUrl}
    />
  );
};
