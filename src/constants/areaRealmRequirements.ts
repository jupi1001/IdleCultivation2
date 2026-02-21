import { CombatArea } from "../enum/CombatArea";
import type { RealmId } from "./realmProgression";
import { getStepIndex } from "./realmProgression";

export interface RealmRequirement {
  realmId: RealmId;
  realmLevel: number;
}

/** Minimum realm to enter each combat area. 1:1 with CombatArea. */
export const AREA_REALM_REQUIREMENTS: Record<string, RealmRequirement> = {
  [CombatArea.FARM]: { realmId: "Mortal", realmLevel: 0 },
  [CombatArea.CAVE]: { realmId: "Qi Condensation", realmLevel: 1 },
  [CombatArea.CRYSTALCAVE]: { realmId: "Foundation Establishment", realmLevel: 1 },
  [CombatArea.RIVER]: { realmId: "Golden Core", realmLevel: 1 },
  [CombatArea.RUINS]: { realmId: "Nascent Soul", realmLevel: 1 },
  [CombatArea.SWAMP]: { realmId: "Soul Formation", realmLevel: 1 },
  [CombatArea.RIFT]: { realmId: "Void Refinement", realmLevel: 1 },
  [CombatArea.PEAK]: { realmId: "Body Integration", realmLevel: 1 },
  [CombatArea.SEA]: { realmId: "Mahayana", realmLevel: 1 },
  [CombatArea.STORM]: { realmId: "Tribulation Transcendent", realmLevel: 1 },
  [CombatArea.PALACE]: { realmId: "Immortal", realmLevel: 1 },
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
