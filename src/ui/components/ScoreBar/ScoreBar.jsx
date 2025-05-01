import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

import MilkGlassSvg from "../../../assets/MilkGlass.svg?react";

import "./ScoreBar.css";

export default function ScoreBar() {
  const { score, totalScore } = useContext(UserContext);

  const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;

  return (
    <div className="score-bar">
      <MilkGlassSvg className="score-bar__icon" />

      <div className="score-bar__info">
        <div className="score-bar__row">
          <span className="score-bar__title">Ламбиксы</span>
          <span className="score-bar__value">
            {score}/{totalScore}
          </span>
        </div>

        <div className="score-bar__progress--bg">
          <div
            className="score-bar__progress--fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

;