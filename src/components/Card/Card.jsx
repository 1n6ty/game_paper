import React from 'react';
import './Card.css';

const Card = ({
  variant = 'default',
  title,
  text,
  image,
  imagePosition,
  qrIconPaths, // Ожидается строка с d-атрибутом для svg path
  children, }) => {
  return (
    <div className={`card card--${variant}`}>
      <div className="card-header">
        {title && <h2 className="card-title">{title}</h2>}
        {qrIconPaths && (
          <div className="card-qr">
            <button
              className={`card-qr-button card-qr-button--${variant}`}
            >
              <svg
                className="card-qr-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                {qrIconPaths.map((d, index) => (
                  <path key={index} d={d} />
                ))}
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="card-body">
        {text && <p className="card-text">{text}</p>}
        {children}
      </div>
      {image && imagePosition === 'bottom-right' && (
        <img src={image} alt="Card visual" className="card-image-bottom-right" />
      )}
      {image && imagePosition === 'top-right' && (
        <img src={image} alt="Card visual" className="card-image-top-right" />
      )}
    </div>
  );
};

export default Card;
