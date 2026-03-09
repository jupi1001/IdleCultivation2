import type { TimedActivityArea } from "./TimedActivityArea";

export interface GatheringAreaI extends TimedActivityArea {
  /** Loot item ids: one for fixed (wood), multiple for loot table (herbs). */
  gatheringLootIds: number[];
  /** Optional rare drop chance (0–100) and item ids (e.g. ring/amulet). */
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
}

export default GatheringAreaI;
