import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TabBar from "./components/TabBar/TabBar";

import Home from "./pages/Home/Home";
import Games from "./pages/Games/Games";
import Scanner from "./pages/Scanner/Scanner";
import Game from "./pages/Game/Game";

import { UserProvider } from "./contexts/UserContext";

import "./App.css";

export default function App() {

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.lockOrientation();
      return () => {
        window.Telegram.WebApp.unlockOrientation();
      };
    }
  }, []);

  return (
    <UserProvider>
      <div className="app-container">
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/games/:gameName" element={<Game />} />
          </Routes>
        </main>
        
        <TabBar />
      </div>
    </UserProvider>
  );
}