import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import "./BottomNavBar.css";

/**
 * BottomNavBar component renders navigation tabs based on passed-in items.  
 * It has animation of switching elements by default. Just color transition.
 * @param {{
 *   tabs: Array<{
 *     path: string,
 *     element: React.ReactNode,
 *     label: string,
 *     svgr: React.ReactNode,
 *   }>
 * }} props
 */
export default function BottomNavBar({ 
  tabs 
}) {
  return (
    <nav className="bottom-nav-bar">
      {tabs.map(({ path, label, svgr }, index) => (
        <NavLink
          key={path || index}
          to={path}
          className={({ isActive }) => 
            isActive ? "bottom-nav-bar__tab bottom-nav-bar__tab--active" : "bottom-nav-bar__tab"}
        >
          {svgr && React.cloneElement(svgr, { className: "bottom-nav-bar__tab-icon" })}
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
