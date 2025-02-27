import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

const Card = ({
  variant = 'default',
  title,
  text,
  textSize = 'default',
  image,
  imagePosition,
  qrIconPaths, // Ожидается строка с d-атрибутом для svg path
  children }) => {
  const hasRightImage =
    image && (imagePosition === 'top-right' || imagePosition === 'bottom-right');
  var cardBodyExtraClass;
  if (qrIconPaths)
    cardBodyExtraClass = 'card-body-with-qr';
  else if (hasRightImage)
    cardBodyExtraClass = 'card-body-with-right-image';
  else
    cardBodyExtraClass = '';


  const navigate = useNavigate();

  const handleQrClick = () => {
    navigate('/scanner');
  };
  return (
    <div className={`card card--${variant}`}>
      <div className="card-header">
        {title && <h2 className={`card-title card-title--${textSize}`}>{title}</h2>}
        {qrIconPaths && (
          <div className="card-qr" onClick={handleQrClick}>
            <button
              className={`card-qr-button card-qr-button--${variant}`}
            >
              <svg
                className="card-qr-icon"
                width="22"
                height="22"
                viewBox="0 0 22 22"
              >
                {qrIconPaths.map((d, index) => (
                  <path key={index} d={d} />
                ))}
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className={`card-body ${cardBodyExtraClass}`}>
        {text && <p className="card-text">{text}</p>}
        {children}
      </div>
      {
        image && imagePosition === 'bottom-right' && (
          <img src={image} alt="Card visual" className="card-image-bottom-right" />
        )
      }
      {
        image && imagePosition === 'top-right' && (
          <img src={image} alt="Card visual" className="card-image-top-right" />
        )
      }
    </div >
  );
};

export default Card;
