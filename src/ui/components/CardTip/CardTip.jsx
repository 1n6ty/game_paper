import PropTypes from "prop-types";
import "./CardTip.css";

export default function CardTip({ 
  title,
  text,
  image 
}) {
  return (
    <div className="card-tip">
      {title && <h2 className="card-tip-title">{title}</h2>}
      {text && (
        <div className="card-tip-text-container">
          <p className="card-tip-text">{text}</p>
        </div>
      )}
      {image && (
        <img src={image} alt="Корова" className="card-tip-cow-img" />
      )}
    </div>
  );
}

CardTip.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired
};
