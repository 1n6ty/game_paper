import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import GameOver from "../../components/GameOver/GameOver";
import GameLoading from "../../components/GameLoading/GameLoading";
import { loadGameData, GameAPI } from "../../../domain/gameUseCases";

import "./Game.css";

export default function Game() {
  const { gameName } = useParams();
  const canvasRef = useRef(null);
  const gameInstanceRef = useRef(null);
  const { authRawData } = useContext(UserContext);

  const [gameConfig, setGameConfig] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoading, setShowLoading] = useState(true);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    return () => gameInstanceRef?.current?.finish({});
  }, []);

  useEffect(() => {
    let tick = null;
    let onlineListener = null;

    const startProgressTick = () => {
      tick = setInterval(() => {
        setLoadingProgress(prev => {
          let increment;
          if (prev < 70) {
            increment = Math.random() * 5;
          } else if (prev < 90) {
            increment = Math.random() * 2;
          } else {
            increment = 0;
          }

          const newValue = Math.min(prev + increment, 90);
          console.log(`Загрузка: ${newValue.toFixed(0)}%`);
          return newValue;
        });
      }, 300);
    };

    const attemptLoadGame = () => {
      if (!tick) {
        startProgressTick();
      }

      loadGameData(gameName)
        .then(config => {
          clearInterval(tick);
          tick = null;
          setLoadingProgress(100);
          setGameConfig(config);
          if (onlineListener) {
            window.removeEventListener("online", onlineListener);
            onlineListener = null;
          }
        })
        .catch(error => {
          console.error("Ошибка загрузки данных игры:", error);

          if (!onlineListener) {
            onlineListener = () => {
              console.log("Соединение с интернетом восстановлено, повторная загрузка игры.");
              attemptLoadGame();
            };

            window.addEventListener("online", onlineListener);
          }
        });
    };

    attemptLoadGame();

    return () => {
      if (tick) clearInterval(tick);
      if (onlineListener) window.removeEventListener("online", onlineListener);
    };
  }, [gameName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (gameConfig && canvas) {
      const gameInstance = new GameAPI(
        canvas,
        authRawData,
        gameConfig.gameName,
        gameConfig.gameUrl,
        () => {
          gameInstance.start();

          gameInstance.onFinish = (canvas, tmp, score) => {
            console.info("Игра завершена!");
            console.log(`Счет: ${score}`);
            setScore(parseInt(score, 10));
            setGameOver(true);
          };
        },
        () => {
          setShowLoading(false);
        }
      );
      gameInstanceRef.current = gameInstance;
    }
  }, [gameConfig, authRawData]);

  const handleRestart = () => {
    if (gameInstanceRef.current) gameInstanceRef.current.start();
    setGameOver(false);
  };

  const handleExit = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="game-container">
      {showLoading && (
        <GameLoading 
          progress={Math.round(loadingProgress)} 
        />
      )}
      <canvas 
        ref={canvasRef} 
        className="game-canvas" 
      />
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
