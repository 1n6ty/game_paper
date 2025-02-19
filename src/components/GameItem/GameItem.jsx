import React from "react";
import "./GameItem.css";

const GameItem = ({ title, image }) => {
  return (
    <div className="game-item">
      {/* Верхняя часть карточки (изображение) */}
      <div className="game-item-top">
        {image ? (
          <img src={image} alt={title} className="game-item-img" />
        ) : (
          /* Если нет картинки, можно показать заливку */
          <div className="game-item-placeholder" />
        )}
      </div>

      {/* Нижняя часть карточки (название) */}
      <div className="game-item-bottom">
        <span className="game-item-title">{title}</span>
      </div>
    </div>
  );
};

export default GameItem;
