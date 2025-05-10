import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import Root from "./root";
import insallSW from "./service-worker";
import "./index.css";

insallSW();

// Render the app with routing
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Root />
    </HashRouter>
  </StrictMode>
);
