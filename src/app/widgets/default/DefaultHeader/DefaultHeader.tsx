import { useContext } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { NavigationContext } from "@/app/shell/ui/contexts/NavigationContext";
import styles from "./DefaultHeader.module.css";

export const DefaultHeader = () => {
  const navItems = useContext(NavigationContext);
  const { t } = useTranslation();

  return (
    <header className={styles["header"]}>
      <div className={styles["header__logo"]}>
        {t("widgets.userProfile.title")}
      </div>
      <nav className={styles["header__nav"]}>
        {navItems.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              classnames(styles["header__nav-link"], {
                "header__nav-link--active": isActive,
              })
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
