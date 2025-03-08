// GamesList.jsx
import React from 'react';
import GameItem from '../GameItem/GameItem';
import { GL_URL } from '../../../global';
import './GamesList.css';

const gamesData = [
  { id: 1, title: "Милки флай", image: `${GL_URL}/games/fb.svg` },
  { id: 2, title: "Название игры", image: `${GL_URL}/games/fb.svg` },
  { id: 3, title: "Название игры", image: "" },
  { id: 4, title: "Название игры", image: "" },
];

const GamesList = () => {
  return (
    <div className="games-list-container">
      {gamesData.map((game) => (
        <GameItem
          key={game.id}
          title={game.title}
          image={game.image}
          gameData={game} // Передаём объект с данными игры
        />
      ))}
    </div>
  );
};

export default GamesList;
