import { CombatArea } from "../enum/CombatArea";
import type { RealmId } from "./realmProgression";
import { getStepIndex } from "./realmProgression";

export interface RealmRequirement {
  realmId: RealmId;
  realmLevel: number;
}

/** Minimum realm to enter each combat area */
export const AREA_REALM_REQUIREMENTS: Record<string, RealmRequirement> = {
  [CombatArea.FARM]: { realmId: "Mortal", realmLevel: 0 },
  [CombatArea.CAVE]: { realmId: "Qi Condensation", realmLevel: 3 },
  [CombatArea.CRYSTALCAVE]: { realmId: "Foundation Establishment", realmLevel: 1 },
};

export function canEnterArea(
  characterRealm: RealmId,
  characterLevel: number,
  required: RealmRequirement
): boolean {
  const charStep = getStepIndex(characterRealm, characterLevel);
  const reqStep = getStepIndex(required.realmId, required.realmLevel);
  return charStep >= reqStep;
}

export function formatRealmRequirement(req: RealmRequirement): string {
  if (req.realmId === "Mortal") return "Mortal";
  return `${req.realmId} ${req.realmLevel}`;
}
