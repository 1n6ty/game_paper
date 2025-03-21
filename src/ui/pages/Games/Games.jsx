import React from 'react';
import TopCards from '../../components/TopCards/TopCards';
import ScoreBar from '../../components/ScoreBar/ScoreBar';
import Card from '../../components/Card/Card';
import GamesList from '../../components/GamesList/GamesList';


const Games = () => {
  return (
    <div className="container">
      <TopCards />
      <ScoreBar />

      <Card
        variant="white"
        title="Игры"
        text="Сканируй код «Честный знак», чтобы открыть новую игру и участвовать в розыгрыше"
        enableQr={true}
      >
      </Card>

      <GamesList />
    </div>
  );
};

export default Games;
