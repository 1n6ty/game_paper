import React from "react";
import ReactDOM from "react-dom/client";
import { createApp } from "@/app/shell/app/createApp";
import { baseConfig } from "./baseConfig";

const App = createApp(baseConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// export {};
