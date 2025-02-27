import React, { useContext } from "react";
import { PointsContext } from '../../contexts/PointsContext';

import { GL_URL } from "../../../global"
import "./MilkCoinsBar.css";


const MilkCoinsBar = ({
  totalCoinsCount = 1000
}) => {
  const { points, updatePoints } = useContext(PointsContext);

  const percentage = totalCoinsCount > 0 ? (points / totalCoinsCount) * 100 : 0;

  return (
    <div className={`${GL_URL}milkcoins-bar`}>
      <img
        src="milk_glass.svg"
        alt="Стакан молока"
        className="milkcoins-icon"
      />

      <div className="milkcoins-info">
        <div className="milkcoins-row">
          <span className="milkcoins-title">Ламбиксы</span>
          <span className="milkcoins-value">
            {points} / {totalCoinsCount}
          </span>
        </div>

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
