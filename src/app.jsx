import React from "react";
import { CalendarProvider, useCalendar } from "./prov/calendar";

// react-big-calendar setup
import { Calendar } from "react-big-calendar";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function CalendarView() {
  const { events } = useCalendar();
  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600, margin: "1rem" }}
    />
  );
}

export default function App() {
  return (
    <CalendarProvider>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem" }}>
        <h1>My Calendar</h1>
        <CalendarView />
      </div>
    </CalendarProvider>
  );
}
