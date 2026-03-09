/**
 * Contracts for registry-driven timed activities (e.g. fishing, mining, gathering).
 *
 * These contracts separate:
 * - Static activity definition (selectors, runtime-state builder, unlock rules)
 * - Runtime state stored in Redux
 * - Reward result shapes (XP + items, extendable later for stones, achievements, etc.)
 *
 * Fishing / mining / gathering are wired through this registry and consumed by useSkillActivity.
 */
import type { BaseArea } from "../interfaces/BaseArea";
import type FishingAreaI from "../interfaces/FishingAreaI";
import type GatheringAreaI from "../interfaces/GatheringAreaI";
import type Item from "../interfaces/ItemI";
import type MiningAreaI from "../interfaces/MiningAreaI";
import type {
  CurrentFishingArea,
  CurrentGatheringArea,
  CurrentMiningArea,
} from "../state/reducers/skillsSlice";
import {
  setCurrentFishingArea,
  setCurrentGatheringArea,
  setCurrentMiningArea,
} from "../state/reducers/skillsSlice";
import {
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
} from "../state/selectors/characterSelectors";
import type { RootState } from "../state/store";
import type { SkillKind } from "./skilling";

/**
 * Base runtime state for any timed activity: minimal common fields
 * stored in Redux while an activity is active.
 */
export interface ActivityRuntimeStateBase {
  /** Registry/definition id of the activity (e.g. area id). */
  areaId: number;
  /** XP granted per completion. */
  xp: number;
  /** Nominal duration of one cast / action in ms. */
  delay: number;
}

/**
 * Runtime state for the concrete skills – these extend the base with
 * activity-specific payload fields but are still ActivityRuntimeStateBase.
 */
export type FishingRuntimeState = CurrentFishingArea;
export type MiningRuntimeState = CurrentMiningArea;
export type GatheringRuntimeState = CurrentGatheringArea;

/**
 * Unlock rules for an activity entry. This is intentionally simple and
 * derived from the static registry (e.g. xpUnlock, requiresReincarnation).
 */
export interface UnlockRequirement {
  /** Minimal skill level required to access the activity. */
  minLevel: number;
  /** Whether at least one reincarnation is required. */
  requiresReincarnation: boolean;
}

/**
 * Reward outcome from completing a timed activity.
 * For now this mirrors the offline-progress payloads (XP + items).
 * It can be extended later with spirit stones, achievements, etc.
 */
export interface RewardResult {
  xp: number;
  items: Item[];
}

/**
 * Static definition for a timed activity family (fishing / mining / gathering).
 *
 * - TKind: discriminant for the activity family (SkillKind).
 * - TArea: registry entry type (area definition).
 * - TRuntime: runtime state stored in Redux for the current activity.
 */
export interface ActivityDefinition<
  TKind extends SkillKind,
  TArea extends BaseArea,
  TRuntime extends ActivityRuntimeStateBase,
> {
  kind: TKind;

  /** Selector for the current runtime state in Redux. */
  selectCurrentArea: (state: RootState) => TRuntime | null;
  /** Selector for cast start time (ms since epoch) for progress calculations. */
  selectCastStartTime: (state: RootState) => number | null;
  /** Selector for cast duration (ms) for progress calculations. */
  selectCastDuration: (state: RootState) => number;
  /** Selector for current XP in this skill. */
  selectXP: (state: RootState) => number;

  /**
   * Build the runtime state payload for a given registry entry. This is
   * the only place that defines the payload shape for the skills slice.
   */
  buildRuntimeState: (area: TArea) => TRuntime;

  /**
   * Action creator for updating the current runtime state in Redux.
   * Null clears the activity and its cast timers.
   */
  setCurrentArea: (payload: TRuntime | null) => { type: string; payload: TRuntime | null };

  /**
   * Derive unlock requirements from a registry entry. Containers can
   * combine this with current level / reincarnation count to decide
   * whether to show an activity as locked or unlocked.
   */
  getUnlockRequirement: (area: TArea) => UnlockRequirement;
}

/**
 * Concrete activity definitions for the three timed skills.
 */
export const fishingActivityDefinition: ActivityDefinition<
  "fishing",
  FishingAreaI,
  FishingRuntimeState
> = {
  kind: "fishing",
  selectCurrentArea: selectCurrentFishingArea,
  selectCastStartTime: selectFishingCastStartTime,
  selectCastDuration: selectFishingCastDuration,
  selectXP: selectFishingXP,
  buildRuntimeState: (area) => ({
    areaId: area.id,
    xp: area.xp,
    delay: area.delay,
    fishingLootIds: area.fishingLootIds,
    rareDropChancePercent: area.rareDropChancePercent,
    rareDropItemIds: area.rareDropItemIds,
  }),
  setCurrentArea: setCurrentFishingArea,
  getUnlockRequirement: (area) => ({
    minLevel: area.xpUnlock, // translated to a level by the skill-level helpers
    requiresReincarnation: Boolean(area.requiresReincarnation),
  }),
};

export const miningActivityDefinition: ActivityDefinition<
  "mining",
  MiningAreaI,
  MiningRuntimeState
> = {
  kind: "mining",
  selectCurrentArea: selectCurrentMiningArea,
  selectCastStartTime: selectMiningCastStartTime,
  selectCastDuration: selectMiningCastDuration,
  selectXP: selectMiningXP,
  buildRuntimeState: (area) => ({
    areaId: area.id,
    xp: area.xp,
    delay: area.delay,
    miningLootId: area.miningLootId,
  }),
  setCurrentArea: setCurrentMiningArea,
  getUnlockRequirement: (area) => ({
    minLevel: area.xpUnlock,
    requiresReincarnation: Boolean(area.requiresReincarnation),
  }),
};

export const gatheringActivityDefinition: ActivityDefinition<
  "gathering",
  GatheringAreaI,
  GatheringRuntimeState
> = {
  kind: "gathering",
  selectCurrentArea: selectCurrentGatheringArea,
  selectCastStartTime: selectGatheringCastStartTime,
  selectCastDuration: selectGatheringCastDuration,
  selectXP: selectGatheringXP,
  buildRuntimeState: (area) => ({
    areaId: area.id,
    xp: area.xp,
    delay: area.delay,
    gatheringLootIds: area.gatheringLootIds,
    rareDropChancePercent: area.rareDropChancePercent,
    rareDropItemIds: area.rareDropItemIds,
  }),
  setCurrentArea: setCurrentGatheringArea,
  getUnlockRequirement: (area) => ({
    minLevel: area.xpUnlock,
    requiresReincarnation: Boolean(area.requiresReincarnation),
  }),
};

export const ACTIVITY_DEFINITIONS = {
  fishing: fishingActivityDefinition,
  mining: miningActivityDefinition,
  gathering: gatheringActivityDefinition,
} as const;

export type ActivityKind = SkillKind;

export type ActivityDefinitionFor<K extends ActivityKind> =
  K extends "fishing"
    ? typeof fishingActivityDefinition
    : K extends "mining"
      ? typeof miningActivityDefinition
      : K extends "gathering"
        ? typeof gatheringActivityDefinition
        : never;


