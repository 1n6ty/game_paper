import React, { FC, SVGProps } from "react";
import { RewardItem } from "@/app/features/feature-score/ui/widgets/RewardItem/RewardItem";
import styles from "@/app/features/feature-score/ui/widgets/ScannableProductsCard/ScannableProductsCard.module.css";
import { Card } from "@/app/shared-kernel/ui/components/headless/Card";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";

// Тип для одного элемента награды.
// Вероятно, уйдёт в domain/ как тип конфигурации.
interface Reward {
  id: string | number;
  count: number;
  LargeIcon: FC<SVGProps<SVGSVGElement>>;
  SmallIcon: FC<SVGProps<SVGSVGElement>>;
}

interface Props {
  title: string;
  rewards: Reward[];
}

export const ScannableProductsCardView = ({ title, rewards }: Props) => {
  return (
    <Card className={styles["scannable-products-card"]}>
      <Card.Title className={styles["scannable-products-card__title"]}>
        {title}
      </Card.Title>
      <Card.Body>
        <Flex
          justify="center"
          className={styles["scannable-products-card__content"]}
        >
          {rewards.map(({ id, ...rewardProps }) => (
            <RewardItem key={id} {...rewardProps} />
          ))}
        </Flex>
      </Card.Body>
    </Card>
  );
};
