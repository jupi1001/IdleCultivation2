/**
 * Generic hook for fishing, mining, and gathering skill activities.
 * Centralizes selectors, cast progress, area visibility (reincarnation gating), and start/stop actions,
 * using registry-driven contracts from types/timedActivity instead of open-coded payloads.
 */
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIVITY_LABELS } from "../constants/activities";
import type { BaseArea } from "../interfaces/BaseArea";
import { setCurrentActivity } from "../state/reducers/characterCoreSlice";
import {
  type CurrentFishingArea,
  type CurrentGatheringArea,
  type CurrentMiningArea,
} from "../state/reducers/skillsSlice";
import {
  selectCurrentActivity,
  selectReincarnationCount,
} from "../state/selectors/characterSelectors";
import type { RootState } from "../state/store";
import type { SkillKind } from "../types/skilling";
import {
  ACTIVITY_DEFINITIONS,
} from "../types/timedActivity";
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

function getCurrentAreaSelector<K extends SkillKind>(
  kind: K,
): (state: RootState) => CurrentAreaForKind<K> {
  switch (kind) {
    case "fishing":
      return ACTIVITY_DEFINITIONS.fishing
        .selectCurrentArea as (state: RootState) => CurrentAreaForKind<K>;
    case "mining":
      return ACTIVITY_DEFINITIONS.mining
        .selectCurrentArea as (state: RootState) => CurrentAreaForKind<K>;
    case "gathering":
      return ACTIVITY_DEFINITIONS.gathering
        .selectCurrentArea as (state: RootState) => CurrentAreaForKind<K>;
    default:
      return ACTIVITY_DEFINITIONS.fishing
        .selectCurrentArea as (state: RootState) => CurrentAreaForKind<K>;
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
  const definition = ACTIVITY_DEFINITIONS[kind];
  const currentAreaState = useSelector(
    getCurrentAreaSelector(kind)
  ) as CurrentAreaForKind<K>;
  const castStartTime = useSelector(definition.selectCastStartTime);
  const castDuration = useSelector(definition.selectCastDuration);
  const xp = useSelector(definition.selectXP);
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
    const payload = definition.buildRuntimeState(area as never);
    dispatch(
      definition.setCurrentArea(payload as never)
    );
    dispatch(setCurrentActivity(activityType));
  };
  const stop = () => {
    dispatch(
      definition.setCurrentArea(null)
    );
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
