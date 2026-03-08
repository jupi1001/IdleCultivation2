import type { BaseArea } from "./BaseArea";

export interface MiningAreaI extends BaseArea {
  miningXP: number;
  miningXPUnlock: number;
  miningDelay: number;
  /** Single loot item id (area gives one resource type, e.g. copper ore). */
  miningLootId: number;
}

export default MiningAreaI;
