import PropTypes from "prop-types";
import "./GameItem.css";

export default function GameItem({ 
  title,
  image,
  onClick
}) {
  return (
    <div className="game-item" onClick={() => onClick(title)}>
      <div className="game-item-top">
        {image ? (
          <img src={image} alt={title} className="game-item-img" />
        ) : (
          <div className="game-item-placeholder" />
        )}
      </div>
      <div className="game-item-bottom">
        <span className="game-item-title">{title}</span>
      </div>
    </div>
  );
}

GameItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};