interface FishingAreaI {
  id: number;
  name: string;
  fishingXP: number;
  fishingXPUnlock: number;
  fishingDelay: number;
  fishingLootIds: number[];
  /** Path to area image (e.g. /assets/fishing/village-pond.webp). Use altText when image is missing. */
  picture: string;
  /** Alt text for the area image (placeholder / accessibility). */
  altText: string;
  /** Optional rare drop chance (0–100) and item ids (e.g. ring/amulet). */
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
  /** If true, area only unlocks after at least one reincarnation (level 100+ content). */
  requiresReincarnation?: boolean;
}

export default FishingAreaI;
