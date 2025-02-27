import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import { fetchPoints } from '../api';

export const PointsContext = createContext();

// Для соединения с сервером менять эту функцию
export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [nickname, setNickname] = useState();

  const updateTickets = (newTickets) => {
    setTickets(newTickets);
  };

  const updatePoints = (newPoints) => {
    setPoints(newPoints % 1000);
    updateTickets(Math.floor(newPoints / 1000))
  };

  // Вызывается один раз при монтировании компонента
  useEffect(() => {
    updatePoints(100);  // дебажная установка очков
    const tg = window.Telegram.WebApp;

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const user = tg.initDataUnsafe.user;
      const nickname = user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim();
      setNickname(nickname);
      console.log("Никнейм пользователя:", nickname);
    } else {
      setNickname("<No name>");  // устанавливается, если имя не было получено
      console.log("Данные о пользователе недоступны");
    }

    updatePoints(fetchPoints(nickname).points || points);
  }, []);

  return (
    <PointsContext.Provider value={{ points, updatePoints, tickets, nickname }}>
      {children}
    </PointsContext.Provider>
  );
};
