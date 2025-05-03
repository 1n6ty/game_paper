import GameItem from "../GameItem/GameItem";
import GameItemSkeleton from "../GameItemSkeleton/GameItemSkeleton";

import "./GamesList.css";

export default function GamesList({ gamesData, loading }) {
  return (
    <div className="games-list-container">
      {loading
        ? [1, 2, 3, 4].map(i => <GameItemSkeleton key={`skeleton-${i}`} />)
        : gamesData.map(game => (
          <GameItem key={game.id} title={game.title} image={game.image} />
        ))}
    </div>
  );
}
