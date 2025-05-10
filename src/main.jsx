import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import Root from "./root";
import insallSW from "./service-worker";
import "./index.css";
import { CalendarProvider } from "./prov/calendar";

insallSW();

// Render the app with routing
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <CalendarProvider>
        <Root />
      </CalendarProvider>
    </HashRouter>
  </StrictMode>
);
