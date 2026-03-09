/**
 * Domain items: techniques, materials, consumables, shop items. Registries built at data layer.
 * Use ITEMS_BY_ID (from constants/data or domain build) for constant-time item lookup.
 */
export { QI_TECHNIQUES, COMBAT_TECHNIQUES, existingShopQiTechniques, existingShopCombatTechniques } from "./techniques";
export { fishTypes } from "./fish";
export { oreTypes } from "./ore";
export { woodTypes } from "./wood";
export { herbTypes } from "./herbs";
export { existingShopItems, existingBlackMarketItems, existingShopItemUpgrades } from "./shopItems";
export { buildItemsById } from "./registry";

import type Item from "../../interfaces/ItemI";
import { herbTypes } from "./herbs";
import { woodTypes } from "./wood";

/** All gathering loot (wood + herbs) for lookup when completing a gather. */
export const gatheringLootTypes: Item[] = [...woodTypes, ...herbTypes];
