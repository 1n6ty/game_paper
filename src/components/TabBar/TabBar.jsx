import React from 'react';
import { NavLink } from 'react-router-dom';

// TODO change the paths
import HomeIcon from '../../assets/icons/Home.svg?react';
import GamesIcon from '../../assets/icons/Games.svg?react'
import ScannerIcon from '../../assets/icons/Qr.svg?react';

import './TabBar.css';


const TabBar = () => {
  return (
    <nav className="tabbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <HomeIcon className="tab-icon" />
        <span className="tab-text">Главная</span>
      </NavLink>
      <NavLink
        to="/games"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <GamesIcon className="tab-icon" />
        <span className="tab-text">Игры</span>
      </NavLink>
      <NavLink
        to="/scanner"
        className={({ isActive }) => (isActive ? "tab active" : "tab")}
      >
        <ScannerIcon className="tab-icon" />
        <span className="tab-text">Сканер</span>
      </NavLink>
    </nav>
  );
};

export default TabBar;
