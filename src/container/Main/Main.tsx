import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { LeftMain } from "../LeftMain/LeftMain";
import { RightMain } from "../RightMain/RightMain";
import { Shop } from "../Shop/Shop";
import { Map } from "../Map/Map";
import { SectContainer } from "../SectContainer/SectContainer";
import { BlackMarket } from "../BlackMarket/BlackMarket";
import { TrainingContainer } from "../TrainingContainer/TrainingContainer";
import { RootState } from "../../state/store";
import { setLastActiveTimestamp, applyOfflineProgress } from "../../state/reducers/characterSlice";
import { computeOfflineProgress } from "../../utils/offlineProgress";
import { LAST_ACTIVE_STORAGE_KEY } from "../../constants/offlineProgress";
import { OfflineProgressModal } from "../../components/OfflineProgressModal/OfflineProgressModal";
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
import { AlchemyContainer } from "../AlchemyContainer/AlchemyContainer";
import { ForgingContainer } from "../ForgingContainer/ForgingContainer";
import { CookingContainer } from "../CookingContainer/CookingContainer";
import { MeditationContainer } from "../MeditationContainer/MeditationContainer";
import { CultivationTreeContainer } from "../CultivationTreeContainer/CultivationTreeContainer";
import { ImmortalsIslandContainer } from "../ImmortalsIslandContainer/ImmortalsIslandContainer";
import { ReincarnationContainer } from "../ReincarnationContainer/ReincarnationContainer";
import { SettingsContainer } from "../SettingsContainer/SettingsContainer";
import { useActivityTicks } from "../../hooks/useActivityTicks";
import { useVitalityRegen } from "../../hooks/useVitalityRegen";

export const Main = () => {
  const reduxStore = useStore<RootState>();
  const dispatch = useDispatch();

  useActivityTicks();
  useVitalityRegen();

  const content = useSelector((state: RootState) => state.content.page);
  const path = useSelector((state: RootState) => state.character.path);
  const gender = useSelector((state: RootState) => state.character.gender);
  const hasRunOfflineRef = useRef(false);

  useEffect(() => {
    if (path == null || gender == null) return;
    if (hasRunOfflineRef.current) return;
    hasRunOfflineRef.current = true;

    const state = reduxStore.getState();
    const now = Date.now();
    if (!state.character.lastActiveTimestamp || state.character.lastActiveTimestamp <= 0) {
      dispatch(setLastActiveTimestamp(now));
      return;
    }
    const result = computeOfflineProgress(state, now);
    if (result == null) {
      dispatch(setLastActiveTimestamp(now));
      return;
    }
    dispatch(applyOfflineProgress(result));
    try { localStorage.removeItem(LAST_ACTIVE_STORAGE_KEY); } catch (_) { /* ignore */ }
  }, [path, gender, reduxStore, dispatch]);

  useEffect(() => {
    const saveTimestamp = () => {
      try { localStorage.setItem(LAST_ACTIVE_STORAGE_KEY, String(Date.now())); } catch (_) { /* ignore */ }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveTimestamp();
    };
    window.addEventListener("beforeunload", saveTimestamp);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", saveTimestamp);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (path === null || gender === null) {
    return (
      <div className="app__main app__main--pathChoice">
        <PathChoiceScreen />
      </div>
    );
  }

  return (
    <div className="app__main">
      <OfflineProgressModal />
      <div className="app__main-left">
        <LeftMain />
      </div>
      <div className="app__main-content">
        {content === ContentArea.MAP && <Map />}
        {content === ContentArea.SECT && <SectContainer />}
        {content === ContentArea.TRAINING && <TrainingContainer />}
        {content === ContentArea.SHOP && <Shop />}
        {content === ContentArea.BLACK_MARKET && <BlackMarket />}
        {content === ContentArea.INVENTORY && <Inventory />}
        {content.split(":").shift() === ContentArea.COMBAT && <CombatContainer area={content.split(":").pop()} />}
        {content === ContentArea.LABOUR && <MoneyContainer />}
        {content === ContentArea.MEDITATION && <MeditationContainer />}
        {content === ContentArea.FISHING && <FishingContainer />}
        {content === ContentArea.MINING && <MiningContainer />}
        {content === ContentArea.GATHERING && <GatheringContainer />}
        {content === ContentArea.CULTIVATION_TREE && <CultivationTreeContainer />}
        {content === ContentArea.ALCHEMY && <AlchemyContainer />}
        {content === ContentArea.FORGING && <ForgingContainer />}
        {content === ContentArea.COOKING && <CookingContainer />}
        {content === ContentArea.IMMORTALS_ISLAND && <ImmortalsIslandContainer />}
        {content === ContentArea.REINCARNATION && <ReincarnationContainer />}
        {content === ContentArea.SETTINGS && <SettingsContainer />}
      </div>

      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
