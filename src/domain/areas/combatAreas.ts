/**
 * Combat area metadata (e.g. pill tier index for scaled loot). CombatArea enum lives in enum/CombatArea.
 */
import { CombatArea } from "../../enum/CombatArea";

/** Combat area -> pill tier (0 = Basic Qi Pill, 9 = Transcendent). Used for scaled combat loot. */
export const COMBAT_AREA_PILL_INDEX: Record<CombatArea, number> = {
  [CombatArea.FARM]: 0,
  [CombatArea.CAVE]: 1,
  [CombatArea.CRYSTALCAVE]: 2,
  [CombatArea.RIVER]: 3,
  [CombatArea.RUINS]: 4,
  [CombatArea.SWAMP]: 5,
  [CombatArea.RIFT]: 6,
  [CombatArea.PEAK]: 7,
  [CombatArea.SEA]: 8,
  [CombatArea.STORM]: 9,
  [CombatArea.PALACE]: 10,
  [CombatArea.JADE_MOUNTAIN_RAID]: 11,
  [CombatArea.VERDANT_VALLEY_RAID]: 12,
  [CombatArea.AZURE_SKY_RAID]: 13,
  [CombatArea.CRIMSON_DEMON_RAID]: 14,
  [CombatArea.SHADOW_SERPENT_RAID]: 15,
  [CombatArea.BONE_ABYSS_RAID]: 16,
};
