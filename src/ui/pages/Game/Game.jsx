import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import GameOver from '../../components/GameOver/GameOver';
import { loadGameData, GameAPI } from '../../../domain/gameUseCases';

import './Game.css';

const MAX_CANVAS_WIDTH = 428;
const BASE_ASPECT = 720 / MAX_CANVAS_WIDTH;

function Game() {
  const { gameName } = useParams();
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const { user, loadScore } = useContext(UserContext);
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
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const parentWidth = parent.clientWidth;
      const newWidth = Math.min(parentWidth, MAX_CANVAS_WIDTH);
      const newHeight = Math.floor(newWidth * BASE_ASPECT);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (gameConfig && canvas) {
      const gameInstance = new GameAPI(
        canvas,
        user.userName,
        gameConfig.gameName,
        gameConfig.gameUrl,
        () => {
          gameInstance.onFinish = (canvas, tmp, score) => {
            console.info("Игра завершена!");
            console.log(`Счет: ${score}`);
            setScore(parseInt(score));
            setGameOver(true);
          };
        }
      );
      gameInstance.start();
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
