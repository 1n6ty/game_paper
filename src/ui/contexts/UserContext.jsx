import React, { createContext, useState, useEffect } from 'react';
import { loadUserScore } from '../../domain/userUseCases';

import { TEST } from "../../global";


const UserContext = createContext();

const ERROR_SCORE = -1;

const UserProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [user, setUser] = useState();
  const [authRawData, setAuthRawData] = useState("");

  // const updateTickets = (newTickets) => {
  //   setTickets(newTickets);
  // };

  // const updateScore = (newScore) => {
  //   setScore(newScore % totalScore);
  //   // updateTickets(Math.floor(newScore / totalScore))
  // };

  const updateAuthRawData = (authRawData) => {
    setAuthRawData(authRawData);
    console.log("Set raw user data:", authRawData);
  }

  const loadScore = () => {
    if (authRawData) {
      console.log("Raw user data in loadScore:", authRawData);

      loadUserScore(authRawData)
        .then(data => {
          updateUserScoreData(data.score, data.totalScore, data.tickets);
        })
        .catch(error => {
          console.error("Ошибка загрузки очков:", error);

          console.log("Установка тестовых очков.");
          updateUserScoreData(ERROR_SCORE, ERROR_SCORE, 0);
        });
    }
  }

  const updateUserScoreData = (newScore, newTotalScore, newTickets) => {
    console.log("newScore:", newScore);
    setScore(newScore);
    console.log("totalScore:", newTotalScore);
    setTotalScore(newTotalScore);
    console.log("newTickets", newTickets);
    setTickets(newTickets);
  };

  useEffect(() => {
    const tg = window.Telegram && window.Telegram.WebApp;
    tg.ready();
    if (tg && tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      updateAuthRawData(tg.initData);

      setUser({
        userName: tg.initDataUnsafe.user.username,
        firstName: tg.initDataUnsafe.user.first_name,
        lastName: tg.initDataUnsafe.user.last_name
      }
      );
    } else {
      console.warn('Данные пользователя из Telegram недоступны. Возможно, вы тестируете вне Telegram.');

      // Временный fallback для разработки
      if (TEST) {
        console.log("Установка тестового пользователя.");
        setUser({
          userName: 'test_user',
          firstName: 'Test',
          lastName: 'User'
        });
      }
    }
  }, []);

  useEffect(() => {
    loadScore();
  }, [user]);

  return (
    <UserContext.Provider value={{ score, loadScore, tickets, user, authRawData, totalScore }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };