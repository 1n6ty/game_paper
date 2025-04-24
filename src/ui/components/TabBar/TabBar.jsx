import React from 'react';
import { NavLink } from 'react-router-dom';
import './TabBar.css';

export default function TabBar({ tabs }) {
  return (
    <nav className="tab-bar">
      {Object.entries(tabs).map(([path, label]) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            isActive ? 'tab-bar-item tab-bar-item--active' : 'tab-bar-item'
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}