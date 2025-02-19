import React from "react";
import GameItem from "./../GameItem/GameItem";
import "./GamesList.css";

const gamesData = [
  { id: 1, title: "Название игры 1", image: "" },
  { id: 2, title: "Название игры 2", image: "" },
  { id: 3, title: "Название игры 3", image: "" },
  { id: 4, title: "Название игры 4", image: "" },
  // ... добавляйте игры по необходимости
];

const GamesList = () => {
  return (
    <div className="games-list-container">
      {gamesData.map((game) => (
        <GameItem key={game.id} title={game.title} image={game.image} />
      ))}
    </div>
  );
};

export default GamesList;
