import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getScoreAndPathByDatamatrix } from "../../../domain/scannerUseCases";
import { BrowserDatamatrixCodeReader, BarcodeFormat } from "@zxing/library";

import TryAgainPopup from "../../components/TryAgainPopup/TryAgainPopup";
import ScanPrize from "../../components/ScanPrize/ScanPrize";

import "./Scanner.css";

const SCAN_INTERVAL = 900;

const MSG_SCAN_IDLE = "Наведи камеру на код";
const MSG_SCANNIG = "Сканируем...";
const MSG_SCANNING_DONE = "Просканировано!";

export default function Scanner() {
  console.log("Scanner: v2");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(
    () => localStorage.getItem("cameraAllowed") === "true"
  );
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState(MSG_SCAN_IDLE);
  const [isError, setIsError] = useState(false);
  const [videoPlayerPath, setVideoPlayerPath] = useState(null);
  const { authRawData } = useContext(UserContext);

  const scanFrame = useCallback(async codeReader => {
    if (!canvasRef.current || !videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const scanSize = 90;           // соответствует --scan-size: 90px
    const frameOffset = 36;        // соответствует --scanner-frame-offset: 36px

    const areaWidth = scanSize;
    const areaHeight = scanSize;
    const sx = (video.videoWidth - areaWidth) / 2;
    const sy = video.videoHeight * 0.5 - scanSize / 2 + frameOffset;

    canvas.width = areaWidth;
    canvas.height = areaHeight;

    ctx.clearRect(0, 0, areaWidth, areaHeight);
    ctx.drawImage(
      video,
      sx, sy,
      areaWidth, areaHeight,
      0, 0,
      areaWidth, areaHeight
    );

    setMsg(MSG_SCANNIG);

    let result;

    const dataUrl = canvas.toDataURL();
    const img = new Image();
    img.src = dataUrl;
    await new Promise(resolve => {
      img.onload = resolve;
    });
    try {
      result = await codeReader.decodeFromImage(img);
    } catch (e) {
      console.log("Scanning,", e);
      setMsg(MSG_SCAN_IDLE);
    }

    try {
      if (result) {
        const text = result.getText();
        console.log(text);
        const { score: scoreData, path, scanned } = await getScoreAndPathByDatamatrix(authRawData, text);

        if (scanned) {
          // Клиентская ошибка 4xx: уже просканировано
          console.info("Уже просканировано");
          setMsg("Уже просканировано");
        } else {
          console.log(scoreData, path);
        
          if (path && scoreData) {
            setMsg(MSG_SCANNING_DONE);
            console.log(`Получено очков: ${scoreData}`);
            setScore(scoreData);
            clearInterval(intervalRef.current);
            setVideoPlayerPath(path);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [authRawData]);

  const attachStreamAndPlay = useCallback(async stream => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  }, []);

  const startScanning = useCallback(codeReader => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => scanFrame(codeReader), SCAN_INTERVAL);
  },
  [scanFrame]
  );  

  const startCameraAndScanner = useCallback(async() => {
    try {
      setIsError(false);

      const codeReader = new BrowserDatamatrixCodeReader(BarcodeFormat.DATA_MATRIX);

      // Если уже есть разрешение и сохранённый поток — сразу используем его
      if (hasCameraPermission && streamRef.current) {
        await attachStreamAndPlay(streamRef.current);
        startScanning(codeReader);
        return;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      // иначе запрашиваем поток
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      // запоминаем факт разрешения
      setHasCameraPermission(true);
      localStorage.setItem("cameraAllowed", "true");
      
      await attachStreamAndPlay(stream);
      startScanning(codeReader);
    } catch (err) {
      console.error("Ошибка доступа к камере или инициализации сканера:", err);
      setIsError(true);
    }
  }, [hasCameraPermission, attachStreamAndPlay, startScanning]);
  
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }  
    };
  }, []);

  useEffect(() => {
    startCameraAndScanner();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCameraAndScanner]);

  const handleVideoEnd = () => {
    setVideoPlayerPath(null);
    startCameraAndScanner();
  };

  return (
    <div className="scanner-container">
      <video ref={videoRef} className="camera-video" playsInline muted />
      <canvas ref={canvasRef} style={{ 
        display: "none",

        // для дебага
        // position: "absolute",
        // top: "0",
        // left: "0",
        // border: "2px dashed red",
        // "z-index": "10"
      }} />
      
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
      <div className="scanner-instruction">{msg}</div>

      {videoPlayerPath && (
        <div
          className="scan-prize-container"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,        // больше, чем 1
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScanPrize
            score={score}
            videoPlayerPath={videoPlayerPath}
            onVideoEnded={handleVideoEnd}
          />
        </div>
      )}

      {isError && (
        <TryAgainPopup
          text={"Не удалось подключиться к камере"}
          onTryAgain={startCameraAndScanner}
        />
      )}
    </div>
  );
}
