import { useState, useEffect, useCallback } from "react";
import { loadUserScore } from "../../domain/userUseCases";

import { TEST } from "../../global";

const ERROR_SCORE = -1;

export default function useUserScore(authRawData) {
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    if (TEST) {
      console.log("Установка тестовых очков.");
      setScore(ERROR_SCORE);
      setTotalScore(ERROR_SCORE);
      setTickets(0);
    }
  }, []);

  const loadScore = useCallback(() => {
    if (authRawData) {
      console.log("Raw user data in loadScore:", authRawData);
      loadUserScore(authRawData)
        .then(data => {
          setScore(data.score);
          setTotalScore(data.totalScore);
          setTickets(data.tickets);
        })
        .catch(error => {
          console.error("Ошибка загрузки очков:", error);
        });
    }
  }, [authRawData]);

  useEffect(() => {
    if (loadScore)
      loadScore();
  }, [loadScore]);

  return { score, totalScore, tickets, loadScore };
}