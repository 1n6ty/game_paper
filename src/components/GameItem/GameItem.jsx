// GameItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameItem.css';

const GameItem = ({ title, image, gameData }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Здесь формируется путь для навигации.
    // Например, если маршрут игры выглядит так: /games/:id
    navigate(`/games/${gameData.id}`);
  };

  return (
    <div className="game-item" onClick={handleClick}>
      <div className="game-item-top">
        {image ? (
          <img src={image} alt={title} className="game-item-img" />
        ) : (
          <div className="game-item-placeholder" />
        )}
      </div>
      <div className="game-item-bottom">
        <span className="game-item-title">{title}</span>
      </div>
    </div>
  );
};

export default GameItem;
