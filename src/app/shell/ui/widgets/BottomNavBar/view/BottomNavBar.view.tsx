import React, { FC, SVGProps } from "react";
import { NavLink } from "react-router-dom";
import { Flex } from "@/app/shared-kernel/ui/components/primitives/Flex";
import { Icon } from "@/app/shared-kernel/ui/components/primitives/Icon";
import { Typography } from "@/app/shared-kernel/ui/components/primitives/Typography";
import styles from "@/app/shell/ui/widgets/BottomNavBar/BottomNavBar.module.css";

// Тип для одного элемента навигации
export interface NavItem {
  path: string;
  label: string;
  IconComponent: FC<SVGProps<SVGSVGElement>>;
}

interface Props {
  navItems: NavItem[];
}

export const BottomNavBarView = ({ navItems }: Props) => {
  return (
    <Flex as="nav" justify="space-around" className={styles["bottom-nav-bar"]}>
      {navItems.map(({ path, label, IconComponent }) => (
        <NavLink
          key={path}
          to={path}
          // Используем функцию для определения активного класса
          className={({ isActive }) =>
            `${styles["bottom-nav-bar__tab"]} ${
              isActive ? styles["bottom-nav-bar__tab--active"] : ""
            }`
          }
        >
          <Icon className={styles["bottom-nav-bar__icon"]}>
            <IconComponent />
          </Icon>
          <Typography as="span" className={styles["bottom-nav-bar__label"]}>
            {label}
          </Typography>
        </NavLink>
      ))}
    </Flex>
  );
};
