import React, { useEffect, useRef, Suspense, lazy } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { OfflineProgressModal } from "../../components/OfflineProgressModal/OfflineProgressModal";
import { PathChoiceScreen } from "../../components/PathChoiceScreen/PathChoiceScreen";
import { LAST_ACTIVE_STORAGE_KEY } from "../../constants/offlineProgress";
import { ContentArea } from "../../enum/ContentArea";
import { useActivityTicks } from "../../hooks/useActivityTicks";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useVitalityRegen } from "../../hooks/useVitalityRegen";
import { setLastActiveTimestamp, applyOfflineProgress } from "../../state/reducers/characterCoreSlice";
import { applyOfflineProgress as applyOfflineProgressSkills } from "../../state/reducers/skillsSlice";
import { addItemsById } from "../../state/reducers/inventorySlice";
import { RootState } from "../../state/store";
import { BlackMarket } from "../BlackMarket/BlackMarket";
import { LeftMain } from "../LeftMain/LeftMain";
import { RightMain } from "../RightMain/RightMain";
import { Shop } from "../Shop/Shop";
import { Map } from "../Map/Map";
import { TrainingContainer } from "../TrainingContainer/TrainingContainer";
import { computeOfflineProgress } from "../../utils/offlineProgress";
import "./Main.css";
import { Inventory } from "../Inventory/Inventory";
import MoneyContainer from "../MoneyContainer/MoneyContainer";
import { selectRoute } from "../../state/reducers/contentSlice";
import { selectPath, selectGender } from "../../state/selectors/characterSelectors";
import FishingContainer from "../FishingContainer/FishingContainer";
import GatheringContainer from "../GatheringContainer/GatheringContainer";
import MiningContainer from "../MiningContainer/MiningContainer";
import { AlchemyContainer } from "../AlchemyContainer/AlchemyContainer";
import { ForgingContainer } from "../ForgingContainer/ForgingContainer";
import { CookingContainer } from "../CookingContainer/CookingContainer";
import { MeditationContainer } from "../MeditationContainer/MeditationContainer";

// Lazy-loaded heavy panels (code splitting)
const CombatContainer = lazy(() => import("../CombatContainer/CombatContainer").then((m) => ({ default: m.default })));
const SectContainer = lazy(() => import("../SectContainer/SectContainer").then((m) => ({ default: m.SectContainer })));
const CultivationTreeContainer = lazy(() => import("../CultivationTreeContainer/CultivationTreeContainer").then((m) => ({ default: m.CultivationTreeContainer })));
const ImmortalsIslandContainer = lazy(() => import("../ImmortalsIslandContainer/ImmortalsIslandContainer").then((m) => ({ default: m.ImmortalsIslandContainer })));
const AchievementsContainer = lazy(() => import("../AchievementsContainer/AchievementsContainer").then((m) => ({ default: m.AchievementsContainer })));
const SettingsContainer = lazy(() => import("../SettingsContainer/SettingsContainer").then((m) => ({ default: m.SettingsContainer })));
const StatsContainer = lazy(() => import("../StatsContainer/StatsContainer").then((m) => ({ default: m.StatsContainer })));
const ReincarnationContainer = lazy(() => import("../ReincarnationContainer/ReincarnationContainer").then((m) => ({ default: m.ReincarnationContainer })));
const LogContainer = lazy(() => import("../LogContainer/LogContainer").then((m) => ({ default: m.LogContainer })));

const PANEL_LOADING_FALLBACK = <div className="app__panel-loading" aria-busy="true">Loading…</div>;

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
    const prevTs = state.character.lastActiveTimestamp ?? 0;
    if (prevTs <= 0) {
      dispatch(setLastActiveTimestamp(now));
      return;
    }
    const result = computeOfflineProgress(state, now);
    if (result == null) {
      dispatch(setLastActiveTimestamp({ newTimestamp: now, previousTimestamp: prevTs }));
      return;
    }
    const toAdd: { itemId: number; amount: number }[] = [];
    if (result.fishing) result.fishing.items.forEach((item) => toAdd.push({ itemId: item.id, amount: item.quantity ?? 1 }));
    if (result.mining) result.mining.items.forEach((item) => toAdd.push({ itemId: item.id, amount: item.quantity ?? 1 }));
    if (result.gathering) result.gathering.items.forEach((item) => toAdd.push({ itemId: item.id, amount: item.quantity ?? 1 }));
    if (toAdd.length > 0) dispatch(addItemsById(toAdd));
    dispatch(applyOfflineProgress(result));
    dispatch(applyOfflineProgressSkills({ fishing: result.fishing, mining: result.mining, gathering: result.gathering }));
    dispatch(setLastActiveTimestamp({ newTimestamp: Date.now(), previousTimestamp: prevTs }));
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
          <Suspense fallback={PANEL_LOADING_FALLBACK}>
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
          </Suspense>
        </div>
        {route.type !== "activity_log" && (
          <Suspense fallback={null}>
            <LogContainer asPanel />
          </Suspense>
        )}
      </div>
      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
