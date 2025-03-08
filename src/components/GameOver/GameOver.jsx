import React from 'react';
import './GameOver.css'; // Стили для оверлея

const GameOver = ({ score, onRestart, onExit }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h2>Игра окончена!</h2>
        <p>Вы набрали: {score} очков</p>
        <button onClick={onRestart}>Начать заново</button>
        <button onClick={onExit}>Выйти</button>
      </div>
    </div>
  );
};

export default GameOver;
