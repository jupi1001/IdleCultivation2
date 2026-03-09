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
  type CurrentFishingArea,
  type CurrentGatheringArea,
  type CurrentMiningArea,
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

export interface UseSkillActivityConfig<K extends SkillKind, TArea extends BaseArea> {
  kind: K;
  areaData: TArea[];
  getLevelInfo: (xp: number) => SkillLevelInfo;
  maxLevel: number;
}

type CurrentAreaForKind<K extends SkillKind> =
  K extends "fishing" ? CurrentFishingArea | null
    : K extends "mining" ? CurrentMiningArea | null
      : K extends "gathering" ? CurrentGatheringArea | null
        : never;

type CurrentAreaNonNullForKind<K extends SkillKind> = Exclude<CurrentAreaForKind<K>, null>;

export interface UseSkillActivityResult<K extends SkillKind, TArea extends BaseArea> {
  /** Current activity state (areaId + xp/delay/loot ids). Use currentAreaState?.areaId to compare with area.id. */
  currentAreaState: CurrentAreaForKind<K>;
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

function getCurrentAreaSelector<K extends SkillKind>(kind: K): (state: RootState) => CurrentAreaForKind<K> {
  switch (kind) {
    case "fishing":
      return selectCurrentFishingArea as (state: RootState) => CurrentAreaForKind<K>;
    case "mining":
      return selectCurrentMiningArea as (state: RootState) => CurrentAreaForKind<K>;
    case "gathering":
      return selectCurrentGatheringArea as (state: RootState) => CurrentAreaForKind<K>;
    default:
      return selectCurrentFishingArea as (state: RootState) => CurrentAreaForKind<K>;
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

function buildPayload<K extends SkillKind, TArea extends BaseArea>(
  kind: K,
  area: TArea
): CurrentAreaNonNullForKind<K> {
  switch (kind) {
    case "fishing": {
      const a = area as unknown as FishingAreaI;
      return {
        areaId: a.id,
        xp: a.xp,
        delay: a.delay,
        fishingLootIds: a.fishingLootIds,
        rareDropChancePercent: a.rareDropChancePercent,
        rareDropItemIds: a.rareDropItemIds,
      } as CurrentAreaNonNullForKind<K>;
    }
    case "mining": {
      const a = area as unknown as MiningAreaI;
      return {
        areaId: a.id,
        xp: a.xp,
        delay: a.delay,
        miningLootId: a.miningLootId,
      } as CurrentAreaNonNullForKind<K>;
    }
    case "gathering": {
      const a = area as unknown as GatheringAreaI;
      return {
        areaId: a.id,
        xp: a.xp,
        delay: a.delay,
        gatheringLootIds: a.gatheringLootIds,
        rareDropChancePercent: a.rareDropChancePercent,
        rareDropItemIds: a.rareDropItemIds,
      } as CurrentAreaNonNullForKind<K>;
    }
    default:
      // This branch should never be hit for valid SkillKind.
      throw new Error(`Unsupported skill kind: ${kind satisfies never}`);
  }
}

function getActivityForKind(kind: SkillKind): "fish" | "mine" | "gather" {
  return SKILL_KIND_TO_ACTIVITY[kind];
}

export function useSkillActivity<K extends SkillKind, TArea extends BaseArea>(
  config: UseSkillActivityConfig<K, TArea>
): UseSkillActivityResult<K, TArea> {
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

  const start = (area: TArea) => {
    switch (kind) {
      case "fishing": {
        const payload = buildPayload("fishing", area as unknown as FishingAreaI) as CurrentFishingArea;
        dispatch(setCurrentFishingArea(payload));
        break;
      }
      case "mining": {
        const payload = buildPayload("mining", area as unknown as MiningAreaI) as CurrentMiningArea;
        dispatch(setCurrentMiningArea(payload));
        break;
      }
      case "gathering": {
        const payload = buildPayload("gathering", area as unknown as GatheringAreaI) as CurrentGatheringArea;
        dispatch(setCurrentGatheringArea(payload));
        break;
      }
    }
    dispatch(setCurrentActivity(activityType));
  };
  const stop = () => {
    switch (kind) {
      case "fishing":
        dispatch(setCurrentFishingArea(null));
        break;
      case "mining":
        dispatch(setCurrentMiningArea(null));
        break;
      case "gathering":
        dispatch(setCurrentGatheringArea(null));
        break;
    }
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
