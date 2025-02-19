import React from "react";
import "./MilkCoinsBar.css";

const MilkCoinsBar = ({ current = 20, total = 1000 }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="milkcoins-bar">
      {/* Иконка стакана */}
      <img
        src="/icons/milk_glass.svg"
        alt="Стакан молока"
        className="milkcoins-icon"
      />

      <div className="milkcoins-info">
        {/* Первая строка: «МилкКоины» слева, «20/100» справа */}
        <div className="milkcoins-row">
          <span className="milkcoins-title">МилкКоины</span>
          <span className="milkcoins-value">
            {current} / {total}
          </span>
        </div>

        {/* Вторая строка: Прогресс-бар */}
        <div className="milkcoins-progress-bg">
          <div
            className="milkcoins-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MilkCoinsBar;
