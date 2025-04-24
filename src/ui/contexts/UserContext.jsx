import React, { createContext } from 'react';

const UserContext = createContext({
  canEdit: true
});

const UserProvider = ({ children }) => {
  // const { user } = useAuth();
  // const { } = useAnalytics()

  const canEdit = true;

  // const { score, totalScore, tickets, loadScore } = useUserScore(authRawData);

  return (
    <UserContext.Provider value={canEdit}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
