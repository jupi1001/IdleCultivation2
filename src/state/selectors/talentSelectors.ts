import { createSelector } from "@reduxjs/toolkit";
import { KARMA_BONUSES_BY_ID, type KarmaBonusId } from "../../constants/reincarnation";
import {
  FULL_SET_ALCHEMY_SUCCESS_PERCENT,
  FULL_SET_COOKING_DOUBLE_PERCENT,
  FULL_SET_FORGING_SAVINGS_PERCENT,
  FULL_SET_SPEED_BONUS_PERCENT,
  SET_IDS,
  type SkillSetName,
  type SkillSetTier,
} from "../../constants/skillSets";
import { getTalentBonuses } from "../../constants/talents";
import type { RootState } from "../store";

/** Talent bonuses (memoized from character.talentLevels). */
export const getTalentBonusesSelector = createSelector(
  [(state: RootState) => state.character.talentLevels],
  (talentLevels) => getTalentBonuses(talentLevels ?? {})
);

/** Helper: get the effective bonus value for a karma bonus id. */
function karmaBonusValue(levels: Partial<Record<KarmaBonusId, number>>, id: KarmaBonusId): number {
  const level = levels[id] ?? 0;
  if (level <= 0) return 0;
  const tier = KARMA_BONUSES_BY_ID[id];
  return level * tier.valuePerLevel;
}

/** Karma multiplier for Qi gain from meditation (1 + bonus%). */
export const getKarmaQiMultiplier = createSelector(
  [(state: RootState) => state.reincarnation.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "qiGainPercent") / 100
);

/** Karma multiplier for skill XP (1 + bonus%). */
export const getKarmaSkillXpMultiplier = createSelector(
  [(state: RootState) => state.reincarnation.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "skillXpPercent") / 100
);

/** Karma multiplier for base attack (1 + bonus%). */
export const getKarmaAttackMultiplier = createSelector(
  [(state: RootState) => state.reincarnation.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "attackPercent") / 100
);

/** Karma multiplier for base defense (1 + bonus%). */
export const getKarmaDefenseMultiplier = createSelector(
  [(state: RootState) => state.reincarnation.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "defensePercent") / 100
);

/** Karma multiplier for base health (1 + bonus%). */
export const getKarmaHealthMultiplier = createSelector(
  [(state: RootState) => state.reincarnation.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "healthPercent") / 100
);

/** Karma multiplier for spirit stone labour income (1 + bonus%). */
export const getKarmaSpiritStoneMultiplier = createSelector(
  [(state: RootState) => state.reincarnation.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "spiritStonePercent") / 100
);

/** Talent Qi gain (flat bonus added to base + equipment). */
export const getTalentQiGainBonus = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => talentBonuses.qiGain
);

/** Talent spirit stone income multiplier (1 + talent %). */
export const getTalentSpiritStoneMultiplier = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => 1 + talentBonuses.spiritStoneIncomePercent / 100
);

/** Talent shop discount (0–100 percent off). */
export const getTalentShopDiscountPercent = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => talentBonuses.shopDiscountPercent
);

/** Pre-built memoized selectors — one per skill so they never re-allocate. */
function computeSkillSpeedBonus(
  equipment: RootState["equipment"]["equipment"],
  skill: "fishing" | "mining" | "gathering"
): number {
  let total = 0;
  const slots: ("helmet" | "body" | "legs" | "shoes")[] = ["helmet", "body", "legs", "shoes"];
  for (const slot of slots) {
    const item = equipment[slot];
    if (
      item &&
      "skillSet" in item &&
      item.skillSet === skill &&
      "skillSpeedBonus" in item &&
      item.skillSpeedBonus != null
    ) {
      total += item.skillSpeedBonus;
    }
  }
  const tiers: SkillSetTier[] = ["lesser", "greater", "perfected"];
  for (const tier of tiers) {
    const ids = SET_IDS[skill][tier];
    const required = [ids.helmet, ids.body, ids.legs, ids.shoes];
    const allEquipped = slots.every((slot, i) => equipment[slot]?.id === required[i]);
    if (allEquipped) total += FULL_SET_SPEED_BONUS_PERCENT[tier];
  }
  return total;
}

export const getSkillSpeedBonusFishing = createSelector(
  [(state: RootState) => state.equipment.equipment, getTalentBonusesSelector],
  (equipment, talentBonuses) =>
    computeSkillSpeedBonus(equipment, "fishing") + talentBonuses.fishingSpeedPercent
);

export const getSkillSpeedBonusMining = createSelector(
  [(state: RootState) => state.equipment.equipment, getTalentBonusesSelector],
  (equipment, _talentBonuses) =>
    // Intentionally exclude talentBonuses.miningYieldPercent: Miner's Strength affects yield (ore per swing), not cast speed.
    computeSkillSpeedBonus(equipment, "mining")
);

export const getSkillSpeedBonusGathering = createSelector(
  [(state: RootState) => state.equipment.equipment, getTalentBonusesSelector],
  (equipment, talentBonuses) =>
    computeSkillSpeedBonus(equipment, "gathering") + talentBonuses.gatheringSpeedPercent
);

/** Mining yield bonus from talents (Miner's Strength: "more ore per swing"). Use when computing ore quantity per cast; do not add to getSkillSpeedBonusMining. */
export const getMiningYieldBonusPercent = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => talentBonuses.miningYieldPercent
);

/** Crafting set bonuses from equipped pieces: XP per skill + full-set bonuses. */
function computeCraftingSetBonuses(equipment: RootState["equipment"]["equipment"]) {
  const slots: ("helmet" | "body" | "legs" | "shoes")[] = ["helmet", "body", "legs", "shoes"];
  let alchemyXpPercent = 0;
  let forgingXpPercent = 0;
  let cookingXpPercent = 0;
  let alchemySuccessPercent = 0;
  let forgingSavingsPercent = 0;
  let cookingDoubleChancePercent = 0;

  for (const skill of ["alchemy", "forging", "cooking"] as SkillSetName[]) {
    for (const slot of slots) {
      const item = equipment[slot];
      if (
        item &&
        "skillSet" in item &&
        item.skillSet === skill &&
        "skillXpBonus" in item &&
        item.skillXpBonus != null
      ) {
        if (skill === "alchemy") alchemyXpPercent += item.skillXpBonus;
        else if (skill === "forging") forgingXpPercent += item.skillXpBonus;
        else cookingXpPercent += item.skillXpBonus;
      }
    }
    const tiers: SkillSetTier[] = ["lesser", "greater", "perfected"];
    for (const tier of tiers) {
      const ids = SET_IDS[skill][tier];
      const required = [ids.helmet, ids.body, ids.legs, ids.shoes];
      const allEquipped = slots.every((s, i) => equipment[s]?.id === required[i]);
      if (allEquipped) {
        if (skill === "alchemy") alchemySuccessPercent += FULL_SET_ALCHEMY_SUCCESS_PERCENT[tier];
        else if (skill === "forging")
          forgingSavingsPercent += FULL_SET_FORGING_SAVINGS_PERCENT[tier];
        else cookingDoubleChancePercent += FULL_SET_COOKING_DOUBLE_PERCENT[tier];
      }
    }
  }

  return {
    alchemyXpPercent,
    forgingXpPercent,
    cookingXpPercent,
    alchemySuccessPercent,
    forgingSavingsPercent,
    cookingDoubleChancePercent,
  };
}

export const getCraftingSetBonuses = createSelector(
  [(state: RootState) => state.equipment.equipment],
  (equipment) => computeCraftingSetBonuses(equipment)
);

export const getCraftingSetAlchemySuccessPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.alchemySuccessPercent
);

export const getCraftingSetForgingSavingsPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.forgingSavingsPercent
);

export const getCraftingSetCookingDoubleChancePercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.cookingDoubleChancePercent
);

export const getCraftingSetAlchemyXpPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.alchemyXpPercent
);

export const getCraftingSetForgingXpPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.forgingXpPercent
);

export const getCraftingSetCookingXpPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.cookingXpPercent
);

export const getTalentAlchemySuccessPercent = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => talentBonuses.alchemySuccessPercent
);

