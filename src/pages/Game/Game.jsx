import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MilkyFly from '../../components/Games/MilkyFly/MilkyFly';

const Game = () => {
  const { id } = useParams(); // получаем id игры из URL
  const navigate = useNavigate();

  let gameComponent = null;

  // Выбираем компонент игры по значению id.
  if (id === "1") {
    gameComponent = <MilkyFly />;
  }

  if (!gameComponent) {
    return <div>Игра не найдена</div>;
  }

  return (
    <div className="game-window">
      <button onClick={() => navigate(-1)}>Закрыть игру</button>
      {gameComponent}
    </div>
  );
};

export default Game;
