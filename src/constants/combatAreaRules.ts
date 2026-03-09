/**
 * Combat area rules: realm requirements, can enter, sect raid detection.
 */
export { AREA_REALM_REQUIREMENTS, canEnterArea, formatRealmRequirement } from "./areaRealmRequirements";
export type { RealmRequirement } from "./areaRealmRequirements";
import { CombatArea } from "../enum/CombatArea";

const SECT_RAID_AREAS = new Set<string>([
  CombatArea.JADE_MOUNTAIN_RAID,
  CombatArea.VERDANT_VALLEY_RAID,
  CombatArea.AZURE_SKY_RAID,
  CombatArea.CRIMSON_DEMON_RAID,
  CombatArea.SHADOW_SERPENT_RAID,
  CombatArea.BONE_ABYSS_RAID,
]);

export function isSectRaidArea(area: string | undefined): boolean {
  return area != null && SECT_RAID_AREAS.has(area);
}

/** Map sect raid area string to sect id (1–6). */
export const SECT_RAID_AREA_TO_SECT_ID: Record<string, number> = {
  [CombatArea.JADE_MOUNTAIN_RAID]: 1,
  [CombatArea.VERDANT_VALLEY_RAID]: 2,
  [CombatArea.AZURE_SKY_RAID]: 3,
  [CombatArea.CRIMSON_DEMON_RAID]: 4,
  [CombatArea.SHADOW_SERPENT_RAID]: 5,
  [CombatArea.BONE_ABYSS_RAID]: 6,
};
