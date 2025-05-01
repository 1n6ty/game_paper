import { useContext } from "react";
import Profile from "../../components/Profile/Profile";
import Card from "../../components/Card/Card";
import CardTip from "../../components/CardTip/CardTip";
import CardReward from "../../components/CardReward/CardReward";
import { UserContext } from "../../contexts/UserContext";

import MilkExchangeSvg from "../../../assets/MilkExchange.svg?react";
import RewardItem1Svg from "../../../assets/RewardItem1.svg?react";
import RewardItem2Svg from "../../../assets/RewardItem2.svg?react";
import RewardItem3Svg from "../../../assets/RewardItem3.svg?react";
import MilkGlassSvg from "../../../assets/MilkGlass.svg?react";
import CowSvg from "../../../assets/Cow.svg?react";

import { GL_URL } from "../../../global";
import "./Home.css";

export default function Home() {
  const { totalScore, tickets } = useContext(UserContext);
  const factText = "Молоко очень полезное! Оно богато витаминами А, В6, В12, С, Е и др.";
  const startLambsCount = 30;

  const rewardCount1 = 10;
  const rewardCount2 = 20;
  const rewardCount3 = 30;

  return (
    <div className="home-container">
      <Profile />

      <Card
        variant="white"
        title="Правила игры"
      >
        <div className="home-card-text">
          <b>Сканируй код «Честный знак» на упаковках Ламбумизовского молока и получай ламбиксы!</b>
          <br />
          При старте ты получишь приветственные {startLambsCount} ламбиксов
          <br /><br />
          Далее играй в мини-игры, зарабатывай ламбиксы и меняй их на возможность выиграть ценные призы:
          <b> каждые {totalScore} ламбиксов автоматически превращаются в билет на участие в розыгрыше</b>
          <br />
          <div className="total-score">
            <span className="total-score__text">{totalScore}</span>
            <MilkExchangeSvg />
          </div>
        </div>
      </Card>

      <Card
        textSize="small"
        variant="white"
        title="Сканируйте наши продукты и получайте ламбиксы!"
      >
        <div className="scanner-content img-center reward-img">
          <CardReward count={rewardCount1} svgLarge={RewardItem1Svg} svgSmall={MilkGlassSvg} />
          <CardReward count={rewardCount2} svgLarge={RewardItem2Svg} svgSmall={MilkGlassSvg} />
          <CardReward count={rewardCount3} svgLarge={RewardItem3Svg} svgSmall={MilkGlassSvg} />
        </div>
      </Card>

      <Card
        variant="blue"
        title="Выигрывай призы"
        text={`Ваши билеты: ${tickets}`}
        enableQr={true}
        enableQrGap={false}
      >
        <img src={`${GL_URL}ticket.svg`} alt="Билет" className="img-center ticket-img" />
      </Card>

      <CardTip
        title="Полезный факт о молоке"
        text={factText}
        rightSvg={CowSvg}
      />

      <Card
        variant="white"
        title="История завода"
      >
        <div className="card-text">
          <p>ПАО «Ламбумиз» — надёжная упаковка
          с 1972 года! Более 50 лет мы создаём упаковку, которая помогает сохранять лучшее в каждом продукте.</p>
          <p>Мы работаем для тех, кто ценит качество, безопасность и свежесть. 
          Каждая упаковка — это результат современных технологий и любви к своему делу. </p>
          <span>Ламбумиз — когда важно сохранить главное</span>
        </div>
      </Card>

      <Card
        variant="light-blue"
        title="Контакты"
        image={`${GL_URL}icons/logo.svg`}
        imagePosition="top-right"
      >
        <div className="card-text">
          <p className="contacts-card-text">+7(495) 636-27-36</p>
          <a className="contacts-card-text" href="https://lambumiz.ru/">lambumiz.ru</a>
          <p className="contacts-card-text">ул. Рябиновая, 51А, г. Москва</p>
        </div>
      </Card>

      <p className="legal-info">Разработано ПАО «Ламбумиз»</p>
    </div >
  );
}