import { createSelector } from "@reduxjs/toolkit";
import { getEquipmentSlot } from "../../interfaces/ItemI";
import type Item from "../../interfaces/ItemI";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import type { RootState } from "../store";
import { selectItems } from "./inventorySelectors";

/** Sum equipment bonuses for combat stats. */
export function getEquipmentCombatBonuses(equipment: RootState["equipment"]["equipment"]) {
  let attack = 0;
  let defense = 0;
  let vitality = 0;
  let qiGainBonus = 0;
  let attackSpeedReduction = 0;
  const slots: EquipmentSlot[] = ["sword", "helmet", "body", "ring", "amulet"];
  for (const slot of slots) {
    const item = equipment[slot];
    if (item) {
      if ("attackBonus" in item && item.attackBonus != null) attack += item.attackBonus;
      if ("defenseBonus" in item && item.defenseBonus != null) defense += item.defenseBonus;
      if ("vitalityBonus" in item && item.vitalityBonus != null) vitality += item.vitalityBonus;
      if ("qiGainBonus" in item && item.qiGainBonus != null) qiGainBonus += item.qiGainBonus;
    }
  }
  const combatTech = equipment.combatTechnique;
  const attackMultiplier =
    combatTech && "attackMultiplier" in combatTech ? combatTech.attackMultiplier ?? 1 : 1;
  if (
    combatTech &&
    "attackSpeedReduction" in combatTech &&
    combatTech.attackSpeedReduction != null
  )
    attackSpeedReduction += combatTech.attackSpeedReduction;
  const ring = equipment.ring;
  if (ring && "attackSpeedReduction" in ring && ring.attackSpeedReduction != null)
    attackSpeedReduction += ring.attackSpeedReduction;
  return { attack, defense, vitality, attackMultiplier, attackSpeedReduction, qiGainBonus };
}

/** Item ids the character owns that are techniques (qi or combat). */
export const getOwnedTechniqueIds = createSelector(
  [selectItems, (state: RootState) => state.equipment.equipment],
  (items, equipment) => {
    const ids = new Set<number>();
    for (const item of items) {
      const slot = getEquipmentSlot(item);
      if (slot === "qiTechnique" || slot === "combatTechnique") ids.add(item.id);
    }
    if (equipment.qiTechnique?.id != null) ids.add(equipment.qiTechnique.id);
    if (equipment.combatTechnique?.id != null) ids.add(equipment.combatTechnique.id);
    return ids;
  }
);

/** Item ids the character owns that are rings or amulets. */
export const getOwnedRingAmuletIds = createSelector(
  [selectItems, (state: RootState) => state.equipment.equipment],
  (items, equipment) => {
    const ids = new Set<number>();
    for (const item of items) {
      const slot = getEquipmentSlot(item);
      if (slot === "ring" || slot === "amulet") ids.add(item.id);
    }
    if (equipment.ring?.id != null) ids.add(equipment.ring.id);
    if (equipment.amulet?.id != null) ids.add(equipment.amulet.id);
    return ids;
  }
);

/** Item ids the character owns that are any skill set pieces (all 6 skills; for "Possible loot" and drop roll). */
export const getOwnedSetPieceIds = createSelector(
  [selectItems, (state: RootState) => state.equipment.equipment],
  (items, equipment) => {
    const ids = new Set<number>();
    const slots: EquipmentSlot[] = ["helmet", "body", "legs", "shoes"];
    for (const item of items) {
      if (
        "skillSet" in item &&
        item.skillSet != null &&
        "skillSetTier" in item &&
        item.skillSetTier != null
      )
        ids.add(item.id);
    }
    for (const slot of slots) {
      const eq = equipment[slot];
      if (
        eq &&
        "skillSet" in eq &&
        eq.skillSet != null &&
        "skillSetTier" in eq &&
        eq.skillSetTier != null
      )
        ids.add(eq.id);
    }
    return ids;
  }
);

/** @deprecated Use getOwnedSetPieceIds. Same set for gathering (fishing/mining/gathering). */
export const getOwnedSkillingSetPieceIds = getOwnedSetPieceIds;

