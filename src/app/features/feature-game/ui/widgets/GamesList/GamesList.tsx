import React from "react";
import { useNavigate } from "react-router-dom";
import { GamesListView } from "./view/GamesList.view";
// В будущем эти хуки будут здесь
// import { useGamesQuery } from 'entities/game';

// Моковые данные для примера
const MOCK_GAMES = [
  { id: "1", title: "Милки флай", imageUrl: `/games/milkyFly_cover.svg` },
  {
    id: "2",
    title: "Трекер здоровья",
    imageUrl: `/games/healthTracker_cover.svg`,
  },
];
const MOCK_LOADING = false;

interface Props {
  // Контейнер может принимать внешние пропсы, если это необходимо
}

export const GamesList = (props: Props) => {
  const navigate = useNavigate();

  // В будущем здесь будет:
  // const { data: games, isLoading } = useGamesQuery();
  const games = MOCK_GAMES;
  const isLoading = MOCK_LOADING;

  const handleItemClick = (title: string) => {
    navigate(`/games/${title}`);
  };

  return (
    <GamesListView
      games={games || []}
      isLoading={isLoading}
      onItemClick={handleItemClick}
    />
  );
};
