/**
 * Centralized loot table assembly for skill areas.
 * Pure functions so UI only passes through the result; no loot logic in components.
 */
import { ITEMS_BY_ID } from "../constants/data";
import { getRingAmuletItemById } from "../constants/ringsAmulets";
import { getSkillingSetItemById, getSetPieceIds, type SkillSetTier } from "../constants/skillingSets";
import type { FishingAreaI } from "../interfaces/FishingAreaI";
import type { GatheringAreaI } from "../interfaces/GatheringAreaI";
import type { MiningAreaI } from "../interfaces/MiningAreaI";
import type { LootTableEntry } from "../components/LootTablePopover/LootTablePopover";

const SET_CHANCE_PERCENT = 1 / 4;

/** Build loot entries for a fishing area (fish + rare drops + set pieces). */
export function getFishingAreaLootEntries(area: FishingAreaI, tier: SkillSetTier): LootTableEntry[] {
  const entries: LootTableEntry[] = [];
  const n = area.fishingLootIds.length;
  const fishChancePercent = n > 0 ? Math.round(100 / n) : 0;
  for (const id of area.fishingLootIds) {
    const item = ITEMS_BY_ID[id];
    if (item) entries.push({ item, chancePercent: fishChancePercent });
  }
  if (area.rareDropChancePercent != null && area.rareDropItemIds?.length) {
    for (const id of area.rareDropItemIds) {
      const rare = getRingAmuletItemById(id);
      if (rare) entries.push({ item: rare, chancePercent: area.rareDropChancePercent });
    }
  }
  const setPieceIds = getSetPieceIds("fishing", tier);
  for (const pieceId of setPieceIds) {
    const piece = getSkillingSetItemById(pieceId);
    if (piece) entries.push({ item: piece, chancePercent: SET_CHANCE_PERCENT });
  }
  return entries;
}

/** Build loot entries for a mining area (ore + set pieces). */
export function getMiningAreaLootEntries(area: MiningAreaI, tier: SkillSetTier): LootTableEntry[] {
  const entries: LootTableEntry[] = [];
  const ore = ITEMS_BY_ID[area.miningLootId];
  if (ore) entries.push({ item: ore, chancePercent: 100 });
  const setPieceIds = getSetPieceIds("mining", tier);
  for (const pieceId of setPieceIds) {
    const piece = getSkillingSetItemById(pieceId);
    if (piece) entries.push({ item: piece, chancePercent: SET_CHANCE_PERCENT });
  }
  return entries;
}

/** Build loot entries for a gathering area (primary loot + rare drops + set pieces). */
export function getGatheringAreaLootEntries(area: GatheringAreaI, tier: SkillSetTier): LootTableEntry[] {
  const entries: LootTableEntry[] = [];
  const n = area.gatheringLootIds.length;
  const lootChancePercent = n > 0 ? Math.round(100 / n) : 0;
  for (const id of area.gatheringLootIds) {
    const item = ITEMS_BY_ID[id];
    if (item) entries.push({ item, chancePercent: lootChancePercent });
  }
  if (area.rareDropChancePercent != null && area.rareDropItemIds?.length) {
    for (const id of area.rareDropItemIds) {
      const rare = getRingAmuletItemById(id);
      if (rare) entries.push({ item: rare, chancePercent: area.rareDropChancePercent });
    }
  }
  const setPieceIds = getSetPieceIds("gathering", tier);
  for (const pieceId of setPieceIds) {
    const piece = getSkillingSetItemById(pieceId);
    if (piece) entries.push({ item: piece, chancePercent: SET_CHANCE_PERCENT });
  }
  return entries;
}
