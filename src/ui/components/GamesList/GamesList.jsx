import React, { useState, useEffect } from 'react';
import GameItem from '../GameItem/GameItem';
import GameItemSkeleton from '../GameItemSkeleton/GameItemSkeleton';
import { GL_URL } from '../../../global';
import { loadGames } from '../../../domain/gameUseCases';
import './GamesList.css';
import { TEST } from "../../../global";

const GamesList = () => {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames()
      .then(data => {
        const arr = Object.keys(data).map((gameName, index) => ({
          id: String(index + 1),
          title: gameName,
          image: data[gameName]
        }));
        setGamesData(arr);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка загрузки игр:", error);
        if (TEST) {
          console.log("Установка тестовых обложек игр.");
          setGamesData([
            { id: "1", title: "Милки флай", image: `${GL_URL}games/milkyFly_cover.svg` },
            { id: "2", title: "Трекер здоровья", image: `${GL_URL}games/healthTracker_cover.svg` },
          ]);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="games-list-container">
      {
        loading
          ? [1, 2, 3, 4].map((i) => <GameItemSkeleton key={`skeleton-${i}`} />)
          : gamesData.map(game => (
            <GameItem key={game.id} title={game.title} image={game.image} />
          ))
      }
    </div>
  );
};

export default GamesList;
