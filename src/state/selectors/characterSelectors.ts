import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import {
  FULL_SET_BONUS_PERCENT,
  SKILLING_SET_IDS,
  type SkillSetName,
  type SkillSetTier,
} from "../../constants/skillingSets";

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

/** Skill speed bonus (0–100) for a given skill from equipped set pieces + full-set bonuses. */
export const getSkillSpeedBonus = (skill: SkillSetName) =>
  createSelector(
    [(state: RootState) => state.character.equipment],
    (equipment) => {
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
  );

/** Effective combat stats = realm + equipment + consumable bonus. Attack is multiplied by combat technique. Memoized so same inputs return same reference. */
export const getEffectiveCombatStats = createSelector(
  [
    (state: RootState) => state.character.attack,
    (state: RootState) => state.character.defense,
    (state: RootState) => state.character.health,
    (state: RootState) => state.character.bonusAttack,
    (state: RootState) => state.character.bonusDefense,
    (state: RootState) => state.character.bonusHealth,
    (state: RootState) => state.character.equipment,
  ],
  (attack, defense, health, bonusAttack, bonusDefense, bonusHealth, equipment) => {
    const equipmentBonuses = getEquipmentCombatBonuses(equipment);
    const baseAttack = attack + bonusAttack + equipmentBonuses.attack;
    return {
      attack: Math.floor(baseAttack * equipmentBonuses.attackMultiplier),
      defense: defense + bonusDefense + equipmentBonuses.defense,
      health: health + bonusHealth + equipmentBonuses.vitality,
      attackSpeedReduction: equipmentBonuses.attackSpeedReduction,
      qiGainBonus: equipmentBonuses.qiGainBonus,
    };
  }
);
