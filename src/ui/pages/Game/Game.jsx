import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import GameOver from "../../components/GameOver/GameOver";
import GameLoading from "../../components/GameLoading/GameLoading";
import { loadGameData, GameAPI } from "../../../domain/gameUseCases";

import "./Game.css";

const LOADING_DELAY = 600;  // миллисекунды

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
    
    // эмулируем прогресс пока ждём ответа
    const tick = setInterval(() => {
      setLoadingProgress(p => Math.min(p + 10, 100));
      console.log("Загрузка игры...");
    }, 200);
 
    loadGameData(gameName)
      .then(config => {
        clearInterval(tick);
        setLoadingProgress(100);
        setGameConfig(config);
      })
      .catch(error => {
        clearInterval(tick);

        // после завершения загрузки небольшая пауза, чтобы пользователь увидел 100%
        setTimeout(() => setShowLoading(false), LOADING_DELAY);

        console.error("Ошибка загрузки данных игры:", error);
      });
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
            setScore(parseInt(score));
            setGameOver(true);
          };
        },
        () => {
          // после загрузки всех ассетов скрываем экран загрузки
          setShowLoading(false);
        }
      );
      gameInstanceRef.current = gameInstance;
    }
  }, [gameConfig, authRawData]);

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
      {showLoading && <GameLoading progress={loadingProgress} />}
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