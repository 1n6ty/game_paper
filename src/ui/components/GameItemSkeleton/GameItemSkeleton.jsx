import React from 'react';
import './GameItemSkeleton.css';

const GameItemSkeleton = () => {
  return (
    <div className="game-item skeleton">
      <div className="game-item-top">
        <div className="skeleton-box" />
      </div>
      <div className="game-item-bottom">
        <div className="skeleton-text" />
      </div>
    </div>
  );
};

export default GameItemSkeleton;
