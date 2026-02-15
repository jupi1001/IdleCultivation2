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
        <img src="https://i.pinimg.com/originals/b8/2a/b7/b82ab759c26dd1d5bcf8170fb4a0f206.jpg" alt="Logo" />
      </div>
      <ul className="app__header-links">
        <li>
          <button onClick={() => openContent(ContentArea.MAP)}>Map</button>
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
