import { useState, useEffect } from 'react';
import { loadUserScore } from '../../domain/userUseCases';

const ERROR_SCORE = -1;

export const useUserScore = (authRawData) => {
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [tickets, setTickets] = useState(0);

  const loadScore = () => {
    if (authRawData) {
      console.log("Raw user data in loadScore:", authRawData);
      loadUserScore(authRawData)
        .then((data) => {
          setScore(data.score);
          setTotalScore(data.totalScore);
          setTickets(data.tickets);
        })
        .catch((error) => {
          console.error("Ошибка загрузки очков:", error);
          console.log("Установка тестовых очков.");
          setScore(ERROR_SCORE);
          setTotalScore(ERROR_SCORE);
          setTickets(0);
        });
    }
  };

  useEffect(() => {
    loadScore();
  }, [authRawData]);

  return { score, totalScore, tickets, loadScore };
};
