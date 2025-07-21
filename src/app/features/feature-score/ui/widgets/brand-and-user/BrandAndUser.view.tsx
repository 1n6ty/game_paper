import React from "react";
import EmblemSvgUrl from "/emblem.svg";
import { Card } from "@/app/shared-kernel/ui/components/card/Card";
import { Flex } from "@/app/shared-kernel/ui/components/flex/Flex";
import { Icon } from "@/app/shared-kernel/ui/components/icon/Icon";
import { Typography } from "@/app/shared-kernel/ui/components/typography/Typography";
import MilkTicketSvg from "./assets/MilkTicket.svg?react";
import styles from "./BrandAndUser.module.css";

interface BrandAndUserProps {
  username: string;
  tickets: number;
}

export const BrandAndUserView = ({ username, tickets }: BrandAndUserProps) => {
  return (
    <Flex gap="md" align="stretch">
      <Card.Root className={styles["brand-and-user__emblem-card"]}>
        <img
          src={EmblemSvgUrl}
          alt="Эмблема"
          className={styles["brand-and-user__emblem-img"]}
        />
      </Card.Root>
      <Card.Root className={styles["brand-and-user__user-card"]}>
        <Flex align="center" gap="md">
          <Icon size="lg">
            <MilkTicketSvg />
          </Icon>
          <Flex direction="column">
            <Typography
              variant="body"
              className={styles["brand-and-user__username"]}
            >
              {username}
            </Typography>
            <Typography
              variant="h3"
              className={styles["brand-and-user__tickets"]}
            >
              {tickets}
            </Typography>
          </Flex>
        </Flex>
      </Card.Root>
    </Flex>
  );
};
