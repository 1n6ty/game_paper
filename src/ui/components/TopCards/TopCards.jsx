import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

import MilkTicket from "../../../assets/MilkTicket.svg?react";

import { GL_URL } from "../../../global";
import "./TopCards.css";

export default function TopCards() {
  const { user, tickets } = useContext(UserContext);

  return (
    <div className="top-cards">
      <div className="top-cards-emblem-card">
        <img src={`${GL_URL}emblem.svg`} alt="Эмблема" className="top-cards-emblem-img" />
      </div>

      <div className="top-cards-user-card">
        <MilkTicket className="top-cards-milk-img" />

        <div className="top-cards-user-info">
          <p className="top-cards-username">{user?.userName || `${user?.firstName} ${user?.lastName}`}</p>
          <p className="top-cards-tickets">{tickets}</p>
        </div>
      </div>
    </div>
  );
}