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
  const [user, setUser] = useState();

  const updateTickets = (newTickets) => {
    setTickets(newTickets);
  };

  const updateScore = (newScore) => {
    setScore(newScore % totalScore);
    updateTickets(Math.floor(newScore / totalScore))
  };

  // Вызывается один раз при монтировании компонента
  useEffect(() => {
    const tg = window.Telegram && window.Telegram.WebApp;
    tg.ready();
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setUser(tg.initDataUnsafe.user);
    } else {
      console.warn('Данные пользователя из Telegram недоступны. Возможно, вы тестируете вне Telegram.');
      // Временный fallback для разработки
      setUser({
        username: 'TestUser',
        first_name: 'Test',
        last_name: 'User'
      });
    }
  }, []);

  return (
    <PointsContext.Provider value={{ score, updateScore, tickets, user, totalScore }}>
      {children}
    </PointsContext.Provider>
  );
};
