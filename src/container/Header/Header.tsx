import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { changeContent } from "../../state/reducers/contentSlice";
import "./Header.css";

export const Header = () => {
  //const content = useSelector((state: RootState) => state.content);
  const dispatch = useDispatch();

  const openContent = (input: string) => {
    dispatch(changeContent(input));
  };

  return (
    <nav className="app__header">
      <div className="app__header-logo">
        <img src="https://i.pinimg.com/originals/b8/2a/b7/b82ab759c26dd1d5bcf8170fb4a0f206.jpg" alt="Logo" />
      </div>
      <ul className="app__header-links">
        <li>
          <button onClick={() => openContent("Map")}>Map</button>
        </li>
        <li>
          <button onClick={() => openContent("Shop")}>Shop</button>
        </li>
        <li>
          <button onClick={() => openContent("Inventory")}>Inventory</button>
        </li>
      </ul>
    </nav>
  );
};
