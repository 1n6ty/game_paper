import { FC, SVGProps } from "react";
import { Card } from "@/app/shared-kernel/ui/components/Card/Card";
import {
  CardRewardItem,
  CardRewardItemProps,
} from "@/app/widgets/CardRewardItem/CardRewardItem";

export const CardReward = () => {
  const list = [
    { text: "Первая карточка" },
    { text: "Вторая карточка" },
    { text: "Третья карточка" },
  ];

  return (
    <Card.Root
      // textSize="small"
      variant="primary"
      title="Сканируйте наши продукты и получайте ламбиксы!"
    >
      <div className="scanner-content img-center reward-img">
        {list.map(({ text }) => (
          <CardRewardItem text={text} />
        ))}
      </div>
    </Card.Root>
  );
};
