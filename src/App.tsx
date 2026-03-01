import React, { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./container/Header/Header";
import { Main } from "./container/Main/Main";
import { ToastContainer } from "./components/Toast/Toast";

const THEME_KEY = "idle-cultivation-theme";

function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem(THEME_KEY);
    const value = stored === "light" ? "light" : "dark";
    if (typeof document !== "undefined") document.body.setAttribute("data-theme", value);
    return value;
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="theme-wrap" data-theme={theme} style={{ minHeight: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
      <Header theme={theme} setTheme={setTheme} />
      <Main />
      <ToastContainer />
    </div>
  );
}

export default App;
