interface FishingAreaI {
  id: number;
  name: string;
  fishingXP: number;
  fishingXPUnlock: number;
  fishingDelay: number;
  fishingLootIds: number[];
  /** Path to area image (e.g. /assets/fishing/village-pond.png). Use altText when image is missing. */
  picture: string;
  /** Alt text for the area image (placeholder / accessibility). */
  altText: string;
}

export default FishingAreaI;
