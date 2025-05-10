import React, { createContext, useContext } from "react";
import useLocalStorage from "use-local-storage";

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useLocalStorage("calendar-data", [
    // Example default event
    {
      title: "Welcome Event",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
  ]);

  return (
    <CalendarContext.Provider value={{ events, setEvents }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
