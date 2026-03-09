import type { TimedActivityArea } from "./TimedActivityArea";

export interface FishingAreaI extends TimedActivityArea {
  fishingLootIds: number[];
  /** Optional rare drop chance (0–100) and item ids (e.g. ring/amulet). */
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
}

export default FishingAreaI;
