import React, { FC, SVGProps } from "react";
// import { SvgLarge, SvgSmall } from "./assets"; // Пример
import styles from "./CardRewardItem.module.css";

export interface CardRewardItemProps {
  text: string;
  image?: FC<SVGProps<SVGSVGElement>>;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

export const CardRewardItem = ({ text }: CardRewardItemProps) => {
  return (
    <div className={styles["card-reward-item"]}>
      <div className={styles["card-reward-item__visual"]}>
        {/* <SvgLarge className={styles["card-reward-item__svgLarge"]} /> */}
      </div>
      <div className={styles["card-reward-item__info"]}>
        <span className={styles["card-reward-item__count"]}>{text}</span>
        {/* <SvgSmall className={styles["card-reward-item__svgSmall"]} /> */}
      </div>
    </div>
  );
};
