import PropTypes from "prop-types";
import "./TryAgainPopup.css";

export default function TryAgainPopup({ 
  text,
  onTryAgain
}) {
  return (
    <div className="try-again-popup__overlay">
      <div className="try-again-popup__container">
        <h2 className="try-again-popup__text">{text}</h2>
        <button className="try-again-popup__btn" onClick={onTryAgain}>
          <p className="try-again-popup__btn-text">Повторить попытку</p>
        </button>
      </div>
    </div>
  );
}

TryAgainPopup.propTypes = {
  text: PropTypes.string.isRequired,
  onTryAgain: PropTypes.func.isRequired
};