/**
 * Generic hook for fishing, mining, and gathering skill activities.
 * Centralizes selectors, cast progress, area visibility (reincarnation gating), and start/stop actions.
 */
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIVITY_LABELS } from "../constants/activities";
import type { BaseArea } from "../interfaces/BaseArea";
import type { FishingAreaI } from "../interfaces/FishingAreaI";
import type { GatheringAreaI } from "../interfaces/GatheringAreaI";
import type { MiningAreaI } from "../interfaces/MiningAreaI";
import { setCurrentActivity } from "../state/reducers/characterCoreSlice";
import {
  setCurrentFishingArea,
  setCurrentMiningArea,
  setCurrentGatheringArea,
} from "../state/reducers/skillsSlice";
import {
  selectCurrentActivity,
  selectCurrentFishingArea,
  selectCurrentMiningArea,
  selectCurrentGatheringArea,
  selectFishingCastStartTime,
  selectFishingCastDuration,
  selectFishingXP,
  selectMiningCastStartTime,
  selectMiningCastDuration,
  selectMiningXP,
  selectGatheringCastStartTime,
  selectGatheringCastDuration,
  selectGatheringXP,
  selectReincarnationCount,
} from "../state/selectors/characterSelectors";
import type { RootState } from "../state/store";
import type { SkillKind } from "../types/skilling";
import { useCastProgress } from "./useCastProgress";

const SKILL_KIND_TO_ACTIVITY = { fishing: "fish", mining: "mine", gathering: "gather" } as const;

export interface SkillLevelInfo {
  level: number;
  xpInLevel: number;
  xpRequiredForNext: number;
}

export interface UseSkillActivityConfig<TArea extends BaseArea> {
  kind: SkillKind;
  areaData: TArea[];
  getLevelInfo: (xp: number) => SkillLevelInfo;
  maxLevel: number;
}

export interface UseSkillActivityResult<TArea extends BaseArea> {
  /** Current activity state (areaId + xp/delay/loot ids). Use currentAreaState?.areaId to compare with area.id. */
  currentAreaState: unknown;
  currentActivity: string;
  castStartTime: number | null;
  castDuration: number;
  xp: number;
  reincarnationCount: number;
  levelInfo: SkillLevelInfo;
  maxLevel: number;
  progress: number;
  /** Areas visible given reincarnation (requiresReincarnation gating). */
  areasVisible: TArea[];
  isActive: boolean;
  busyWithOther: boolean;
  activityLabel: string;
  start: (area: TArea) => void;
  stop: () => void;
}

function getCurrentAreaSelector(kind: SkillKind): (state: RootState) => unknown {
  switch (kind) {
    case "fishing":
      return selectCurrentFishingArea as (state: RootState) => unknown;
    case "mining":
      return selectCurrentMiningArea as (state: RootState) => unknown;
    case "gathering":
      return selectCurrentGatheringArea as (state: RootState) => unknown;
    default:
      return selectCurrentFishingArea as (state: RootState) => unknown;
  }
}

function getCastSelectors(kind: SkillKind) {
  switch (kind) {
    case "fishing":
      return { startTime: selectFishingCastStartTime, duration: selectFishingCastDuration, xp: selectFishingXP };
    case "mining":
      return { startTime: selectMiningCastStartTime, duration: selectMiningCastDuration, xp: selectMiningXP };
    case "gathering":
      return { startTime: selectGatheringCastStartTime, duration: selectGatheringCastDuration, xp: selectGatheringXP };
    default:
      return { startTime: selectFishingCastStartTime, duration: selectFishingCastDuration, xp: selectFishingXP };
  }
}

function buildPayload(kind: SkillKind, area: BaseArea): unknown {
  switch (kind) {
    case "fishing": {
      const a = area as FishingAreaI;
      return {
        areaId: a.id,
        fishingXP: a.fishingXP,
        fishingDelay: a.fishingDelay,
        fishingLootIds: a.fishingLootIds,
        rareDropChancePercent: a.rareDropChancePercent,
        rareDropItemIds: a.rareDropItemIds,
      };
    }
    case "mining": {
      const a = area as MiningAreaI;
      return { areaId: a.id, miningXP: a.miningXP, miningDelay: a.miningDelay, miningLootId: a.miningLootId };
    }
    case "gathering": {
      const a = area as GatheringAreaI;
      return {
        areaId: a.id,
        gatheringXP: a.gatheringXP,
        gatheringDelay: a.gatheringDelay,
        gatheringLootIds: a.gatheringLootIds,
        rareDropChancePercent: a.rareDropChancePercent,
        rareDropItemIds: a.rareDropItemIds,
      };
    }
    default:
      return null;
  }
}

function getSetAreaAction(kind: SkillKind) {
  switch (kind) {
    case "fishing":
      return setCurrentFishingArea;
    case "mining":
      return setCurrentMiningArea;
    case "gathering":
      return setCurrentGatheringArea;
    default:
      return setCurrentFishingArea;
  }
}

function getActivityForKind(kind: SkillKind): "fish" | "mine" | "gather" {
  return SKILL_KIND_TO_ACTIVITY[kind];
}

export function useSkillActivity<TArea extends BaseArea>(
  config: UseSkillActivityConfig<TArea>
): UseSkillActivityResult<TArea> {
  const { kind, areaData, getLevelInfo, maxLevel } = config;
  const dispatch = useDispatch();
  const currentActivity = useSelector(selectCurrentActivity);
  const currentAreaState = useSelector(getCurrentAreaSelector(kind));
  const cast = getCastSelectors(kind);
  const castStartTime = useSelector(cast.startTime);
  const castDuration = useSelector(cast.duration);
  const xp = useSelector(cast.xp);
  const reincarnationCount = (useSelector(selectReincarnationCount) ?? 0) as number;
  const progress = useCastProgress(castStartTime, castDuration);

  const activityType = getActivityForKind(kind);
  const levelInfo = useMemo(() => getLevelInfo(xp), [getLevelInfo, xp]);
  const areasVisible = useMemo(
    () => areaData.filter((area) => !area.requiresReincarnation || reincarnationCount >= 1),
    [areaData, reincarnationCount]
  );
  const isActive = currentActivity === activityType && currentAreaState != null;
  const busyWithOther = currentActivity !== "none" && currentActivity !== activityType;
  const activityLabel = ACTIVITY_LABELS[currentActivity] ?? currentActivity;

  const setAreaAction = getSetAreaAction(kind);
  const start = (area: TArea) => {
    dispatch(setAreaAction(buildPayload(kind, area) as never));
    dispatch(setCurrentActivity(activityType));
  };
  const stop = () => {
    dispatch(setAreaAction(null as never));
    dispatch(setCurrentActivity("none"));
  };

  return {
    currentActivity,
    currentAreaState,
    castStartTime,
    castDuration,
    xp,
    reincarnationCount,
    levelInfo,
    maxLevel,
    progress,
    areasVisible,
    isActive,
    busyWithOther,
    activityLabel,
    start,
    stop,
  };
}
