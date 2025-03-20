import React, { createContext, useState, useEffect } from 'react';
import { loadUserScore } from '../domain/userUseCases';

import { TEST } from "../../global";


const UserContext = createContext();

const TOTAL_SCORE = 1000;
const TEST_SCORE = 100;

const UserProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [user, setUser] = useState();

  // const updateTickets = (newTickets) => {
  //   setTickets(newTickets);
  // };

  const updateScore = (newScore) => {
    setScore(newScore % totalScore);
    // updateTickets(Math.floor(newScore / totalScore))
  };

  const updateUserScoreData = (newScore, newTotalScore) => {
    setTotalScore(newTotalScore);
    setScore(newScore % newTotalScore);
    setTickets(Math.floor(newScore / newTotalScore));
  };


  useEffect(() => {
    const tg = window.Telegram && window.Telegram.WebApp;
    tg.ready();
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setUser(tg.initDataUnsafe.user);
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
    if (user && user.userName) {
      loadUserScore(user.userName)
        .then(data => {
          updateUserScoreData(data.score, data.totalScore);
        })
        .catch(error => {
          console.error("Ошибка загрузки очков:", error);

          if (TEST) {
            console.log("Установка тестовых очков.");
            updateUserScoreData(TEST_SCORE, TOTAL_SCORE);
          }
        });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ score, updateScore, tickets, user, totalScore }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };