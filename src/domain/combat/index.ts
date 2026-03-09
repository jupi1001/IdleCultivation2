/**
 * Combat domain: area rules, loot resolution, combat math.
 * Re-exports from constants and utils for a single entry point.
 */
export {
  AREA_REALM_REQUIREMENTS,
  canEnterArea,
  formatRealmRequirement,
  isSectRaidArea,
  SECT_RAID_AREA_TO_SECT_ID,
} from "../../constants/combatAreaRules";
export type { RealmRequirement } from "../../constants/areaRealmRequirements";
export {
  getResolvedLootTable,
  getEnemyLootEntries,
  rollOneDrop,
} from "../../utils/combatLoot";
export {
  computeBlockChance,
  doesHit,
  getDamageRange,
  computeBaseDamage,
} from "../../utils/combatMath";
export type { SectLootContext, ResolvedLootTable, EnemyLootDisplayEntry } from "../../types/combatTypes";
