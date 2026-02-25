interface GatheringAreaI {
  id: number;
  name: string;
  gatheringXP: number;
  gatheringXPUnlock: number;
  gatheringDelay: number;
  /** Loot item ids: one for fixed (wood), multiple for loot table (herbs). */
  gatheringLootIds: number[];
  picture: string;
  altText: string;
  /** Optional rare drop chance (0–100) and item ids (e.g. ring/amulet). */
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
}

export default GatheringAreaI;
