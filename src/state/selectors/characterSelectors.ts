import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { EquipmentSlot } from "../../types/EquipmentSlot";

/** Sum equipment bonuses for combat stats. Sword → attack; helmet & body → defense and vitality; combatTechnique → multiplicative attack and flat attack speed. */
function getEquipmentCombatBonuses(equipment: RootState["character"]["equipment"]) {
  let attack = 0;
  let defense = 0;
  let vitality = 0;
  const slots: EquipmentSlot[] = ["sword", "helmet", "body"];
  for (const slot of slots) {
    const item = equipment[slot];
    if (item) {
      if (item.attackBonus != null) attack += item.attackBonus;
      if (item.defenseBonus != null) defense += item.defenseBonus;
      if (item.vitalityBonus != null) vitality += item.vitalityBonus;
    }
  }
  const combatTech = equipment.combatTechnique;
  const attackMultiplier = combatTech?.attackMultiplier ?? 1;
  const attackSpeedReduction = combatTech?.attackSpeedReduction ?? 0;
  return { attack, defense, vitality, attackMultiplier, attackSpeedReduction };
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
    };
  }
);
