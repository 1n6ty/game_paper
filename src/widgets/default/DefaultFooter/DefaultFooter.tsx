import React from "react";
import styles from "./styles.module.css";

/**
 * Стандартный подвал приложения.
 */
export const DefaultFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>© {currentYear} My Awesome Company. All rights reserved.</p>
    </footer>
  );
};
