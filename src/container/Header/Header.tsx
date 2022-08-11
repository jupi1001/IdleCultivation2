import React from "react";
import "./Header.css";

export const Header = () => {
  const openShop = () => {
    //State to toogle display?
    console.log("Shop open");
  };

  return (
    <nav className="app__header">
      <div className="app__header-logo">
        <img src="https://i.pinimg.com/originals/b8/2a/b7/b82ab759c26dd1d5bcf8170fb4a0f206.jpg" alt="Logo" />
      </div>
      <ul className="app__header-links">
        <li>
          <button onClick={() => openShop()}>Shop</button>
        </li>
        <li>
          <a href="#Inventory">Inventory</a>
        </li>
      </ul>
    </nav>
  );
};
