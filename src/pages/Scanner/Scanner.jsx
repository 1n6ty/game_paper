import React from "react";
import TopCards from "../../components/TopCards/TopCards"
import Card from "../../components/Card/Card";
import ScannerButton from "../../components/ScannerButton/ScannerButton";


const Scanner = () => {
  const handleScan = () => {
    console.log("Открыть сканер...");
    // const tg = window.Telegram.WebApp;

    // Открываем Mini App
    // tg.expand(); // Разворачивает на весь экран

    // document.body.style.backgroundColor = tg.themeParams.bg_color;
    // document.body.style.color = tg.themeParams.text_color;
  };
  return (
    <div className="container">
      {/* Верхние карточки */}
      <TopCards />

      {/* Основные карточки */}
      <Card
        variant="light-blue"
        title="Сканер"
        text="Сканируй код “Честный знак”, чтобы открыть новую игру и участвовать в розыгрыше"
      />
    </div>
  );
};

export default Scanner;
