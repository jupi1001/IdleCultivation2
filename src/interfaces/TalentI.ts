import type { CultivationPath } from "../constants/cultivationPath";
import type { RealmId } from "../constants/realmProgression";

export interface RealmRequirement {
  realmId: RealmId;
  realmLevel: number;
}

/** Effect types: flat stats, Qi gain, skill %, combat %, economy %. */
export type TalentEffectType =
  | "attack"
  | "defense"
  | "vitality"
  | "qiGain"
  | "fishingXP"
  | "fishingSpeedPercent"
  | "miningYieldPercent"
  | "gatheringSpeedPercent"
  | "alchemySuccessPercent"
  | "forgingSpeedPercent"
  | "cookingSpeedPercent"
  | "critChancePercent"
  | "lifestealPercent"
  | "damageReflectPercent"
  | "aoeChancePercent"
  | "spiritStoneIncomePercent"
  | "shopDiscountPercent";

/** Effect applied per level of the talent. Percent types use value as the percent (e.g. 5 = 5%). */
export interface TalentEffect {
  type: TalentEffectType;
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
  /** If set, only this path can see and purchase this node */
  path?: CultivationPath;
  effect: TalentEffect;
}

/** One tier of the tree: optional realm gate label, then nodes */
export interface TalentTreeTier {
  /** If set, a horizontal "Foundation Establishment" style divider is shown above these nodes */
  realmGate?: RealmRequirement;
  nodes: TalentNode[];
}
