import React from "react";
import "./styles/MilkCoinsBar.css";

const MilkCoinsBar = ({ current = 20, total = 100 }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="card milkcoins-bar">
      {/* Иконка стакана */}
      <img
        src="/icons/glass_of_milk.svg"
        alt="Стакан молока"
        className="milkcoins-icon"
      />

      <div className="milkcoins-info">
        {/* Первая строка: «МилкКоины» слева, «20/100» справа */}
        <div className="milkcoins-row">
          <span className="title">МилкКоины</span>
          <span className="value">
            {current} / {total}
          </span>
        </div>

        {/* Вторая строка: Прогресс-бар */}
        <div className="progress-bg">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MilkCoinsBar;
