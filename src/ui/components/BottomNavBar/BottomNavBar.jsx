import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import "./BottomNavBar.css";

/**
 * BottomNavBar component renders navigation tabs based on passed-in items.
 *
 * It displays a set of tabs at the bottom of the interface and provides
 * a simple color transition animation when switching between different tabs.
 *
 * @component
 *
 * @param {Object} props
 * @param {Array<Object>} props.tabs - Array of tab objects.
 * @param {string} props.tabs[].path - The route path the tab should link to.
 * @param {React.ReactNode} [props.tabs[].element] - An optional React element associated with the tab.
 * @param {string} props.tabs[].label - The display label for the tab.
 * @param {React.ReactNode} [props.tabs[].svgr] - An optional SVG React element to display as an icon.
 *
 * @returns {React.ReactElement} The rendered BottomNavBar component.
 */
export default function BottomNavBar({ tabs }) {
  return (
    <nav className="bottom-nav-bar">
      {tabs.map(({ path, label, svgr }, index) => (
        <NavLink
          key={path || index}
          to={path}
          className={({ isActive }) =>
            isActive
              ? "bottom-nav-bar__tab bottom-nav-bar__tab--active"
              : "bottom-nav-bar__tab"
          }
        >
          {svgr &&
            React.cloneElement(svgr, {
              className: "bottom-nav-bar__tab-icon",
            })}
          <span className="bottom-nav-bar__tab-text">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

BottomNavBar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      element: PropTypes.node,
      label: PropTypes.string.isRequired,
      svgr: PropTypes.node,
    })
  ).isRequired,
};
