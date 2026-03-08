/**
 * Sect rank/position definitions. requiredStepIndex from realmProgression.getStepIndex.
 */
export const SECT_POSITIONS = [
  { id: 0, name: "Sect Aspirant", requiredStepIndex: 0, requiredRealmLabel: "Mortal" },
  { id: 1, name: "Outer Disciple", requiredStepIndex: 1, requiredRealmLabel: "Qi Condensation" },
  { id: 2, name: "Inner Disciple", requiredStepIndex: 11, requiredRealmLabel: "Foundation Establishment" },
  { id: 3, name: "Core Disciple", requiredStepIndex: 21, requiredRealmLabel: "Golden Core" },
] as const;

export type SectPositionId = (typeof SECT_POSITIONS)[number]["id"];
