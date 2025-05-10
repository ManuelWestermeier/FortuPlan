import React, { createContext, useContext, useState, useEffect } from "react";
import SHA256 from "crypto-js/sha256";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // Hash username to derive storage key
  const getStorageKey = (user) => SHA256(user).toString();

  // Attempt login or account creation
  const handleLogin = () => {
    setError("");
    const key = getStorageKey(username);
    const stored = localStorage.getItem(key);

    if (stored) {
      // Existing account: decrypt
      try {
        const bytes = AES.decrypt(stored, password);
        const decrypted = bytes.toString(Utf8);
        const data = JSON.parse(decrypted);
        setEvents(data.events);
        setAuthenticated(true);
      } catch (e) {
        setError("Wrong password. Please try again.");
      }
    } else {
      // New account: initialize
      const defaultEvent = {
        title: "Welcome Event",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      };
      setEvents([defaultEvent]);
      setAuthenticated(true);
    }
  };

  // Persist events to localStorage whenever they change
  useEffect(() => {
    if (!authenticated) return;
    const key = getStorageKey(username);
    const payload = JSON.stringify({ events });
    const cipher = AES.encrypt(payload, password).toString();
    localStorage.setItem(key, cipher);
  }, [events, authenticated, username, password]);

  if (!authenticated) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <h2>Login / Create Account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ margin: "8px 0", padding: "8px", width: "200px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "8px 0", padding: "8px", width: "200px" }}
        />
        <button onClick={handleLogin} style={{ padding: "8px 16px" }}>
          Submit
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

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
