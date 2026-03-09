import React from "react";
import { useDispatch } from "react-redux";
import { changeContent, routeFromArea } from "../../state/reducers/contentSlice";
import "./Header.css";
import { ContentArea } from "../../enum/ContentArea";

export const Header = () => {
  const dispatch = useDispatch();

  const openContent = (area: ContentArea) => {
    dispatch(changeContent(routeFromArea(area)));
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
        <li>
          <button onClick={() => openContent(ContentArea.ACHIEVEMENTS)}>Achievements</button>
        </li>
        <li>
          <button onClick={() => openContent(ContentArea.ACTIVITY_LOG)}>Activity Log</button>
        </li>
        <li>
          <button onClick={() => openContent(ContentArea.STATS)}>Statistics</button>
        </li>
      </ul>
      <div className="app__header-actions">
        <button type="button" className="app__header-settings" onClick={() => openContent(ContentArea.SETTINGS)} aria-label="Settings">
          ⚙
        </button>
      </div>
    </nav>
  );
};
