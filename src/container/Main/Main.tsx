import React from "react";
import { useSelector } from "react-redux";
import { LeftMain } from "../LeftMain/LeftMain";
import { RightMain } from "../RightMain/RightMain";
import { Shop } from "../Shop/Shop";
import { Map } from "../Map/Map";
import { RootState } from "../../state/store";
import "./Main.css";
import { Inventory } from "../Inventory/Inventory";
import MoneyContainer from "../MoneyContainer/MoneyContainer";
import CombatContainer from "../CombatContainer/CombatContainer";

export const Main = () => {
  const content = useSelector((state: RootState) => state.content.page);

  return (
    <div className="app__main">
      <div className="app__main-left">
        <LeftMain />
      </div>
      <div className="app__main-content">
        {content === "Map" && <Map />}
        {content === "Shop" && <Shop />}
        {content === "Inventory" && <Inventory />}
        {content === "Combat" && <CombatContainer />}
        {content === "Money" && <MoneyContainer />}
      </div>

      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
