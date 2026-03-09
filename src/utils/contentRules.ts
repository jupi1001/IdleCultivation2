/**
 * Centralized content rules: unlock checks, entry conditions.
 * Pure functions so UI only renders what these return; no realm/area logic in components.
 */
import {
  AREA_REALM_REQUIREMENTS,
  canEnterArea,
  type RealmRequirement,
} from "../constants/areaRealmRequirements";
import type { RealmId } from "../constants/realmProgression";
import type { TimedActivityArea } from "../interfaces/TimedActivityArea";

/** Whether the character can enter a combat area by realm/level. */
export function canEnterCombatArea(
  characterRealm: RealmId,
  characterLevel: number,
  areaKey: string
): boolean {
  const required = AREA_REALM_REQUIREMENTS[areaKey];
  if (!required) return true;
  return canEnterArea(characterRealm, characterLevel, required);
}

/** Realm requirement for a combat area (for display). */
export function getCombatAreaRealmRequirement(areaKey: string): RealmRequirement | undefined {
  return AREA_REALM_REQUIREMENTS[areaKey];
}

/** Whether a skill area is unlocked: reincarnation gating + XP >= area's xpUnlock. */
export function isSkillAreaUnlocked(
  area: TimedActivityArea,
  xp: number,
  reincarnationCount: number
): boolean {
  const reincarnationOk = !area.requiresReincarnation || reincarnationCount >= 1;
  return reincarnationOk && xp >= area.xpUnlock;
}
