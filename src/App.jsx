import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TabBar from './components/TabBar/TabBar';

import Home from './pages/Home/Home';
import Games from './pages/Games/Games';
import Scanner from './pages/Scanner/Scanner';

function App() {
  return (
    <div>
      {/* Шапка, как в дизайне (название бота, логотип, т.д.) */}

      {/* Основная зона контента */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/scanner" element={<Scanner />} />
      </Routes>

      {/* Нижняя панель навигации (3 вкладки) */}
      <TabBar />
    </div >
  );
}

export default App;
