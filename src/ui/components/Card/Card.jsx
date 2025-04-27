import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ScannerIcon from "../../../assets/icons/Qr.svg?react";

import "./Card.css";

export default function Card({
  variant = "default",
  title,
  text,
  textSize = "default",
  image,
  imagePosition,
  enableQr,
  enableQrGap = true,
  children
}) {
  const hasRightImage =
    image && (imagePosition === "top-right" || imagePosition === "bottom-right");
  var cardBodyExtraClass;
  if ((enableQr === true) && (enableQrGap === true))
    cardBodyExtraClass = "card-body-with-qr";
  else if (hasRightImage)
    cardBodyExtraClass = "card-body-with-right-image";
  else
    cardBodyExtraClass = "";

  const navigate = useNavigate();

  const handleQrClick = () => {
    navigate("/scanner");
  };

  return (
    <div className={`card card--${variant}`}>
      <div className="card-header">
        {title && <h2 className={`card-title card-title--${textSize}`}>{title}</h2>}
        {enableQr && (
          <div className="card-qr" onClick={handleQrClick}>
            <button
              className={`card-qr-button card-qr-button--${variant}`}
            >
              <ScannerIcon className="card-qr-icon" />
            </button>
          </div>
        )}
      </div>
      <div className={`card-body ${cardBodyExtraClass}`}>
        {text && <p className="card-text">{text}</p>}
        {children}
      </div>
      {
        image && imagePosition === "bottom-right" && (
          <img src={image} alt="Card visual" className="card-image-bottom-right" />
        )
      }
      {
        image && imagePosition === "top-right" && (
          <img src={image} alt="Card visual" className="card-image-top-right" />
        )
      }
    </div >
  );
}

Card.propTypes = {
  variant: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  textSize: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  imagePosition: PropTypes.string.isRequired,
  enableQr: PropTypes.bool.isRequired,
  enableQrGap: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};