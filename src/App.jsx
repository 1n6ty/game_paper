import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TabBar from './components/TabBar/TabBar';

import Home from './pages/Home/Home';
import Games from './pages/Games/Games';
import Scanner from './pages/Scanner/Scanner';
import Game from './pages/Game/Game';

import { UserProvider } from './contexts/UserContext';


function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/games/:gameName" element={<Game />} />
      </Routes>

      <TabBar />
    </UserProvider>
  );
}

export default App;
