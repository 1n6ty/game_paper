import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MilkyFly from '../../components/Games/MilkyFly/MilkyFly';
import HealthTracker from '../../components/Games/HealthTracker/HealthTracker';

const Game = () => {
  const { id } = useParams();
  // const navigate = useNavigate();

  let gameComponent = null;

  if (id === "1") {
    gameComponent = <MilkyFly />;
  } else if (id === "2") {
    gameComponent = <HealthTracker />
  }

  if (!gameComponent) {
    return <div>Игра не найдена</div>;
  }

  return (
    <div className="game-window">
      {gameComponent}
    </div>
  );
};

export default Game;
