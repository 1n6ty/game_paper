import React from 'react';
import './CardTip.css';

const CardTip = ({ title, text, cowImage }) => {
  return (
    <div className="card-tip">
      {title && <h2 className="card-tip-title">{title}</h2>}
      {text && (
        <div className="card-tip-text-container">
          <p className="card-tip-text">{text}</p>
        </div>
      )}
      {cowImage && (
        <img src={cowImage} alt="Корова" className="card-tip-cow" />
      )}
    </div>
  );
};

export default CardTip;
