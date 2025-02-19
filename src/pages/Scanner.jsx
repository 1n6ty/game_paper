import React from "react";
import TopCards from "../components/TopCards"

const Scanner = () => {
	return (
		<div className="container">
			{/* Верхние карточки */}
			<TopCards />

			{/* Основные карточки */}
			<div className="card rules-card">
				<h2 className="card-title">Сканер</h2>
				<p className="card-text">Сканируй код “Честный знак”, чтобы открыть новую игру и участвовать в розыгрыше</p>
			</div>
		</div>
	);
};

export default Scanner;
