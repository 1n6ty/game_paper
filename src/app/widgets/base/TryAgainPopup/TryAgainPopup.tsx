import "./TryAgainPopup.css";

interface TryAgainPopupProps {
  text: string;
  onTryAgain: () => void;
}

export default function TryAgainPopup({ 
  text,
  onTryAgain
}: TryAgainPopupProps) {
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