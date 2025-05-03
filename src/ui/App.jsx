import { useEffect } from "react";
import { useRoutes } from "react-router-dom";

import BottomNavBar from "./components/BottomNavBar/BottomNavBar";

import Home from "./pages/Home/Home";
import Games from "./pages/Games/Games";
import Scanner from "./pages/Scanner/Scanner";
import Game from "./pages/Game/Game";

import { UserProvider } from "./contexts/UserContext";

import HomeIcon from "../assets/icons/Home.svg?react";
import GamesIcon from "../assets/icons/Games.svg?react";
import ScannerIcon from "../assets/icons/Qr.svg?react";

import "./App.css";

const routeConfig = [
  {
    path: "/",
    element: <Home />,
    label: "Главная",
    svgr: <HomeIcon />,
    showInTab: true,
  },
  {
    path: "/games",
    element: <Games />,
    label: "Игры",
    svgr: <GamesIcon />,
    showInTab: true,
  },
  {
    path: "/scanner",
    element: <Scanner />,
    label: "Сканер",
    svgr: <ScannerIcon />,
    showInTab: true,
  },
  {
    path: "/games/:gameName",
    element: <Game />,
    // не отображаем в табах
    showInTab: false,
  },
];

export default function App() {
  const element = useRoutes(
    routeConfig.map(r => ({ path: r.path, element: r.element }))
  );

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.lockOrientation();
      return () => {
        window.Telegram.WebApp.unlockOrientation();
      };
    }
  }, []);

  const tabs = routeConfig.filter(route => route.showInTab);

  return (
    <UserProvider>
      <div className="app-container">
        <main className="content">
          {element}
        </main>

        <BottomNavBar tabs={tabs} />
      </div>
    </UserProvider>
  );
}
