/**
 * Centralized content rules: unlock checks, entry conditions.
 * Pure functions so UI only renders what these return; no realm/area logic in components.
 */
import type { RealmId } from "../constants/realmProgression";
import {
  AREA_REALM_REQUIREMENTS,
  canEnterArea,
  type RealmRequirement,
} from "../constants/areaRealmRequirements";
import type { BaseArea } from "../interfaces/BaseArea";

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

/** Area has xpUnlock field for a skill. */
export type SkillAreaWithUnlock = BaseArea & {
  fishingXPUnlock?: number;
  miningXPUnlock?: number;
  gatheringXPUnlock?: number;
};

/** Whether a skill area is unlocked: reincarnation gating + XP >= area's xpUnlock. */
export function isSkillAreaUnlocked(
  area: SkillAreaWithUnlock,
  xp: number,
  reincarnationCount: number,
  xpUnlockKey: "fishingXPUnlock" | "miningXPUnlock" | "gatheringXPUnlock"
): boolean {
  const reincarnationOk = !area.requiresReincarnation || reincarnationCount >= 1;
  const xpUnlock = area[xpUnlockKey];
  if (xpUnlock == null) return reincarnationOk;
  return reincarnationOk && xp >= xpUnlock;
}
