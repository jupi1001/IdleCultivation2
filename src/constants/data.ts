/**
 * Thin re-export layer for domain data and registries.
 * Data lives in src/domain/*; this file preserves existing import paths (constants/data)
 * and builds ITEMS_BY_ID from domain item arrays + sect store + combat loot/drops.
 */
import {
  buildItemsById,
  QI_TECHNIQUES,
  COMBAT_TECHNIQUES,
  fishTypes,
  oreTypes,
  woodTypes,
  herbTypes,
  existingShopItems,
  existingBlackMarketItems,
  existingShopItemUpgrades,
} from "../domain/items";
import { getSectStoreItemsFlat } from "../domain/sects";
import type SkillI from "../interfaces/SkillI";
import { parseItems } from "../schemas/items";
import { COMBAT_LOOT_QI_PILLS } from "./alchemy";
import { COMBAT_DROP_ITEMS } from "./combatDrops";
import { COOKING_RECIPES } from "./cooking";

// Re-export all domain data and registries
export {
  QI_TECHNIQUES,
  COMBAT_TECHNIQUES,
  existingShopQiTechniques,
  existingShopCombatTechniques,
  fishTypes,
  oreTypes,
  woodTypes,
  herbTypes,
  gatheringLootTypes,
  existingShopItems,
  existingBlackMarketItems,
  existingShopItemUpgrades,
} from "../domain/items";
export {
  pathDescriptions,
  SECT_POSITIONS,
  sectStoreData,
  getSectRaidLootForRank,
  sectsData,
  SECTS_BY_ID,
} from "../domain/sects";
export type { SectPositionId, SectStoreEntryI } from "../domain/sects";
export { enemies, ENEMIES_BY_ID } from "../domain/enemies";
export {
  fishingAreaData,
  miningAreaData,
  gatheringAreaData,
  FISHING_AREAS_BY_ID,
  MINING_AREAS_BY_ID,
  GATHERING_AREAS_BY_ID,
  FISHING_AREA_INDEX_BY_ID,
  MINING_AREA_INDEX_BY_ID,
  GATHERING_AREA_INDEX_BY_ID,
  COMBAT_AREA_PILL_INDEX,
} from "../domain/areas";

// Build ITEMS_BY_ID from all item sources (sect store last so its entries override any id collision)
const COOKING_OUTPUT_ITEMS = COOKING_RECIPES.map((r) => r.output);
export const ITEMS_BY_ID = buildItemsById([
  QI_TECHNIQUES,
  COMBAT_TECHNIQUES,
  fishTypes,
  oreTypes,
  woodTypes,
  herbTypes,
  existingShopItems,
  existingBlackMarketItems,
  existingShopItemUpgrades,
  COMBAT_LOOT_QI_PILLS,
  COMBAT_DROP_ITEMS,
  COOKING_OUTPUT_ITEMS,
  getSectStoreItemsFlat(),
]);

// Dev/test-only: validate that all items in the registry conform to the Item schema.
if (import.meta.env?.MODE !== "production") {
  parseItems(Object.values(ITEMS_BY_ID));
}

/** Skill list for the activity/skill selector (order and labels). */
export const existingSkills: SkillI[] = [
  { id: 3, name: "Meditation", description: "Cultivate Qi in solitude" },
  { id: 1, name: "Martial Training", description: "Train combat and face trials" },
  { id: 10, name: "Immortals Island", description: "Send expeditions for rewards" },
  { id: 2, name: "Labour", description: "Earn spirit stones" },
  { id: 4, name: "Fishing", description: "Fish in waters for spirit fish" },
  { id: 5, name: "Mining", description: "Mine ores and spirit stones" },
  { id: 6, name: "Gathering", description: "Gather herbs and wood" },
  { id: 8, name: "Alchemy", description: "Craft pills and elixirs" },
  { id: 9, name: "Forging", description: "Upgrade spirit weapons" },
  { id: 11, name: "Cooking", description: "Cook fish for food that restores vitality in combat" },
];
