import React from "react";
import TopCards from "../components/TopCards"
import MilkCoinsBar from "../components/MilkCoinsBar"
import "./Games.css";

const Games = () => {
  return (
    <div className="container">
      <TopCards />
      <MilkCoinsBar current={20} total={100} />

      <h1 className="games-title">Игры</h1>
      <div className="games-grid">
        <div className="card game-card">
          <img
            src="/icons/game-placeholder.png"
            alt="Игра 1"
            className="game-img"
          />
          <h2 className="game-title">Игра 1</h2>
        </div>
        <div className="card game-card">
          <img
            src="/icons/game-placeholder.png"
            alt="Игра 2"
            className="game-img"
          />
          <h2 className="game-title">Игра 2</h2>
        </div>
        <div className="card game-card">
          <img
            src="/icons/game-placeholder.png"
            alt="Игра 3"
            className="game-img"
          />
          <h2 className="game-title">Игра 3</h2>
        </div>
        <div className="card game-card">
          <img
            src="/icons/game-placeholder.png"
            alt="Игра 4"
            className="game-img"
          />
          <h2 className="game-title">Игра 4</h2>
        </div>
      </div>
    </div>
  );
};

export default Games;
