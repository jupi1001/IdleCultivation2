/**
 * Domain combat: combat-specific data and registries.
 *
 * Note: Enemies live in `domain/enemies`. Import from `domain/enemies` for enemy data
 * and from `domain/combat` for combat-only registries and helpers.
 */
export { COMBAT_DROP_IDS, COMBAT_DROP_ITEMS } from "../../constants/combatDrops";

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
