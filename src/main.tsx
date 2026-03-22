import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import "./styles.css";

// Hash routes live in the fragment (#/about), not under the server path (/myportfolio/).
// A basename here breaks matching (e.g. #/about vs expected #/myportfolio/about) → blank UI.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
