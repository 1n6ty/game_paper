import { useRoutes } from "react-router-dom";
import TabBar from "./components/TabBar/TabBar";
import DashboardHeader from "./components/DashboardHeader/DashboardHeader";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import { UserProvider } from "./contexts/UserContext";

import "./App.css";

const routeConfig = [
  { path: "/", element: <Analytics />, label: "Аналитика" },
  { path: "/settings", element: <Settings />, label: "Настройки" },
  { path: "/profile", element: <Profile />, label: "Профиль" }
];

function App() {
  const element = useRoutes(
    routeConfig.map(r => ({ path: r.path, element: r.element }))
  );

  const tabs = routeConfig.reduce((acc, r) => {
    acc[r.path] = r.label;
    return acc;
  }, {});

  return (
    <UserProvider>
      <div className="app-container">
        <DashboardHeader logoSrc="/icons/logo.svg" title="Панель управления" />
        <TabBar tabs={tabs} />
        <div className="page-content">
          {element}
        </div>
      </div>
    </UserProvider>
  );
}

export default App;