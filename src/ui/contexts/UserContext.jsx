import React, { createContext } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { useUserScore } from '../hooks/useUserScore';

const UserContext = createContext({
  user: null,
  authRawData: '',
  score: 0,
  totalScore: 0,
  tickets: 0,
  loadScore: () => { },
});

const UserProvider = ({ children }) => {
  const { user, authRawData } = useTelegramAuth();

  const { score, totalScore, tickets, loadScore } = useUserScore(authRawData);

  return (
    <UserContext.Provider value={{ user, authRawData, score, totalScore, tickets, loadScore }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
