import React from "react";
import ReactDOM from "react-dom/client";
import { createApp } from "@/app/shell/app/createApp";
import { mockConfig } from "./mockConfig";

const App = createApp(mockConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// export {};
