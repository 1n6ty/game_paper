import React from "react";
import TopCards from "../components/TopCards"
import MilkCoinsBar from "../components/MilkCoinsBar"
import CardWithQr from "../components/CardWithQr/CardWithQrPrimary"
import "./Home.css";


const Home = () => {
	return (
		<div className="container">
			{/* Верхние карточки */}
			<TopCards />
			<MilkCoinsBar current={20} total={100} />

			{/* Основные карточки */}
			<div className="card rules-card">
				<h2 className="card-title">Правила игры</h2>
				<p className="card-text">Сканируй код "Честный знак" на упаковках Городецкого молока и получай возможность выиграть призы:
					<p className="card-text span">каждое сканирование даёт 1 билет</p>
					Также играй в мини-игры и зарабатывай МилкКоины: баланс в разделе “Игры”</p>
			</div>

			<CardWithQr variant="primary" title="Выигрывай призы" text="Ваши билеты: 5" />

			<div className="card advice-card">
				<h2 className="card-title">Полезный совет о молоке</h2>
				<div className="advice-content">
					<p className="advice-text">Молоко очень полезное! Оно богато витаминами А, В6, В12, С, Е и др.</p>
					<img src="/icons/cow.svg" alt="Корова" className="cow-img" />
				</div>
			</div>

			<div className="card history-card">
				<h2 className="card-title">История завода</h2>
				<p className="card-text">Городец — город мастеров с 1152 года</p>
				<p className="card-text">Каждое трудовое начинание становилось народным промыслом, знаменитым на весь мир: Городецкая роспись, городецкая резьба, городецкий пряник</p>
				<p className="card-text">А с 1961 г. Городецкое молоко! Ничего лишнего, мы всего лишь бережно передаем Вам то, что дарит нам природа</p>
			</div>

			<div className="card contacts-card">
				<h2 className="card-title">Контакты</h2>
				<p className="card-text">+7 (831) 423-06-47</p>
				<p className="card-text">moloko-gorodec.ru</p>
				<p className="card-text">ул. Республиканская, 91, г. Городец</p>
			</div>

			<p className="legal-info">Разработано ПАО "Ламбумиз"</p>
		</div>
	);
};

export default Home;
