import React, { useState, useEffect } from 'react';
import GameItem from '../GameItem/GameItem';
import { GL_URL } from '../../../global';
import { loadGames } from '../../../domain/gameUseCases';
import './GamesList.css';

import { TEST } from "../../../global";


const GamesList = () => {
  const [gamesData, setGamesData] = useState([]);

  useEffect(() => {
    loadGames()
      .then(data => {
        // data: { "MilkyFly": "cover1.svg", "HealthTracker": "cover2.svg", ... }
        // Преобразуем объект в массив объектов с ключами id, title и image.
        const arr = Object.keys(data).map((gameName, index) => ({
          id: String(index + 1),
          title: gameName,
          image: data[gameName]
        }));
        setGamesData(arr);
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
      });
  }, []);

  return (
    <div className="games-list-container">
      {gamesData.map(game => (
        <GameItem
          key={game.id}
          title={game.title}
          image={game.image}
        />
      ))}
    </div>
  );
};

export default GamesList;
