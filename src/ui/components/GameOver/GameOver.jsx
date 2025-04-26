import "./GameOver.css";

export default function GameOver({ 
  score = 0,
  onExit,
  onRestart
}) {
  return (
    <div className="gameover-overlay">
      <div className="gameover-container">
        <h2 className="gameover-title">Игра окончена!</h2>
        <div className="gameover-score-section">
          <div className="gameover-score-label">
            Количество<br />набранных ламбиксов:
          </div>
          <div className="gameover-score-value">
            {score}
          </div>
        </div>
        <div className="gameover-buttons">
          <button className="gameover-btn exit-btn" onClick={onExit}>
            <p className="gameover-btn-text">Выйти</p>
          </button>
          <button className="gameover-btn restart-btn" onClick={onRestart}>
            <p className="gameover-btn-text">Начать заново</p>
          </button>
        </div>
      </div>
    </div>
  );
}

;