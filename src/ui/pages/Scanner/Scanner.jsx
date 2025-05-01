import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getScoreByDatamatrix } from "../../../domain/scannerUseCases";
import { BrowserDatamatrixCodeReader, BarcodeFormat } from "@zxing/library";
import TryAgainPopup from "../../components/TryAgainPopup/TryAgainPopup";
import "./Scanner.css";

const SCAN_INTERVAL = 500;

export default function Scanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const { authRawData } = useContext(UserContext);

  const scanFrame = useCallback(
    async codeReader => {
      if (!canvasRef.current || !videoRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const dataUrl = canvas.toDataURL();
        const img = new Image();
        img.src = dataUrl;
        await new Promise(resolve => {
          img.onload = resolve;
        });
        const result = await codeReader.decodeFromImage(img);
        if (result) {
          const text = result.getText();
          const { score, path } = await getScoreByDatamatrix(authRawData, text);
          if (typeof score === "number") {
            console.log(`Получено очков: ${score}`);
          }

          if (path) {
            clearInterval(intervalRef.current);
            setVideoPath(path);
          }

          console.log(text);
        }
      } catch (e) {
        // Если ошибка декодирования, просто продолжаем сканирование
      }
    },
    [authRawData]
  );

  const startCameraAndScanner = useCallback(async() => {
    try {
      setIsError(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const codeReader = new BrowserDatamatrixCodeReader(BarcodeFormat.DATA_MATRIX);
      intervalRef.current = setInterval(() => scanFrame(codeReader), SCAN_INTERVAL);
    } catch (err) {
      console.error("Ошибка доступа к камере или инициализации сканера:", err);
      setIsError(true);
    }
  }, [scanFrame]);

  useEffect(() => {
    startCameraAndScanner();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [startCameraAndScanner]);

  const handleVideoEnd = () => {
    setVideoPath(null);
    startCameraAndScanner();
  };

  return (
    <div className="scanner-container">
      <video ref={videoRef} className="camera-video" playsInline muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {videoPath && (
        <video
          src={videoPath}
          className="playback-video"
          autoPlay
          onEnded={handleVideoEnd}
          playsInline
        />
      )}
      <div className="overlay">
        <div className="overlay-top" />
        <div className="overlay-bottom" />
        <div className="overlay-left" />
        <div className="overlay-right" />
      </div>
      <div className="scanner-frame">
        <div className="frame-large" />
        <div className="frame-small" />
      </div>
      <div className="scanner-header">
        <h2 className="scanner-title">Сканер</h2>
        <p className="scanner-subtitle">
          Сканируй код, чтобы открыть новую игру, получить баллы и участвовать в розыгрыше
        </p>
      </div>
      <div className="scanner-instruction">Наведи камеру на код</div>
      {isError && (
        <TryAgainPopup
          text={"Не удалось подключиться к камере"}
          onTryAgain={startCameraAndScanner}
        />
      )}
    </div>
  );
}
