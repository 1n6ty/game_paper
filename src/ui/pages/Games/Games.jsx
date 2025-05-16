import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Profile from "../../components/Profile/Profile";
import Card from "../../components/Card/Card";
import GamesList from "../../components/GamesList/GamesList";

import { loadGames } from "../../../domain/gameUseCases";
import { TEST } from "../../../global";

import "./Games.css";

export default function Games() {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshGames = useCallback(() => {
    setLoading(true);
    loadGames()
      .then(data => {
        const arr = Object.keys(data).map((gameName, index) => ({
          id: String(index + 1),
          title: gameName,
          image: data[gameName],
        }));
        setGamesData(arr);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки игр:", error);
        if (TEST) {
          console.log("Установка тестовых обложек игр.");
          setGamesData([
            { id: "1", title: "Милки флай", image: `/games/milkyFly_cover.svg` },
            { id: "2", title: "Трекер здоровья", image: `/games/healthTracker_cover.svg` },
          ]);

          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    refreshGames();

    const handleOnline = () => {
      console.log("Соединение с интернетом восстановлено, перезагружаем список игр.");
      refreshGames();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [refreshGames]);

  const navigate = useNavigate();

  const handleItemClick = title => {
    navigate(`/games/${title}`);
  };

  return (
    <div className="games-container">
      <Profile />
      <Card 
        variant="white" 
        title="Игры" 
        enableQr={true}
      >
        <div className="games-container__card-text">
          Сканируй код «Честный знак», чтобы открыть новую игру и участвовать в розыгрыше
        </div>
      </Card>
      <GamesList 
        gamesData={gamesData}
        loading={loading}
        onItemClick={handleItemClick}
      />
    </div>
  );
}
