/**
 * Skilling set pieces: 3 skills × 3 tiers (Lesser, Greater, Perfected) × 4 slots (helmet, body, legs, shoes).
 * Each tier gives per-piece skill speed bonus and a full-set bonus when all 4 are equipped.
 * Drops from fishing/mining/gathering are determined by area index → tier mapping.
 */
import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";

export type SkillSetName = "fishing" | "mining" | "gathering";
export type SkillSetTier = "lesser" | "greater" | "perfected";

const SKILLING_ASSETS = "/assets/skilling";

/** Per-piece skill speed bonus (percent). Full-set bonus is in FULL_SET_BONUS_PERCENT. */
export const PER_PIECE_BONUS_PERCENT: Record<SkillSetTier, number> = {
  lesser: 2,
  greater: 4,
  perfected: 6,
};

/** Extra percent when all 4 pieces of that tier are equipped. */
export const FULL_SET_BONUS_PERCENT: Record<SkillSetTier, number> = {
  lesser: 3,
  greater: 6,
  perfected: 10,
};

/** Slots used by skilling sets (armor slots only). */
const SET_SLOTS: readonly ["helmet", "body", "legs", "shoes"] = ["helmet", "body", "legs", "shoes"];

/** Item ID ranges: Fishing 840–851, Mining 852–863, Gathering 864–875. */
export const SKILLING_SET_IDS = {
  fishing: {
    lesser: { helmet: 840, body: 841, legs: 842, shoes: 843 },
    greater: { helmet: 844, body: 845, legs: 846, shoes: 847 },
    perfected: { helmet: 848, body: 849, legs: 850, shoes: 851 },
  },
  mining: {
    lesser: { helmet: 852, body: 853, legs: 854, shoes: 855 },
    greater: { helmet: 856, body: 857, legs: 858, shoes: 859 },
    perfected: { helmet: 860, body: 861, legs: 862, shoes: 863 },
  },
  gathering: {
    lesser: { helmet: 864, body: 865, legs: 866, shoes: 867 },
    greater: { helmet: 868, body: 869, legs: 870, shoes: 871 },
    perfected: { helmet: 872, body: 873, legs: 874, shoes: 875 },
  },
} as const;

const tierLabel: Record<SkillSetTier, string> = {
  lesser: "Lesser",
  greater: "Greater",
  perfected: "Perfected",
};

function buildPiece(
  skill: SkillSetName,
  tier: SkillSetTier,
  slot: EquipmentSlot,
  id: number
): Item & { equipmentSlot: EquipmentSlot; skillSet: SkillSetName; skillSetTier: SkillSetTier; skillSpeedBonus: number } {
  const skillLabel = skill.charAt(0).toUpperCase() + skill.slice(1);
  const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1);
  const bonus = PER_PIECE_BONUS_PERCENT[tier];
  const picture = `${SKILLING_ASSETS}/${skill}/${tier}-${slot}.webp`;
  return {
    id,
    name: `${tierLabel[tier]} ${skillLabel} ${slotLabel}`,
    description: `Part of the ${tierLabel[tier]} ${skillLabel} set. +${bonus}% ${skill} speed per piece. Full set grants an extra +${FULL_SET_BONUS_PERCENT[tier]}%.`,
    quantity: 1,
    price: 0,
    picture,
    equipmentSlot: slot,
    skillSet: skill,
    skillSetTier: tier,
    skillSpeedBonus: bonus,
  };
}

const fishingLesser = SET_SLOTS.map((slot) =>
  buildPiece("fishing", "lesser", slot, SKILLING_SET_IDS.fishing.lesser[slot])
);
const fishingGreater = SET_SLOTS.map((slot) =>
  buildPiece("fishing", "greater", slot, SKILLING_SET_IDS.fishing.greater[slot])
);
const fishingPerfected = SET_SLOTS.map((slot) =>
  buildPiece("fishing", "perfected", slot, SKILLING_SET_IDS.fishing.perfected[slot])
);

const miningLesser = SET_SLOTS.map((slot) =>
  buildPiece("mining", "lesser", slot, SKILLING_SET_IDS.mining.lesser[slot])
);
const miningGreater = SET_SLOTS.map((slot) =>
  buildPiece("mining", "greater", slot, SKILLING_SET_IDS.mining.greater[slot])
);
const miningPerfected = SET_SLOTS.map((slot) =>
  buildPiece("mining", "perfected", slot, SKILLING_SET_IDS.mining.perfected[slot])
);

const gatheringLesser = SET_SLOTS.map((slot) =>
  buildPiece("gathering", "lesser", slot, SKILLING_SET_IDS.gathering.lesser[slot])
);
const gatheringGreater = SET_SLOTS.map((slot) =>
  buildPiece("gathering", "greater", slot, SKILLING_SET_IDS.gathering.greater[slot])
);
const gatheringPerfected = SET_SLOTS.map((slot) =>
  buildPiece("gathering", "perfected", slot, SKILLING_SET_IDS.gathering.perfected[slot])
);

export type SkillingSetItem = Item & {
  equipmentSlot: EquipmentSlot;
  skillSet: SkillSetName;
  skillSetTier: SkillSetTier;
  skillSpeedBonus: number;
};

export const SKILLING_SET_ITEMS: SkillingSetItem[] = [
  ...fishingLesser,
  ...fishingGreater,
  ...fishingPerfected,
  ...miningLesser,
  ...miningGreater,
  ...miningPerfected,
  ...gatheringLesser,
  ...gatheringGreater,
  ...gatheringPerfected,
];

export function getSkillingSetItemById(id: number): SkillingSetItem | undefined {
  return SKILLING_SET_ITEMS.find((i) => i.id === id);
}

/** All item IDs that are skilling set pieces (for owned check in loot tables). */
export const ALL_SKILLING_SET_ITEM_IDS = SKILLING_SET_ITEMS.map((i) => i.id);

/** Chance (0–100) to drop one random set piece of the area's tier per cast/gather. */
export const SKILLING_SET_DROP_CHANCE_PERCENT = 1;

/**
 * Map area index (0-based) to tier for each skill.
 * Fishing: 15 areas → 0–4 Lesser, 5–9 Greater, 10–14 Perfected.
 * Mining: 14 areas → 0–4 Lesser, 5–9 Greater, 10–13 Perfected.
 * Gathering: 15 areas → 0–4 Lesser, 5–9 Greater, 10–14 Perfected.
 */
export function getTierForFishingAreaIndex(areaIndex: number): SkillSetTier {
  if (areaIndex < 5) return "lesser";
  if (areaIndex < 10) return "greater";
  return "perfected";
}

export function getTierForMiningAreaIndex(areaIndex: number): SkillSetTier {
  if (areaIndex < 5) return "lesser";
  if (areaIndex < 10) return "greater";
  return "perfected";
}

export function getTierForGatheringAreaIndex(areaIndex: number): SkillSetTier {
  if (areaIndex < 5) return "lesser";
  if (areaIndex < 10) return "greater";
  return "perfected";
}

/** Get the 4 piece item IDs for a skill and tier (for drop roll and loot table). */
export function getSetPieceIds(skill: SkillSetName, tier: SkillSetTier): number[] {
  const ids = SKILLING_SET_IDS[skill][tier];
  return [ids.helmet, ids.body, ids.legs, ids.shoes];
}
