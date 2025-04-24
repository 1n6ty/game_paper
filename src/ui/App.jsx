import React from 'react';
import { useRoutes } from 'react-router-dom';
import TabBar from './components/TabBar/TabBar';
// import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
// import Profile from './pages/Profile/Profile';
import { UserProvider } from './contexts/UserContext';

import './App.css';

// Конфигурация маршрутов и табов в одном объекте
const routeConfig = [
  // { path: '/', element: <Analytics />, label: 'Аналитика' },
  { path: '/', element: <Settings />, label: 'Настройки' },
  // { path: '/profile', element: <Profile />, label: 'Профиль' },
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
      {element}
      <TabBar tabs={tabs} />
    </UserProvider>
  );
}

export default App;