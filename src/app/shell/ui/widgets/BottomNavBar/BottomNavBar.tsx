import React from "react";
import { useTranslation } from "react-i18next";
import GamesIcon from "./assets/Games.svg?react";
import HomeIcon from "./assets/Home.svg?react";
// import ActivitiesIcon from "./assets/Play.svg?react";
// import ScannerIcon from "./assets/Qr.svg?react";
import { BottomNavBarView, NavItem } from "./view/BottomNavBar.view";

export const BottomNavBar = () => {
  const { t } = useTranslation();

  // Конфигурация навигационных элементов.
  // В будущем может приходить с сервера или из конфига.
  const navItems: NavItem[] = [
    { path: "/", label: t("nav.home"), IconComponent: HomeIcon },
    { path: "/games", label: t("nav.games"), IconComponent: GamesIcon },
  ];

  return <BottomNavBarView navItems={navItems} />;
};
