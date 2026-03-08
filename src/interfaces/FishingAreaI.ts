import type { BaseArea } from "./BaseArea";

export interface FishingAreaI extends BaseArea {
  fishingXP: number;
  fishingXPUnlock: number;
  fishingDelay: number;
  fishingLootIds: number[];
  /** Optional rare drop chance (0–100) and item ids (e.g. ring/amulet). */
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
}

export default FishingAreaI;
