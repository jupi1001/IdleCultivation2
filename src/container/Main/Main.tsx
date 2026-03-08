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
import { selectRoute } from "../../state/reducers/contentSlice";
import { selectPath, selectGender } from "../../state/selectors/characterSelectors";
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
import { AchievementsContainer } from "../AchievementsContainer/AchievementsContainer";
import { SettingsContainer } from "../SettingsContainer/SettingsContainer";
import { LogContainer } from "../LogContainer/LogContainer";
import { StatsContainer } from "../StatsContainer/StatsContainer";
import { useActivityTicks } from "../../hooks/useActivityTicks";
import { useVitalityRegen } from "../../hooks/useVitalityRegen";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";

type Theme = "dark" | "light";

interface MainProps {
  theme?: Theme;
  setTheme?: (t: Theme) => void;
}

export const Main = ({ theme = "dark", setTheme }: MainProps) => {
  const reduxStore = useStore<RootState>();
  const dispatch = useDispatch();

  useActivityTicks();
  useVitalityRegen();
  useKeyboardShortcuts();

  const route = useSelector(selectRoute);
  const path = useSelector(selectPath);
  const gender = useSelector(selectGender);
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
        <div className="app__main-content-scroll">
          {route.type === "map" && <Map />}
          {route.type === "sect" && <SectContainer />}
          {route.type === "training" && <TrainingContainer />}
          {route.type === "shop" && <Shop />}
          {route.type === "black_market" && <BlackMarket />}
          {route.type === "inventory" && <Inventory />}
          {route.type === "combat" && <CombatContainer area={route.areaId} />}
          {route.type === "labour" && <MoneyContainer />}
          {route.type === "meditation" && <MeditationContainer />}
          {route.type === "fishing" && <FishingContainer />}
          {route.type === "mining" && <MiningContainer />}
          {route.type === "gathering" && <GatheringContainer />}
          {route.type === "cultivation_tree" && <CultivationTreeContainer />}
          {route.type === "alchemy" && <AlchemyContainer />}
          {route.type === "forging" && <ForgingContainer />}
          {route.type === "cooking" && <CookingContainer />}
          {route.type === "immortals_island" && <ImmortalsIslandContainer />}
          {route.type === "reincarnation" && <ReincarnationContainer />}
          {route.type === "achievements" && <AchievementsContainer />}
          {route.type === "settings" && <SettingsContainer theme={theme} setTheme={setTheme} />}
          {route.type === "activity_log" && <LogContainer />}
          {route.type === "stats" && <StatsContainer />}
        </div>
        {route.type !== "activity_log" && <LogContainer asPanel />}
      </div>
      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
