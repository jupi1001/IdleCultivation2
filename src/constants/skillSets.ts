/**
 * Skill set pieces: 6 skills × 3 tiers (Lesser, Greater, Perfected) × 4 slots (helmet, body, legs, shoes).
 * - Gathering (fishing, mining, gathering): per-piece speed bonus; full-set extra speed %.
 * - Crafting (alchemy, forging, cooking): per-piece XP bonus; full-set = success % / material savings % / double output %.
 * Same path pattern: /assets/skilling/{skill}/{tier}-{slot}.webp
 */
import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";

export type SkillSetName = "fishing" | "mining" | "gathering" | "alchemy" | "forging" | "cooking";
export type SkillSetTier = "lesser" | "greater" | "perfected";

const SKILLING_ASSETS = "/assets/skilling";
const SET_SLOTS: readonly ["helmet", "body", "legs", "shoes"] = ["helmet", "body", "legs", "shoes"];

/** Per-piece bonus (percent). Same 2/4/6 for both speed (gathering) and XP (crafting). */
export const PER_PIECE_BONUS_PERCENT: Record<SkillSetTier, number> = {
  lesser: 2,
  greater: 4,
  perfected: 6,
};

/** Full-set: gathering skills get extra speed %. */
export const FULL_SET_SPEED_BONUS_PERCENT: Record<SkillSetTier, number> = {
  lesser: 3,
  greater: 6,
  perfected: 10,
};

/** Full-set: alchemy success chance %. */
export const FULL_SET_ALCHEMY_SUCCESS_PERCENT: Record<SkillSetTier, number> = {
  lesser: 3,
  greater: 6,
  perfected: 10,
};

/** Full-set: forging material savings %. */
export const FULL_SET_FORGING_SAVINGS_PERCENT: Record<SkillSetTier, number> = {
  lesser: 5,
  greater: 10,
  perfected: 15,
};

/** Full-set: cooking double output chance %. */
export const FULL_SET_COOKING_DOUBLE_PERCENT: Record<SkillSetTier, number> = {
  lesser: 10,
  greater: 20,
  perfected: 30,
};

/** All set IDs by skill and tier. Fishing 840–851, Mining 852–863, Gathering 864–875, Alchemy 876–887, Forging 888–899, Cooking 900–911. */
export const SET_IDS: Record<
  SkillSetName,
  Record<SkillSetTier, { helmet: number; body: number; legs: number; shoes: number }>
> = {
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
  alchemy: {
    lesser: { helmet: 876, body: 877, legs: 878, shoes: 879 },
    greater: { helmet: 880, body: 881, legs: 882, shoes: 883 },
    perfected: { helmet: 884, body: 885, legs: 886, shoes: 887 },
  },
  forging: {
    lesser: { helmet: 888, body: 889, legs: 890, shoes: 891 },
    greater: { helmet: 892, body: 893, legs: 894, shoes: 895 },
    perfected: { helmet: 896, body: 897, legs: 898, shoes: 899 },
  },
  cooking: {
    lesser: { helmet: 900, body: 901, legs: 902, shoes: 903 },
    greater: { helmet: 904, body: 905, legs: 906, shoes: 907 },
    perfected: { helmet: 908, body: 909, legs: 910, shoes: 911 },
  },
};

const GATHERING_SKILLS: SkillSetName[] = ["fishing", "mining", "gathering"];
const CRAFTING_SKILLS: SkillSetName[] = ["alchemy", "forging", "cooking"];

export function isGatheringSkill(skill: SkillSetName): skill is "fishing" | "mining" | "gathering" {
  return GATHERING_SKILLS.includes(skill);
}

export function isCraftingSkill(skill: SkillSetName): skill is "alchemy" | "forging" | "cooking" {
  return CRAFTING_SKILLS.includes(skill);
}

const tierLabel: Record<SkillSetTier, string> = {
  lesser: "Lesser",
  greater: "Greater",
  perfected: "Perfected",
};

function fullSetBonusLabel(skill: SkillSetName): string {
  switch (skill) {
    case "fishing":
    case "mining":
    case "gathering":
      return "speed";
    case "alchemy":
      return "success chance";
    case "forging":
      return "material savings";
    case "cooking":
      return "double output chance";
  }
}

function buildPiece(
  skill: SkillSetName,
  tier: SkillSetTier,
  slot: "helmet" | "body" | "legs" | "shoes",
  id: number
): SkillSetItem {
  const skillLabel = skill.charAt(0).toUpperCase() + skill.slice(1);
  const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1);
  const bonus = PER_PIECE_BONUS_PERCENT[tier];
  const picture = `${SKILLING_ASSETS}/${skill}/${tier}-${slot}.webp`;

  if (isGatheringSkill(skill)) {
    const fullSet = FULL_SET_SPEED_BONUS_PERCENT[tier];
    return {
      id,
      name: `${tierLabel[tier]} ${skillLabel} ${slotLabel}`,
      description: `Part of the ${tierLabel[tier]} ${skillLabel} set. +${bonus}% ${skill} speed per piece. Full set grants an extra +${fullSet}%.`,
      quantity: 1,
      price: 0,
      picture,
      equipmentSlot: slot,
      skillSet: skill,
      skillSetTier: tier,
      skillSpeedBonus: bonus,
    };
  }

  const fullSetVal =
    skill === "alchemy"
      ? FULL_SET_ALCHEMY_SUCCESS_PERCENT[tier]
      : skill === "forging"
        ? FULL_SET_FORGING_SAVINGS_PERCENT[tier]
        : FULL_SET_COOKING_DOUBLE_PERCENT[tier];
  return {
    id,
    name: `${tierLabel[tier]} ${skillLabel} ${slotLabel}`,
    description: `Part of the ${tierLabel[tier]} ${skillLabel} set. +${bonus}% ${skill} XP per piece. Full set grants +${fullSetVal}% ${fullSetBonusLabel(skill)}.`,
    quantity: 1,
    price: 0,
    picture,
    equipmentSlot: slot,
    skillSet: skill,
    skillSetTier: tier,
    skillXpBonus: bonus,
  };
}

export type SkillSetItem = Item & {
  equipmentSlot: EquipmentSlot;
  skillSet: SkillSetName;
  skillSetTier: SkillSetTier;
  skillSpeedBonus?: number;
  skillXpBonus?: number;
};

function buildAllPieces(): SkillSetItem[] {
  const out: SkillSetItem[] = [];
  for (const skill of GATHERING_SKILLS.concat(CRAFTING_SKILLS)) {
    for (const tier of ["lesser", "greater", "perfected"] as SkillSetTier[]) {
      const ids = SET_IDS[skill][tier];
      for (const slot of SET_SLOTS) {
        out.push(buildPiece(skill, tier, slot, ids[slot]));
      }
    }
  }
  return out;
}

export const SET_ITEMS: SkillSetItem[] = buildAllPieces();

export const SET_ITEMS_BY_ID: Record<number, SkillSetItem> = Object.fromEntries(
  SET_ITEMS.map((i) => [i.id, i])
) as Record<number, SkillSetItem>;

export function getSetItemById(id: number): SkillSetItem | undefined {
  return SET_ITEMS_BY_ID[id];
}

export const ALL_SET_ITEM_IDS = SET_ITEMS.map((i) => i.id);

export const GATHERING_SET_ITEMS = SET_ITEMS.filter((i) => i.skillSet != null && isGatheringSkill(i.skillSet));
export const ALL_GATHERING_SET_ITEM_IDS = GATHERING_SET_ITEMS.map((i) => i.id);

export const CRAFTING_SET_ITEMS = SET_ITEMS.filter((i) => i.skillSet != null && isCraftingSkill(i.skillSet));
export const ALL_CRAFTING_SET_ITEM_IDS = CRAFTING_SET_ITEMS.map((i) => i.id);

/** Chance (0–100) to drop one random set piece per completion/cast. */
export const SET_DROP_CHANCE_PERCENT = 1;

/** Get the 4 piece item IDs for a skill and tier (for drop roll). */
export function getSetPieceIds(skill: SkillSetName, tier: SkillSetTier): number[] {
  const ids = SET_IDS[skill][tier];
  return [ids.helmet, ids.body, ids.legs, ids.shoes];
}

// ─── Tier mappers (gathering: by area index; crafting: by recipe level / tier index) ───

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

export function getTierForAlchemyRecipeLevel(recipeLevel: number): SkillSetTier {
  if (recipeLevel <= 11) return "lesser";
  if (recipeLevel <= 23) return "greater";
  return "perfected";
}

export function getTierForForgingTierIndex(tierIndex: number): SkillSetTier {
  if (tierIndex <= 3) return "lesser";
  if (tierIndex <= 7) return "greater";
  return "perfected";
}

export function getTierForCookingRecipeLevel(recipeLevel: number): SkillSetTier {
  if (recipeLevel <= 7) return "lesser";
  if (recipeLevel <= 15) return "greater";
  return "perfected";
}
