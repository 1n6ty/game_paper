import React from "react";
import { Button } from "shared-kernel/ui/headless/Button";
import { Modal } from "shared-kernel/ui/headless/Modal";
import { Typography } from "shared-kernel/ui/primitives/Typography";
import styles from "@/src/app/widgets/base/TryAgainPopup/TryAgainPopup.module.css";

interface Props {
  isOpen: boolean;
  text: string;
  buttonText: string;
  onConfirm: () => void;
}

export const TryAgainPopupView = ({
  isOpen,
  text,
  buttonText,
  onConfirm,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      classNames={{
        overlay: styles["try-again-overlay"],
        content: styles["try-again-container"],
      }}
    >
      <Typography as="h2" className={styles["try-again-text"]}>
        {text}
      </Typography>
      <Button onClick={onConfirm} className={styles["try-again-button"]}>
        {buttonText}
      </Button>
    </Modal>
  );
};
