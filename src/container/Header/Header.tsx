import React from "react";
import { useDispatch } from "react-redux";
import { changeContent } from "../../state/reducers/contentSlice";
import "./Header.css";
import { ContentArea } from "../../enum/ContentArea";

type Theme = "dark" | "light";

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const Header = ({ theme, setTheme }: HeaderProps) => {
  const dispatch = useDispatch();

  const openContent = (input: string) => {
    dispatch(changeContent(input));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="app__header">
      <div className="app__header-logo">
        <img src="/logo.webp" alt="Idle Cultivation 2" />
      </div>
      <ul className="app__header-links">
        <li>
          <button onClick={() => openContent(ContentArea.MAP)}>Map</button>
        </li>
        <li>
          <button onClick={() => openContent(ContentArea.SECT)}>Sect</button>
        </li>
        <li>
          <button onClick={() => openContent(ContentArea.SHOP)}>Shop</button>
        </li>
        <li>
          <button onClick={() => openContent(ContentArea.INVENTORY)}>Inventory</button>
        </li>
        <li>
          <button onClick={() => openContent(ContentArea.CULTIVATION_TREE)}>Cultivation Tree</button>
        </li>
      </ul>
      <button type="button" className="app__header-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? "☀" : "☽"}
      </button>
    </nav>
  );
};
