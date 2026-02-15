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
}

export default GatheringAreaI;
