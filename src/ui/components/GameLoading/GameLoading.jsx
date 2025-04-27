import PropTypes from "prop-types";
import BottleSvg from "../../../assets/Bottle.svg?react";
import { GL_URL } from "../../../global";
import "./GameLoading.css";

export default function GameLoading({ 
  progress
}) {
  return (
    <div className="game-loading">
      <div className="game-loading__bg" />
      <div className="game-loading__circle">
        <div className="game-loading__bottle-container">
          
          <div
            className="game-loading__fill"
            style={{ 
              height: `${progress}%`,
              maskImage: `url('${GL_URL}bottle-clip.svg')`,
              WebkitMaskImage: `url('${GL_URL}bottle-clip.svg')`
            }}
          />

          <BottleSvg className="game-loading__bottle" />

          <div className="game-loading__percent">{progress}%</div>
        </div>
      </div>
    </div>
  );
}

GameLoading.propTypes = {
  progress: PropTypes.number.isRequired
};