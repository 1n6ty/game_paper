import React from "react";
import { useTranslation } from "react-i18next";
import { GameOverView } from "./view/GameOver.view";

interface Props {
  isOpen: boolean;
  score: number;
  onExit: () => void;
  onRestart: () => void;
}

export const GameOver = ({ isOpen, score, onExit, onRestart }: Props) => {
  const { t } = useTranslation();

  return (
    <GameOverView
      isOpen={isOpen}
      score={score}
      onExit={onExit}
      onRestart={onRestart}
      title={t("widgets.gameOver.title")}
      scoreLabel={t("widgets.gameOver.scoreLabel")}
      exitButtonText={t("widgets.gameOver.exitButton")}
      restartButtonText={t("widgets.gameOver.restartButton")}
    />
  );
};
