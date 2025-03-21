import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

import { GL_URL } from '../../../global';
import './ScoreBar.css';


const ScoreBar = () => {
  const { score, totalScore } = useContext(UserContext);

  const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;

  return (
    <div className="score-bar">
      <img
        src={`${GL_URL}milk_glass.svg`}
        alt="Стакан молока"
        className="score-icon"
      />

      <div className="score-info">
        <div className="score-row">
          <span className="score-title">Ламбиксы</span>
          <span className="score-value">
            {score} / {totalScore}
          </span>
        </div>

        <div className="score-progress-bg">
          <div
            className="score-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreBar;
