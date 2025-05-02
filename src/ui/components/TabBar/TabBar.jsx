import { NavLink } from "react-router-dom";
import "./TabBar.css";

export default function TabBar({ tabs }) {
  return (
    <nav className="tab-bar">
      {Object.entries(tabs).map(([path, label]) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            isActive ? "tab-bar__item tab-bar__item--active" : "tab-bar__item"
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}