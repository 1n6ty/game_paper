import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import { fetchScore } from '../api';

export const PointsContext = createContext();

const TOTAL_SCORE = 1000;
const NICKNAME_NO_NAME = "<No name>"

// Для соединения с сервером менять эту функцию
export const PointsProvider = ({ children }) => {
  const [totalScore, setTotalScore] = useState(TOTAL_SCORE);
  const [score, setScore] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [nickname, setNickname] = useState();

  const updateTickets = (newTickets) => {
    setTickets(newTickets);
  };

  const updateScore = (newScore) => {
    setScore(newScore % totalScore);
    updateTickets(Math.floor(newScore / totalScore))
  };

  // Вызывается один раз при монтировании компонента
  useEffect(() => {
    const tg = window.Telegram.WebApp;

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const user = tg.initDataUnsafe.user;
      const nickname = user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim();
      setNickname(nickname);
      console.log("Никнейм пользователя:", nickname);
    } else {
      setNickname(NICKNAME_NO_NAME);  // устанавливается, если имя не было получено
      console.log("Данные о пользователе недоступны");
    }

    updateScore(fetchScore(nickname).score || score);
    // updateScore(100312);  // дебажная установка очков
  }, []);

  return (
    <PointsContext.Provider value={{ score, updateScore, tickets, nickname, totalScore }}>
      {children}
    </PointsContext.Provider>
  );
};
