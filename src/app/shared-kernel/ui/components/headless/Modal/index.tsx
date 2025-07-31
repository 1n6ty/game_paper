import React from "react";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";

// Пропсы для Headless-компонента
interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  classNames?: {
    overlay?: string;
    content?: string;
  };
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  classNames = {},
}: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Телепортируем модалку в конец body для правильного z-index
    // Для этого нужен React.createPortal, но для простоты пока без него.
    // Если возникнут проблемы с z-index, мы его добавим.
    <Flex
      justify="center"
      align="center"
      className={classNames.overlay}
      onClick={onClose}
    >
      <Box
        className={classNames.content}
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику на контент
      >
        {children}
      </Box>
    </Flex>
  );
};
