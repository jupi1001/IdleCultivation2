/**
 * Computes offline progress (meditation, labour, fishing, mining, gathering) for the time
 * the player was away. Used after rehydration to apply gains and show Welcome Back modal.
 */
import type { RootState } from "../state/store";
import { BASE_QI_PER_SECOND } from "../constants/meditation";
import { OFFLINE_PROGRESS_CAP_MS, OFFLINE_PROGRESS_MIN_MS, LAST_ACTIVE_STORAGE_KEY } from "../constants/offlineProgress";
import { fishingAreaData, fishTypes, gatheringAreaData, gatheringLootTypes, miningAreaData, oreTypes } from "../constants/data";
import { getRingAmuletItemById } from "../constants/ringsAmulets";
import {
  getSetPieceIds,
  getTierForFishingAreaIndex,
  getTierForGatheringAreaIndex,
  getTierForMiningAreaIndex,
  getSkillingSetItemById,
  SKILLING_SET_DROP_CHANCE_PERCENT,
} from "../constants/skillingSets";
import { getSkillSpeedBonusFishing, getSkillSpeedBonusMining, getSkillSpeedBonusGathering, getOwnedSkillingSetPieceIds } from "../state/selectors/characterSelectors";
import { rollOneTimeDrop } from "./oneTimeDrops";
import type Item from "../interfaces/ItemI";
import type { CurrentFishingArea, CurrentGatheringArea, CurrentMiningArea } from "../state/reducers/characterSlice";
import { GEODE_ITEM } from "../constants/gems";

export interface OfflineSkillResult {
  xp: number;
  casts: number;
  items: Item[];
}

export interface OfflineProgressResult {
  offlineMs: number;
  offlineQi: number;
  offlineSpiritStones: number;
  fishing?: OfflineSkillResult;
  mining?: OfflineSkillResult;
  gathering?: OfflineSkillResult;
}

function rollRareDropRingAmulet(
  rareDropChancePercent: number | undefined,
  rareDropItemIds: number[] | undefined
): Item | null {
  if (
    rareDropChancePercent == null ||
    rareDropItemIds == null ||
    rareDropItemIds.length === 0 ||
    Math.random() * 100 >= rareDropChancePercent
  )
    return null;
  const rareId = rareDropItemIds[Math.floor(Math.random() * rareDropItemIds.length)];
  return getRingAmuletItemById(rareId) ?? null;
}

function rollSkillingSetForArea(
  skill: "fishing" | "mining" | "gathering",
  areaId: number,
  areaData: { id: number }[],
  getTier: (areaIndex: number) => "lesser" | "greater" | "perfected",
  ownedIds: Set<number>
): Item | null {
  const areaIndex = areaData.findIndex((a) => a.id === areaId);
  if (areaIndex < 0) return null;
  const tier = getTier(areaIndex);
  const pieceIds = getSetPieceIds(skill, tier);
  return rollOneTimeDrop(ownedIds, pieceIds, SKILLING_SET_DROP_CHANCE_PERCENT, getSkillingSetItemById);
}

/**
 * Compute offline progress from state and current time.
 * Returns null if lastActiveTimestamp was never set, or offline duration is below minimum.
 * Caps offline duration at OFFLINE_PROGRESS_CAP_MS.
 */
export function computeOfflineProgress(state: RootState, now: number): OfflineProgressResult | null {
  const char = state.character;
  let lastActive = char.lastActiveTimestamp;
  if (typeof lastActive !== "number" || !lastActive || lastActive <= 0) return null;

  const fromStorage = typeof localStorage !== "undefined" ? localStorage.getItem(LAST_ACTIVE_STORAGE_KEY) : null;
  if (fromStorage) {
    const stored = parseInt(fromStorage, 10);
    if (!isNaN(stored) && stored > lastActive) lastActive = stored;
  }

  let offlineMs = now - lastActive;
  if (offlineMs < OFFLINE_PROGRESS_MIN_MS) return null;
  offlineMs = Math.min(offlineMs, OFFLINE_PROGRESS_CAP_MS);

  const result: OfflineProgressResult = {
    offlineMs,
    offlineQi: 0,
    offlineSpiritStones: 0,
  };

  const activity = char.currentActivity;

  // Labour: miners always generate spirit stones (1 per second per miner)
  result.offlineSpiritStones = char.miner * (offlineMs / 1000);

  // Meditation: only when activity was meditate (not when on expedition, etc.)
  if (activity === "meditate") {
    const qiPerSecond =
      BASE_QI_PER_SECOND +
      (char.equipment.qiTechnique?.qiGainBonus ?? 0) +
      (char.equipment.amulet?.qiGainBonus ?? 0);
    result.offlineQi = qiPerSecond * (offlineMs / 1000);
  }

  // Fishing
  if (activity === "fish" && char.currentFishingArea) {
    const area = char.currentFishingArea as CurrentFishingArea;
    const skillBonus = getSkillSpeedBonusFishing(state);
    const effectiveDuration = Math.max(100, area.fishingDelay * (1 - skillBonus / 100));
    const casts = Math.floor(offlineMs / effectiveDuration);
    if (casts > 0) {
      const items: Item[] = [];
      let xp = 0;
      const ownedSetIds = new Set(getOwnedSkillingSetPieceIds(state));
      for (let i = 0; i < casts; i++) {
        xp += area.fishingXP;
        const randomId = area.fishingLootIds[Math.floor(Math.random() * area.fishingLootIds.length)];
        const fish = fishTypes.find((f) => f.id === randomId);
        if (fish) items.push(fish);
        const rare = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
        if (rare) items.push(rare);
        const setPiece = rollSkillingSetForArea(
          "fishing",
          area.areaId,
          fishingAreaData,
          getTierForFishingAreaIndex,
          ownedSetIds
        );
        if (setPiece) {
          items.push(setPiece);
          ownedSetIds.add(setPiece.id);
        }
      }
      result.fishing = { xp, casts, items };
    }
  }

  // Mining
  if (activity === "mine" && char.currentMiningArea) {
    const area = char.currentMiningArea as CurrentMiningArea;
    const skillBonus = getSkillSpeedBonusMining(state);
    const effectiveDuration = Math.max(100, area.miningDelay * (1 - skillBonus / 100));
    const casts = Math.floor(offlineMs / effectiveDuration);
    if (casts > 0) {
      const items: Item[] = [];
      let xp = 0;
      const ownedSetIds = new Set(getOwnedSkillingSetPieceIds(state));
      for (let i = 0; i < casts; i++) {
        xp += area.miningXP;
        const ore = oreTypes.find((o) => o.id === area.miningLootId);
        if (ore) items.push(ore);
        if (Math.random() * 100 < 3) items.push(GEODE_ITEM);
        const setPiece = rollSkillingSetForArea(
          "mining",
          area.areaId,
          miningAreaData,
          getTierForMiningAreaIndex,
          ownedSetIds
        );
        if (setPiece) {
          items.push(setPiece);
          ownedSetIds.add(setPiece.id);
        }
      }
      result.mining = { xp, casts, items };
    }
  }

  // Gathering
  if (activity === "gather" && char.currentGatheringArea) {
    const area = char.currentGatheringArea as CurrentGatheringArea;
    const skillBonus = getSkillSpeedBonusGathering(state);
    const effectiveDuration = Math.max(100, area.gatheringDelay * (1 - skillBonus / 100));
    const casts = Math.floor(offlineMs / effectiveDuration);
    if (casts > 0) {
      const items: Item[] = [];
      let xp = 0;
      const ownedSetIds = new Set(getOwnedSkillingSetPieceIds(state));
      for (let i = 0; i < casts; i++) {
        xp += area.gatheringXP;
        const randomId = area.gatheringLootIds[Math.floor(Math.random() * area.gatheringLootIds.length)];
        const loot = gatheringLootTypes.find((l) => l.id === randomId);
        if (loot) items.push(loot);
        const rare = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
        if (rare) items.push(rare);
        const setPiece = rollSkillingSetForArea(
          "gathering",
          area.areaId,
          gatheringAreaData,
          getTierForGatheringAreaIndex,
          ownedSetIds
        );
        if (setPiece) {
          items.push(setPiece);
          ownedSetIds.add(setPiece.id);
        }
      }
      result.gathering = { xp, casts, items };
    }
  }

  const hasGains =
    result.offlineQi > 0 ||
    result.offlineSpiritStones > 0 ||
    result.fishing != null ||
    result.mining != null ||
    result.gathering != null;
  return hasGains ? result : null;
}
