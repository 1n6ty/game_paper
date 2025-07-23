import "./GameItem.css";

interface GameItemProps {
  title: string;
  image: string;
  onClick: (title: string) => void; 
}

export default function GameItem({ 
  title,
  image,
  onClick
}: GameItemProps) {
  return (
    <div className="game-item" onClick={() => onClick(title)}>
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