import Profile from "../../components/Profile/Profile";
import Card from "../../components/Card/Card";
import GamesList from "../../components/GamesList/GamesList";

import "./Games.css";

export default function Games() {
  return (
    <div className="container">
      <Profile />

      <Card
        variant="white"
        title="Игры"
        enableQr={true}
      >
        <div className="games-card-text">
          Сканируй код «Честный знак», чтобы открыть новую игру и участвовать в розыгрыше
        </div>
      </Card>

      <GamesList />
    </div>
  );
}

;