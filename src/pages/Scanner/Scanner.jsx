import React from "react";
import TopCards from "../../components/TopCards/TopCards"
import Card from "../../components/Card/Card";
import ScannerButton from "../../components/ScannerButton/ScannerButton";

const Scanner = () => {
  const handleScan = () => {
    console.log("Открыть сканер...");
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

      <ScannerButton onClick={handleScan()} />

    </div>
  );
};

export default Scanner;
