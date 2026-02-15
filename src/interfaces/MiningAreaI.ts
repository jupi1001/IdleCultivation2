interface MiningAreaI {
  id: number;
  name: string;
  miningXP: number;
  miningXPUnlock: number;
  miningDelay: number;
  /** Single loot item id (area gives one resource type, e.g. copper ore). */
  miningLootId: number;
  picture: string;
  altText: string;
}

export default MiningAreaI;
