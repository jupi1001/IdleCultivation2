/**
 * Shared types for combat (engine, container, loot).
 */
import type Item from "../interfaces/ItemI";

export interface CombatLootEntry {
  item: Item;
  weight: number;
}

/** Context passed when resolving loot (normal vs sect raid). */
export interface SectLootContext {
  area: string | undefined;
  currentSectId: number | null;
  path: string | null;
  sectRankIndex: number;
}

/** Result of resolving enemy loot table (for UI display or rolling). */
export interface ResolvedLootTable {
  items: Item[];
  weight: number[];
}
