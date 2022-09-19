import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftMain } from "../LeftMain/LeftMain";
import { RightMain } from "../RightMain/RightMain";
import { Shop } from "../Shop/Shop";
import { Map } from "../Map/Map";
import { RootState } from "../../state/store";
import "./Main.css";
import { Inventory } from "../Inventory/Inventory";
import MoneyContainer from "../MoneyContainer/MoneyContainer";
import CombatContainer from "../CombatContainer/CombatContainer";
import { addMoney } from "../../state/reducers/characterSlice";

export const Main = () => {
  const content = useSelector((state: RootState) => state.content.page);
  let miner = useSelector((state: RootState) => state.character.miner);
  const dispatch = useDispatch();

  useEffect(() => {
    // start the timer
    //TODO Miner wird nicht geupdated wenn neue hinzugefügt werden
    setInterval(() => {
      dispatch(addMoney(miner));
    }, 1000);

    // cleanup function stops the timer when the component unmounts
  }, [dispatch]);

  return (
    <div className="app__main">
      <div className="app__main-left">
        <LeftMain />
      </div>
      <div className="app__main-content">
        {content === "Map" && <Map />}
        {content === "Shop" && <Shop />}
        {content === "Inventory" && <Inventory />}
        {content.split(",").shift() === "Combat" && <CombatContainer area={content.split(",").pop()} />}
        {content === "Money" && <MoneyContainer />}
      </div>

      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
