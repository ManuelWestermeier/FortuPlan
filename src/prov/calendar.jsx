import { createContext, useContext, useState, useEffect } from "react";
import SHA256 from "crypto-js/sha256";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import useLocalStorage from "use-local-storage";

const day = 60 * 60 * 24 * 1000;

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useLocalStorage("default-username", "");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // Hash username to derive storage key
  const getStorageKey = (user) => SHA256(user).toString();

  // Attempt login or account creation
  const handleLogin = (e) => {
    e.preventDefault();
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
      const defaultEvent = {
        title: "Welcome Event",
        start: new Date(),
        end: new Date(Date.now() + day / 24),
      };

      setEvents([
        defaultEvent,
        {
          title: "X event 1",
          start: new Date(Date.now() + 10 * day),
          end: new Date(Date.now() + 10.1 * day),
        },
        {
          title: "Y event 2",
          start: new Date(Date.now() + 5 * day),
          end: new Date(Date.now() + 7.3 * day),
        },
      ]);
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
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <h2>Login / Create Account</h2>
        <input
          autoFocus={!username}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ margin: "8px 0", padding: "8px", width: "200px" }}
        />
        <input
          autoFocus={!!username}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "8px 0", padding: "8px", width: "200px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Submit
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
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
