import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";

const UserContext = createContext({
  canEdit: true
});

const UserProvider = ({ children }) => {
  const { canEditSettings } = useAuth();
  // const { } = useAnalytics()

  return (
    <UserContext.Provider value={{ canEditSettings }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
