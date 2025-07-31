import React from "react";
import styles from "@/app/features/feature-game/ui/widgets/GameOver/GameOver.module.css";
import { Button } from "@/app/shared-kernel/ui/components/headless/Button";
import { Modal } from "@/app/shared-kernel/ui/components/headless/Modal";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";

interface Props {
  isOpen: boolean;
  score: number;
  onExit: () => void;
  onRestart: () => void;
  title: string;
  scoreLabel: string;
  exitButtonText: string;
  restartButtonText: string;
}

export const GameOverView = (props: Props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onExit} // Закрытие по клику на оверлей
      classNames={{
        overlay: styles["game-over-overlay"],
        content: styles["game-over-container"],
      }}
    >
      <Typography as="h2" className={styles["game-over-title"]}>
        {props.title}
      </Typography>

      <Flex justify="space-between" align="center">
        <Typography className={styles["game-over-score-label"]}>
          {props.scoreLabel}
        </Typography>
        <Typography className={styles["game-over-score-value"]}>
          {props.score}
        </Typography>
      </Flex>

      <Flex justify="space-between" className={styles["game-over-buttons"]}>
        <Button
          onClick={props.onExit}
          className={styles["game-over-button--exit"]}
        >
          {props.exitButtonText}
        </Button>
        <Button
          onClick={props.onRestart}
          className={styles["game-over-button--restart"]}
        >
          {props.restartButtonText}
        </Button>
      </Flex>
    </Modal>
  );
};
