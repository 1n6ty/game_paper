import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import GameOver from '../../components/GameOver/GameOver';
import { loadGameData, GameAPI } from '../../../domain/gameUseCases';

import './Game.css';


function Game() {
  const { gameName } = useParams();
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const { user } = useContext(UserContext);
  const [gameConfig, setGameConfig] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadGameData(gameName)
      .then(config => {
        setGameConfig(config);
      })
      .catch(error => {
        console.error("Ошибка загрузки данных игры:", error);
      });
  }, [gameName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (gameConfig && canvas) {
      const gameInstance = new GameAPI(
        canvas,
        user.userName,
        gameConfig.gameName,
        gameConfig.gameUrl,
        () => {
          gameInstance.start();

          gameInstance.onFinish = (canvas, tmp, score) => {
            console.info("Игра завершена!");
            console.log(`Счет: ${score}`);
            setScore(parseInt(score));
            setGameOver(true);
          };
        }
      );
      gameInstanceRef.current = gameInstance;
    }
  }, [gameConfig, user]);

  const handleRestart = () => {
    if (gameInstanceRef.current)
      gameInstanceRef.current.start();

    setGameOver(false);
  };

  const handleExit = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="game-container">
      <canvas ref={canvasRef} className="game-canvas"></canvas>
      {gameOver && (
        <GameOver
          score={score}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </div>
  );
}

export default Game;
