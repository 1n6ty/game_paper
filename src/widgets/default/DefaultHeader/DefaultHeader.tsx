import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { NavigationContext } from "../../../core/ui/contexts/NavigationContext";
import styles from "./DefaultHeader.module.css";

export const DefaultHeader = () => {
  const navItems = useContext(NavigationContext);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>AppLogo</div>
      <nav className={styles.nav}>
        {navItems.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
