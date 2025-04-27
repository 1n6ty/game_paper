import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./GameItem.css";

export default function GameItem({ 
  title,
  image
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/games/${title}`);
  };

  return (
    <div className="game-item" onClick={handleClick}>
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
  image: PropTypes.string.isRequired
};