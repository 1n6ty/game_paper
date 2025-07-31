import React from "react";
import { GameItemView } from "./view/GameItem.view";

interface Props {
  title: string;
  imageUrl?: string;
  onClick: (title: string) => void;
}

export const GameItem = ({ title, imageUrl, onClick }: Props) => {
  const handleClick = () => {
    onClick(title);
  };

  return (
    <GameItemView title={title} imageUrl={imageUrl} onClick={handleClick} />
  );
};
