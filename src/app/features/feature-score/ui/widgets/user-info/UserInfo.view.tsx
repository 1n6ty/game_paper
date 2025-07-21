import React from "react";
import { Card } from "@/app/shared-kernel/ui/components/card/Card";
import { Flex } from "@/app/shared-kernel/ui/components/flex/Flex";
import { Icon } from "@/app/shared-kernel/ui/components/icon/Icon";
import { ProgressBar } from "@/app/shared-kernel/ui/components/progress-bar/ProgressBar";
import { Typography } from "@/app/shared-kernel/ui/components/typography/Typography";
import { UserIcon, LambiksyIcon } from "./assets";
import styles from "./UserInfo.module.css";

interface UserInfoProps {
  username: string;
  nicknameScore: number;
  lambiksyScore: number;
  lambiksyMaxScore: number;
}

export const UserInfoView = ({
  username,
  nicknameScore,
  lambiksyScore,
  lambiksyMaxScore,
}: UserInfoProps) => {
  return (
    <Flex gap="sm" className={styles["user-info"]}>
      <Card.Root className={styles["user-info__card"]}>
        <Flex direction="column" align="center" gap="xs">
          <Icon>
            <UserIcon />
          </Icon>
          <Typography variant="caption">{username}</Typography>
          <Typography variant="h3">{nicknameScore}</Typography>
        </Flex>
      </Card.Root>
      <Card.Root className={styles["user-info__card--large"]}>
        <Flex direction="column" gap="sm">
          <Flex justify="between" align="center">
            <Flex align="center" gap="sm">
              <Icon>
                <LambiksyIcon />
              </Icon>
              <Typography variant="body">Ламбиксы</Typography>
            </Flex>
            <Typography variant="body">
              <strong>{lambiksyScore}</strong>/{lambiksyMaxScore}
            </Typography>
          </Flex>
          <ProgressBar value={lambiksyScore} max={lambiksyMaxScore} />
        </Flex>
      </Card.Root>
    </Flex>
  );
};
