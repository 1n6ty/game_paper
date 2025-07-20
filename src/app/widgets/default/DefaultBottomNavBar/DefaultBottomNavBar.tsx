import React, { useContext } from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { NavigationContext } from "@/app/shell/ui/contexts/NavigationContext";
import styles from "./DefaultBottomNavBar.module.css";
// import { HomeIcon, ScanIcon, ProfileIcon } from '../icons';

export const DefaultBottomNavBar = () => {
  const navItems = useContext(NavigationContext);

  return (
    <nav className={styles["default-bottom-nav-bar"]}>
      {navItems.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            classNames(styles["default-bottom-nav-bar__nav-item"], {
              "default-bottom-nav-bar__nav-item--active": isActive,
            })
          }
        >
          {/* <IconComponent /> Здесь должна быть логика выбора иконки */}
          <span className={styles["default-bottom-nav-bar__label"]}>
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};
