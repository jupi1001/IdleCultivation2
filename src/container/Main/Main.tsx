import React, { useEffect, useRef, useState } from "react";
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
import { ContentArea } from "../../enum/ContentArea";
import FishingContainer from "../FishingContainer/FishingContainer";
import { PlaceholderPanel } from "../../components/PlaceholderPanel/PlaceholderPanel";

export const Main = () => {
  const content = useSelector((state: RootState) => state.content.page);
  let miner = useSelector((state: RootState) => state.character.miner);
  const minerRef = useRef(miner);

  const dispatch = useDispatch();

  useEffect(() => {
    minerRef.current = miner;
  }, [miner]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(addMoney(minerRef.current));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="app__main">
      <div className="app__main-left">
        <LeftMain />
      </div>
      <div className="app__main-content">
        {content === ContentArea.MAP && <Map />}
        {content === ContentArea.SHOP && <Shop />}
        {content === ContentArea.INVENTORY && <Inventory />}
        {content.split(":").shift() === ContentArea.COMBAT && <CombatContainer area={content.split(":").pop()} />}
        {content === ContentArea.LABOUR && <MoneyContainer />}
        {content === ContentArea.MEDITATION && <PlaceholderPanel title="Meditation" description="Cultivate qi in solitude. Unlocks in a later update." />}
        {content === ContentArea.FISHING && <FishingContainer />}
        {content === ContentArea.MINING && <PlaceholderPanel title="Mining" description="Mine ores and spirit stones. Unlocks in a later update." />}
        {content === ContentArea.GATHERING && <PlaceholderPanel title="Gathering" description="Gather herbs and wood. Unlocks in a later update." />}
        {content === ContentArea.CULTIVATION_TREE && <PlaceholderPanel title="Cultivation Tree" description="Unlock permanent talents with qi and spirit stones. Unlocks in a later update." />}
        {content === ContentArea.ALCHEMY && <PlaceholderPanel title="Alchemy" description="Craft pills and elixirs. Unlocks in a later update." />}
        {content === ContentArea.FORGING && <PlaceholderPanel title="Forging" description="Upgrade spirit weapons. Unlocks in a later update." />}
        {content === ContentArea.IMMORTALS_ISLAND && <PlaceholderPanel title="Immortals Island" description="Send expeditions for rewards. Unlocks in a later update." />}
      </div>

      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
