import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { WEAKENED_STAT_MULTIPLIER } from "../reducers/characterSlice";
import {
  FULL_SET_BONUS_PERCENT,
  SKILLING_SET_IDS,
  type SkillSetName,
  type SkillSetTier,
} from "../../constants/skillingSets";
import { KARMA_BONUSES_BY_ID, type KarmaBonusId } from "../../constants/reincarnation";
import { getTalentBonuses } from "../../constants/talents";

/** Sum equipment bonuses for combat stats. Sword & ring → attack; helmet, body & amulet → defense and vitality; combatTechnique & ring → attack speed; amulet → qiGainBonus. */
function getEquipmentCombatBonuses(equipment: RootState["character"]["equipment"]) {
  let attack = 0;
  let defense = 0;
  let vitality = 0;
  let qiGainBonus = 0;
  let attackSpeedReduction = 0;
  const slots: EquipmentSlot[] = ["sword", "helmet", "body", "ring", "amulet"];
  for (const slot of slots) {
    const item = equipment[slot];
    if (item) {
      if (item.attackBonus != null) attack += item.attackBonus;
      if (item.defenseBonus != null) defense += item.defenseBonus;
      if (item.vitalityBonus != null) vitality += item.vitalityBonus;
      if (item.qiGainBonus != null) qiGainBonus += item.qiGainBonus;
    }
  }
  const combatTech = equipment.combatTechnique;
  const attackMultiplier = combatTech?.attackMultiplier ?? 1;
  if (combatTech?.attackSpeedReduction != null) attackSpeedReduction += combatTech.attackSpeedReduction;
  if (equipment.ring?.attackSpeedReduction != null) attackSpeedReduction += equipment.ring.attackSpeedReduction;
  return { attack, defense, vitality, attackMultiplier, attackSpeedReduction, qiGainBonus };
}

/** Item ids the character owns that are techniques (qi or combat). Used to show "Already bought/owned" and to avoid duplicate technique drops. */
export const getOwnedTechniqueIds = createSelector(
  [(state: RootState) => state.character.items, (state: RootState) => state.character.equipment],
  (items, equipment) => {
    const ids = new Set<number>();
    for (const item of items) {
      if (item.equipmentSlot === "qiTechnique" || item.equipmentSlot === "combatTechnique") ids.add(item.id);
    }
    if (equipment.qiTechnique?.id != null) ids.add(equipment.qiTechnique.id);
    if (equipment.combatTechnique?.id != null) ids.add(equipment.combatTechnique.id);
    return ids;
  }
);

/** Item ids the character owns that are rings or amulets. Used for "Possible loot" checkmark in fishing/gathering. */
export const getOwnedRingAmuletIds = createSelector(
  [(state: RootState) => state.character.items, (state: RootState) => state.character.equipment],
  (items, equipment) => {
    const ids = new Set<number>();
    for (const item of items) {
      if (item.equipmentSlot === "ring" || item.equipmentSlot === "amulet") ids.add(item.id);
    }
    if (equipment.ring?.id != null) ids.add(equipment.ring.id);
    if (equipment.amulet?.id != null) ids.add(equipment.amulet.id);
    return ids;
  }
);

/** Item ids the character owns that are skilling set pieces (for "Possible loot" checkmark). */
export const getOwnedSkillingSetPieceIds = createSelector(
  [(state: RootState) => state.character.items, (state: RootState) => state.character.equipment],
  (items, equipment) => {
    const ids = new Set<number>();
    const slots: EquipmentSlot[] = ["helmet", "body", "legs", "shoes"];
    for (const item of items) {
      if (item.skillSet != null && item.skillSetTier != null) ids.add(item.id);
    }
    for (const slot of slots) {
      const eq = equipment[slot];
      if (eq?.skillSet != null && eq.skillSetTier != null) ids.add(eq.id);
    }
    return ids;
  }
);

/** Compute skill speed bonus (0–100) for a given skill from equipped set pieces + full-set bonuses. */
function computeSkillSpeedBonus(equipment: RootState["character"]["equipment"], skill: SkillSetName): number {
  let total = 0;
  const slots: ("helmet" | "body" | "legs" | "shoes")[] = ["helmet", "body", "legs", "shoes"];
  for (const slot of slots) {
    const item = equipment[slot];
    if (item?.skillSet === skill && item.skillSpeedBonus != null) {
      total += item.skillSpeedBonus;
    }
  }
  const tiers: SkillSetTier[] = ["lesser", "greater", "perfected"];
  for (const tier of tiers) {
    const ids = SKILLING_SET_IDS[skill][tier];
    const required = [ids.helmet, ids.body, ids.legs, ids.shoes];
    const allEquipped = slots.every((slot, i) => equipment[slot]?.id === required[i]);
    if (allEquipped) total += FULL_SET_BONUS_PERCENT[tier];
  }
  return total;
}

/** Talent bonuses (memoized from character.talentLevels). */
export const getTalentBonusesSelector = createSelector(
  [(state: RootState) => state.character.talentLevels],
  (talentLevels) => getTalentBonuses(talentLevels ?? {})
);

/** Pre-built memoized selectors — one per skill so they never re-allocate. */
export const getSkillSpeedBonusFishing = createSelector(
  [(state: RootState) => state.character.equipment, getTalentBonusesSelector],
  (equipment, talentBonuses) => computeSkillSpeedBonus(equipment, "fishing") + talentBonuses.fishingSpeedPercent
);
export const getSkillSpeedBonusMining = createSelector(
  [(state: RootState) => state.character.equipment, getTalentBonusesSelector],
  (equipment, talentBonuses) => computeSkillSpeedBonus(equipment, "mining") + talentBonuses.miningYieldPercent
);
export const getSkillSpeedBonusGathering = createSelector(
  [(state: RootState) => state.character.equipment, getTalentBonusesSelector],
  (equipment, talentBonuses) => computeSkillSpeedBonus(equipment, "gathering") + talentBonuses.gatheringSpeedPercent
);

/** Effective combat stats = realm + equipment + consumable bonus + karma + talents. Attack is multiplied by combat technique. When weakened (normal death penalty), stats are reduced. Memoized so same inputs return same reference. */
export const getEffectiveCombatStats = createSelector(
  [
    (state: RootState) => state.character.attack,
    (state: RootState) => state.character.defense,
    (state: RootState) => state.character.health,
    (state: RootState) => state.character.bonusAttack,
    (state: RootState) => state.character.bonusDefense,
    (state: RootState) => state.character.bonusHealth,
    (state: RootState) => state.character.equipment,
    (state: RootState) => state.character.karmaBonusLevels,
    (state: RootState) => state.character.deathPenaltyMode,
    (state: RootState) => state.character.isWeakened,
    getTalentBonusesSelector,
  ],
  (attack, defense, health, bonusAttack, bonusDefense, bonusHealth, equipment, karmaBonusLevels, deathPenaltyMode, isWeakened, talentBonuses) => {
    const equipmentBonuses = getEquipmentCombatBonuses(equipment);
    const levels = karmaBonusLevels ?? {};
    const karmaAtkMult = 1 + karmaBonusValue(levels, "attackPercent") / 100;
    const karmaDefMult = 1 + karmaBonusValue(levels, "defensePercent") / 100;
    const karmaHpMult = 1 + karmaBonusValue(levels, "healthPercent") / 100;
    const baseAttack = Math.floor(attack * karmaAtkMult) + bonusAttack + equipmentBonuses.attack + talentBonuses.attack;
    let outAttack = Math.floor(baseAttack * equipmentBonuses.attackMultiplier);
    let outDefense = Math.floor(defense * karmaDefMult) + bonusDefense + equipmentBonuses.defense + talentBonuses.defense;
    let outHealth = Math.floor(health * karmaHpMult) + bonusHealth + equipmentBonuses.vitality + talentBonuses.vitality;
    if (deathPenaltyMode === "normal" && isWeakened) {
      outAttack = Math.floor(outAttack * WEAKENED_STAT_MULTIPLIER);
      outDefense = Math.floor(outDefense * WEAKENED_STAT_MULTIPLIER);
      outHealth = Math.floor(outHealth * WEAKENED_STAT_MULTIPLIER);
    }
    return {
      attack: outAttack,
      defense: outDefense,
      health: outHealth,
      attackSpeedReduction: equipmentBonuses.attackSpeedReduction,
      qiGainBonus: equipmentBonuses.qiGainBonus,
      talentBonuses,
    };
  }
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
  [(state: RootState) => state.character.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "qiGainPercent") / 100
);

/** Karma multiplier for skill XP (1 + bonus%). */
export const getKarmaSkillXpMultiplier = createSelector(
  [(state: RootState) => state.character.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "skillXpPercent") / 100
);

/** Karma multiplier for base attack (1 + bonus%). */
export const getKarmaAttackMultiplier = createSelector(
  [(state: RootState) => state.character.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "attackPercent") / 100
);

/** Karma multiplier for base defense (1 + bonus%). */
export const getKarmaDefenseMultiplier = createSelector(
  [(state: RootState) => state.character.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "defensePercent") / 100
);

/** Karma multiplier for base health (1 + bonus%). */
export const getKarmaHealthMultiplier = createSelector(
  [(state: RootState) => state.character.karmaBonusLevels],
  (levels) => 1 + karmaBonusValue(levels ?? {}, "healthPercent") / 100
);

/** Karma multiplier for spirit stone labour income (1 + bonus%). */
export const getKarmaSpiritStoneMultiplier = createSelector(
  [(state: RootState) => state.character.karmaBonusLevels],
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

/** Talent alchemy success bonus (percent added to success chance). */
export const getTalentAlchemySuccessPercent = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => talentBonuses.alchemySuccessPercent
);
