import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { EquipmentSlot } from "../../types/EquipmentSlot";

/** Sum equipment bonuses for combat stats. Sword → attack; helmet & body → defense and vitality. Ring, amulet, combatTechnique can be added here later. */
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
  return { attack, defense, vitality };
}

/** Effective combat stats = realm + equipment + consumable bonus. Memoized so same inputs return same reference. */
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
    return {
      attack: attack + bonusAttack + equipmentBonuses.attack,
      defense: defense + bonusDefense + equipmentBonuses.defense,
      health: health + bonusHealth + equipmentBonuses.vitality,
    };
  }
);
