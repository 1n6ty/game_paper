import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

import MilkTicketSvg from "../../../assets/MilkTicket.svg?react";

import EmblemSvgUrl from "/emblem.svg";

import "./TopCards.css";

export default function TopCards() {
  const { user, tickets } = useContext(UserContext);

  return (
    <div className="top-cards">
      <div className="top-cards-emblem-card">
        <img src={EmblemSvgUrl} alt="Эмблема" className="top-cards-emblem-img" />
      </div>

      <div className="top-cards-user-card">
        <MilkTicketSvg className="top-cards-milk-img" />

        <div className="top-cards-user-info">
          <p className="top-cards-username">{user?.userName || `${user?.firstName} ${user?.lastName}`}</p>
          <p className="top-cards-tickets">{tickets}</p>
        </div>
      </div>
    </div>
  );
}