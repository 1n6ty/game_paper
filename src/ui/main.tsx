import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { dependencies } from "../di";
import { DependenciesProvider } from "./contexts/DependenciesContext";

import App from "./App"; // Ваш корневой компонент App

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DependenciesProvider value={dependencies}>
      <Router>
        <App />
      </Router>
    </DependenciesProvider>
  </React.StrictMode>
);