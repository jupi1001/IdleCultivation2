/** Major realm ids in order. Mortal has no minor levels (0). Others have 1-10. */
export const REALM_ORDER = [
  "Mortal",
  "Qi Condensation",
  "Foundation Establishment",
  "Golden Core",
  "Nascent Soul",
  "Soul Formation",
  "Void Refinement",
  "Body Integration",
  "Mahayana",
  "Tribulation Transcendent",
  "Immortal",
] as const;
export type RealmId = (typeof REALM_ORDER)[number];

/** Minor levels per major realm. Mortal = 0 (no levels), others 1-10 */
export const REALM_LEVELS: Record<RealmId, number> = {
  Mortal: 0,
  "Qi Condensation": 10,
  "Foundation Establishment": 10,
  "Golden Core": 10,
  "Nascent Soul": 10,
  "Soul Formation": 10,
  "Void Refinement": 10,
  "Body Integration": 10,
  Mahayana: 10,
  "Tribulation Transcendent": 10,
  Immortal: 10,
};

const BREAKTHROUGH_QI_BASE = 100;

/** Step index: Mortal=0, QC1=1..QC10=10, FE1=11..20, Golden Core 1=21..30, ... Immortal 10=100 */
export function getStepIndex(realmId: RealmId, realmLevel: number): number {
  if (realmId === "Mortal") return 0;
  const realmIndex = REALM_ORDER.indexOf(realmId);
  return (realmIndex - 1) * 10 + realmLevel;
}

/** Qi required to breakthrough from current realm/level to next. */
export function getBreakthroughQiRequired(realmId: RealmId, realmLevel: number): number {
  const next = getNextRealm(realmId, realmLevel);
  if (!next) return Infinity;
  const nextStep = getStepIndex(next.realmId, next.realmLevel);
  return BREAKTHROUGH_QI_BASE + nextStep * 50;
}

/** Get next realm and level, or null if already max */
export function getNextRealm(
  realmId: RealmId,
  realmLevel: number
): { realmId: RealmId; realmLevel: number } | null {
  const currentIndex = REALM_ORDER.indexOf(realmId);
  const maxLevel = REALM_LEVELS[realmId];
  if (realmId === "Mortal") {
    return { realmId: "Qi Condensation", realmLevel: 1 };
  }
  if (realmLevel < maxLevel) {
    return { realmId, realmLevel: realmLevel + 1 };
  }
  if (currentIndex < REALM_ORDER.length - 1) {
    return { realmId: REALM_ORDER[currentIndex + 1], realmLevel: 1 };
  }
  return null;
}

/** Format for display: "Qi Condensation 3" or "Mortal" */
export function formatRealm(realmId: RealmId, realmLevel: number): string {
  if (realmId === "Mortal") return "Mortal";
  return `${realmId} ${realmLevel}`;
}

/** Combat stats from cultivation realm. Step 0 (Mortal) = 10/1/10; scales with step. Items can add on top later. */
export function getCombatStatsFromRealm(
  realmId: RealmId,
  realmLevel: number
): { attack: number; defense: number; health: number } {
  const step = getStepIndex(realmId, realmLevel);
  return {
    attack: 10 + step * 2,
    defense: 1 + step,
    health: 10 + step * 3,
  };
}
