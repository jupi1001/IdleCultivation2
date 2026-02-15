import type { RealmId } from "../constants/realmProgression";

export interface RealmRequirement {
  realmId: RealmId;
  realmLevel: number;
}

/** Effect applied per level of the talent (e.g. +5 attack per level). Use "vitality" for character health. */
export interface TalentEffect {
  type: "attack" | "defense" | "vitality" | "qiGain" | "fishingXP";
  value: number;
}

export interface TalentNode {
  id: number;
  name: string;
  description: string;
  /** Qi cost per level */
  costQi: number;
  /** Max levels (1 = one-time 1/1, 6 = 0/6 style) */
  maxLevel: number;
  requiredRealm?: RealmRequirement;
  /** Must have these talent ids at max level before this node can be purchased */
  requiredTalentIds?: number[];
  effect: TalentEffect;
}

/** One tier of the tree: optional realm gate label, then nodes */
export interface TalentTreeTier {
  /** If set, a horizontal "Foundation Establishment" style divider is shown above these nodes */
  realmGate?: RealmRequirement;
  nodes: TalentNode[];
}
