/**
 * Domain sects: sect list, ranks, stores and by-id registry.
 */
export { SECT_POSITIONS } from "./sectRanks";
export type { SectPositionId } from "./sectRanks";
export { pathDescriptions, sectsData } from "./sectsData";
export { sectStoreData, getSectRaidLootForRank, getSectStoreItemsFlat } from "./sectStores";
export type { SectStoreEntryI } from "./sectStores";

import type SectI from "../../interfaces/SectI";
import { sectsData } from "./sectsData";

export const SECTS_BY_ID: Record<number, SectI> = Object.fromEntries(
  sectsData.map((s) => [s.id, s])
) as Record<number, SectI>;
