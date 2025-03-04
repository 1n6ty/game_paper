import React, { useEffect, useRef, useState } from 'react';
import './Scanner.css';

const Scanner = () => {
  const videoRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Ошибка доступа к камере:", err);
        setErrorMsg("Не удалось получить доступ к камере!");
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="scanner-container">
      <video ref={videoRef} className="camera-video" playsInline muted />

      <div className="overlay">
        <div className="overlay-top"></div>
        <div className="overlay-bottom"></div>
        <div className="overlay-left"></div>
        <div className="overlay-right"></div>
      </div>

      <div className="scanner-frame">
        <div className="frame-large"></div>
        <div className="frame-small"></div>
      </div>

      <div className="scanner-header">
        <h2 className="scanner-title">Сканер</h2>
        <p className="scanner-subtitle">
          Сканируй код, чтобы открыть новую игру, получить баллы и участвовать в розыгрыше
        </p>
      </div>

      <div className="scanner-instruction">
        Наведи камеру на код
      </div>

      {errorMsg && <div className="error-msg">{errorMsg}</div>}
    </div>
  );
};

export default Scanner;
