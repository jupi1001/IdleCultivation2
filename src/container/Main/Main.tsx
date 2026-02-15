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
import { ContentArea } from "../../enum/ContentArea";
import FishingContainer from "../FishingContainer/FishingContainer";
import GatheringContainer from "../GatheringContainer/GatheringContainer";
import MiningContainer from "../MiningContainer/MiningContainer";
import { PathChoiceScreen } from "../../components/PathChoiceScreen/PathChoiceScreen";
import { PlaceholderPanel } from "../../components/PlaceholderPanel/PlaceholderPanel";
import { MeditationContainer } from "../MeditationContainer/MeditationContainer";
import { CultivationTreeContainer } from "../CultivationTreeContainer/CultivationTreeContainer";
import { ImmortalsIslandContainer } from "../ImmortalsIslandContainer/ImmortalsIslandContainer";
import { useActivityTicks } from "../../hooks/useActivityTicks";

export const Main = () => {
  useActivityTicks();

  const content = useSelector((state: RootState) => state.content.page);
  const path = useSelector((state: RootState) => state.character.path);

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
        {content === ContentArea.MINING && <MiningContainer />}
        {content === ContentArea.GATHERING && <GatheringContainer />}
        {content === ContentArea.CULTIVATION_TREE && <CultivationTreeContainer />}
        {content === ContentArea.ALCHEMY && <PlaceholderPanel title="Alchemy" description="Craft pills and elixirs. Unlocks in a later update." />}
        {content === ContentArea.FORGING && <PlaceholderPanel title="Forging" description="Upgrade spirit weapons. Unlocks in a later update." />}
        {content === ContentArea.IMMORTALS_ISLAND && <ImmortalsIslandContainer />}
      </div>

      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
