import { createSelector } from "@reduxjs/toolkit";
import { KARMA_BONUSES_BY_ID, type KarmaBonusId } from "../../constants/reincarnation";
import { getSectNpcById, getDualCultivationBonusPercent, type SectNpcI } from "../../constants/sectRelationships";
import { canEnterCombatArea as canEnterCombatAreaRule } from "../../utils/contentRules";
import { WEAKENED_STAT_MULTIPLIER } from "../reducers/combatSlice";
import type { RootState } from "../store";
import { selectRealm, selectRealmLevel } from "./basicSelectors";
import { getEquipmentCombatBonuses } from "./equipmentSelectors";
import { getTalentBonusesSelector } from "./talentSelectors";
export * from "./basicSelectors";
export * from "./inventorySelectors";
export * from "./equipmentSelectors";
export * from "./talentSelectors";

/** Effective combat stats = realm + equipment + consumable bonus + karma + talents. Attack is multiplied by combat technique. When weakened (normal death penalty), stats are reduced. Memoized so same inputs return same reference. */
export const getEffectiveCombatStats = createSelector(
  [
    (state: RootState) => state.character.attack,
    (state: RootState) => state.character.defense,
    (state: RootState) => state.character.health,
    (state: RootState) => state.character.bonusAttack,
    (state: RootState) => state.character.bonusDefense,
    (state: RootState) => state.character.bonusHealth,
    (state: RootState) => state.equipment.equipment,
    (state: RootState) => state.reincarnation.karmaBonusLevels,
    (state: RootState) => state.settings.deathPenaltyMode,
    (state: RootState) => state.combat.isWeakened,
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

function karmaBonusValue(levels: Partial<Record<KarmaBonusId, number>>, id: KarmaBonusId): number {
  const level = levels[id] ?? 0;
  if (level <= 0) return 0;
  const tier = KARMA_BONUSES_BY_ID[id];
  return level * tier.valuePerLevel;
}

/** Cultivation partner info for meditation (dual cultivation qi bonus). */
export const getCultivationPartnerInfo = createSelector(
  [
    (state: RootState) => state.sect.cultivationPartner,
    (state: RootState) => state.sect.npcFavor,
  ],
  (partner, npcFavor) => {
    if (!partner) return { npc: undefined as SectNpcI | undefined, favor: 0, bonusPercent: 0 };
    const npc = getSectNpcById(partner.npcId);
    const key = `${partner.sectId}-${partner.npcId}`;
    const favor = npcFavor[key] ?? 0;
    const bonusPercent = getDualCultivationBonusPercent(favor);
    return { npc, favor, bonusPercent };
  }
);

/** Whether the character can enter the given combat area (realm/level check). Uses centralized content rules. */
export function selectCanEnterCombatArea(state: RootState, areaKey: string): boolean {
  return canEnterCombatAreaRule(
    selectRealm(state),
    selectRealmLevel(state),
    areaKey
  );
}
