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
import { addMoney, addQi } from "../../state/reducers/characterSlice";
import { BASE_QI_PER_SECOND } from "../../constants/meditation";
import { ContentArea } from "../../enum/ContentArea";
import FishingContainer from "../FishingContainer/FishingContainer";
import { PathChoiceScreen } from "../../components/PathChoiceScreen/PathChoiceScreen";
import { PlaceholderPanel } from "../../components/PlaceholderPanel/PlaceholderPanel";
import { MeditationContainer } from "../MeditationContainer/MeditationContainer";
import { CultivationTreeContainer } from "../CultivationTreeContainer/CultivationTreeContainer";

export const Main = () => {
  const content = useSelector((state: RootState) => state.content.page);
  const path = useSelector((state: RootState) => state.character.path);
  const currentActivity = useSelector((state: RootState) => state.character.currentActivity);
  const equipment = useSelector((state: RootState) => state.character.equipment);
  let miner = useSelector((state: RootState) => state.character.miner);
  const minerRef = useRef(miner);

  const dispatch = useDispatch();

  const qiPerSecond =
    Math.round((BASE_QI_PER_SECOND + (equipment.qiTechnique?.qiGainBonus ?? 0)) * 10) / 10;

  useEffect(() => {
    minerRef.current = miner;
  }, [miner]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(addMoney(minerRef.current));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (currentActivity !== "meditate") return;
    const intervalId = setInterval(() => {
      dispatch(addQi(qiPerSecond));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentActivity, dispatch, qiPerSecond]);

  if (path === null) {
    return (
      <div className="app__main app__main--pathChoice">
        <PathChoiceScreen />
      </div>
    );
  }

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
        {content === ContentArea.MEDITATION && <MeditationContainer />}
        {content === ContentArea.FISHING && <FishingContainer />}
        {content === ContentArea.MINING && <PlaceholderPanel title="Mining" description="Mine ores and spirit stones. Unlocks in a later update." />}
        {content === ContentArea.GATHERING && <PlaceholderPanel title="Gathering" description="Gather herbs and wood. Unlocks in a later update." />}
        {content === ContentArea.CULTIVATION_TREE && <CultivationTreeContainer />}
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
