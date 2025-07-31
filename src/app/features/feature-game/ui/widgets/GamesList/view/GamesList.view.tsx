import React from "react";
import { GameItem } from "@/app/features/feature-game/ui/widgets/GameItem/GameItem";
import { GameItemSkeleton } from "@/app/features/feature-game/ui/widgets/GameItem/skeleton/GameItem.skeleton";
import styles from "@/app/features/feature-game/ui/widgets/GamesList/GamesList.module.css";
import { Box } from "@/app/shared-kernel/ui/components/primitives/Box";

interface Game {
  id: string | number;
  title: string;
  imageUrl?: string;
}

interface Props {
  games: Game[];
  isLoading: boolean;
  onItemClick: (title: string) => void;
  skeletonsCount?: number;
}

export const GamesListView = ({
  games,
  isLoading,
  onItemClick,
  skeletonsCount = 4,
}: Props) => {
  return (
    <Box className={styles["games-list"]}>
      {isLoading
        ? Array.from({ length: skeletonsCount }).map((_, index) => (
            <GameItemSkeleton key={`skeleton-${index}`} />
          ))
        : games.map((game) => (
            <GameItem
              key={game.id}
              title={game.title}
              imageUrl={game.imageUrl}
              onClick={onItemClick}
            />
          ))}
    </Box>
  );
};
