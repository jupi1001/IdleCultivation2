import type { TimedActivityArea } from "./TimedActivityArea";

export interface MiningAreaI extends TimedActivityArea {
  /** Single loot item id (area gives one resource type, e.g. copper ore). */
  miningLootId: number;
}

export default MiningAreaI;
