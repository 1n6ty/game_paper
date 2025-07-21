import React from "react";
import cn from "classnames";
import { NavLink } from "react-router-dom";
import { Flex } from "@/app/shared-kernel/ui/components/flex/Flex";
import { IconText } from "@/app/shared-kernel/ui/components/icon-text/IconText";
import styles from "./BottomNav.module.css";

interface RootProps {
  children: React.ReactNode;
  className?: string;
}

const Root = ({ children, className }: RootProps) => {
  return (
    <Flex
      as="nav"
      justify="around"
      align="center"
      className={cn(styles["bottom-nav"], className)}
    >
      {children}
    </Flex>
  );
};

interface ItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const Item = ({ to, icon, label }: ItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(styles["bottom-nav__item"], {
          [styles["bottom-nav__item--active"]]: isActive,
        })
      }
    >
      <IconText icon={icon} text={label} />
    </NavLink>
  );
};

export const BottomNav = {
  Root,
  Item,
};
