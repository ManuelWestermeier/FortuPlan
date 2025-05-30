import { useCalendar } from "./prov/calendar";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Route, Routes, Navigate } from "react-router-dom";
import "./css/calendar.css";

const localizer = momentLocalizer(moment);

function CalendarView() {
  const { events } = useCalendar();
  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      titleAccessor="title"
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <img src="/favicon.svg" alt="" />
            <CalendarView />
          </>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
