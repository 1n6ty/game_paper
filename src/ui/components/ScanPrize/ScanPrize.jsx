import { useState } from "react";

import MilkGlassSvg from "../../../assets/MilkGlass.svg?react";

import "./ScanPrize.css";

const VIDEO_ENDED_COOLDOWN = 500;

export default function ScanPrize({ 
  score,
  videoPlayerPath,
  onVideoEnded
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleVideoEnded = () => {
    setIsExiting(true);
    setTimeout(() => {
      onVideoEnded();
    }, VIDEO_ENDED_COOLDOWN);
  };

  console.log("ScanPrize (score):", score, "(videoPlayerPath):", videoPlayerPath);

  return (
    <div className={`scan-prize${isExiting ? " exit" : ""} `}>
      <p className="scan-prize__text">Вы заработали</p>
      <div className="scan-prize__reward">
        <p className="scan-prize__score">+{score}</p>
        <MilkGlassSvg className="scan-prize__milk-glass" />
      </div>

      <video
        src={videoPlayerPath}
        className="scan-prize__playback-video"
        autoPlay
        onEnded={handleVideoEnded}
        playsInline
      />
    </div>
  );
}