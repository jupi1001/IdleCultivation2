import { createSelector } from "@reduxjs/toolkit";
import { canEnterCombatArea as canEnterCombatAreaRule } from "../../utils/contentRules";
import { getSectNpcById, getDualCultivationBonusPercent, type SectNpcI } from "../../constants/sectRelationships";
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

// ─── Focused selectors (avoid subscribing to full character) ───
/** Base attack from realm (before equipment/bonuses). */
export const selectAttack = (state: RootState) => state.character.attack;
/** Base defense from realm. */
export const selectDefense = (state: RootState) => state.character.defense;
/** Max vitality from realm. */
export const selectHealth = (state: RootState) => state.character.health;
export const selectBonusAttack = (state: RootState) => state.character.bonusAttack;
export const selectBonusDefense = (state: RootState) => state.character.bonusDefense;
export const selectBonusHealth = (state: RootState) => state.character.bonusHealth;

export const selectRealm = (state: RootState) => state.character.realm;
export const selectRealmLevel = (state: RootState) => state.character.realmLevel;
export const selectPath = (state: RootState) => state.character.path;
export const selectQi = (state: RootState) => state.character.qi;
export const selectCurrentHealth = (state: RootState) => state.combat.currentHealth;
export const selectMoney = (state: RootState) => state.character.money;
export const selectCurrentActivity = (state: RootState) => state.character.currentActivity;
export const selectIsWeakened = (state: RootState) => state.combat.isWeakened;
export const selectDeathPenaltyMode = (state: RootState) => state.settings.deathPenaltyMode;
export const selectWeakenedMeditationSecondsDone = (state: RootState) => state.combat.weakenedMeditationSecondsDone;
export const selectEquipment = (state: RootState) => state.equipment.equipment;
export const selectCurrentFishingArea = (state: RootState) => state.skills.currentFishingArea;
export const selectFishingXP = (state: RootState) => state.skills.fishingXP;
export const selectCurrentMiningArea = (state: RootState) => state.skills.currentMiningArea;
export const selectMiningXP = (state: RootState) => state.skills.miningXP;
export const selectCurrentGatheringArea = (state: RootState) => state.skills.currentGatheringArea;
export const selectGatheringXP = (state: RootState) => state.skills.gatheringXP;
export const selectAutoLoot = (state: RootState) => state.settings.autoLoot;
export const selectAutoEatUnlocked = (state: RootState) => state.settings.autoEatUnlocked;
export const selectAutoEat = (state: RootState) => state.settings.autoEat;
export const selectAutoEatHpPercent = (state: RootState) => state.settings.autoEatHpPercent;
export const selectGender = (state: RootState) => state.character.gender;
export const selectReincarnationCount = (state: RootState) => state.reincarnation.reincarnationCount;
export const selectStats = (state: RootState) => state.stats;
export const selectCurrentSectId = (state: RootState) => state.sect.currentSectId;
export const selectSectRankIndex = (state: RootState) => state.sect.sectRankIndex;
export const selectPromotionEndTime = (state: RootState) => state.sect.promotionEndTime;
export const selectPromotionToRankIndex = (state: RootState) => state.sect.promotionToRankIndex;
export const selectSectQuestProgress = (state: RootState) => state.sect.sectQuestProgress;
export const selectSectQuestKillCount = (state: RootState) => state.sect.sectQuestKillCount;
export const selectObtainedSectTreasureIds = (state: RootState) => state.sect.obtainedSectTreasureIds;
export const selectNpcFavor = (state: RootState) => state.sect.npcFavor;
export const selectRealmDialogueUsed = (state: RootState) => state.sect.realmDialogueUsed;
export const selectCultivationPartner = (state: RootState) => state.sect.cultivationPartner;
export const selectLastOfflineSummary = (state: RootState) => state.character.lastOfflineSummary;
export const selectAutoLootUnlocked = (state: RootState) => state.settings.autoLootUnlocked;
export const selectFishingCastStartTime = (state: RootState) => state.skills.fishingCastStartTime;
export const selectMiningCastStartTime = (state: RootState) => state.skills.miningCastStartTime;
export const selectGatheringCastStartTime = (state: RootState) => state.skills.gatheringCastStartTime;
export const selectFishingCastDuration = (state: RootState) => state.skills.fishingCastDuration;
export const selectMiningCastDuration = (state: RootState) => state.skills.miningCastDuration;
export const selectGatheringCastDuration = (state: RootState) => state.skills.gatheringCastDuration;
export const selectMiner = (state: RootState) => state.character.miner;
export const selectAlchemyXP = (state: RootState) => state.skills.alchemyXP;
export const selectForgingXP = (state: RootState) => state.skills.forgingXP;
export const selectCookingXP = (state: RootState) => state.skills.cookingXP;
export const selectLastActiveTimestamp = (state: RootState) => state.character.lastActiveTimestamp;
export const selectNotificationPrefs = (state: RootState) => state.settings.notificationPrefs;
export const selectKarmaPoints = (state: RootState) => state.reincarnation.karmaPoints;
export const selectTotalKarmaEarned = (state: RootState) => state.reincarnation.totalKarmaEarned;
export const selectKarmaBonusLevels = (state: RootState) => state.reincarnation.karmaBonusLevels;
export const selectTalentLevels = (state: RootState) => state.character.talentLevels;
export const selectExpeditionEndTime = (state: RootState) => state.avatars.expeditionEndTime;
export const selectExpeditionMissionId = (state: RootState) => state.avatars.expeditionMissionId;
export const selectAvatars = (state: RootState) => state.avatars.avatars;

/** Whether the character can enter the given combat area (realm/level check). Uses centralized content rules. */
export function selectCanEnterCombatArea(state: RootState, areaKey: string): boolean {
  return canEnterCombatAreaRule(
    selectRealm(state),
    selectRealmLevel(state),
    areaKey
  );
}
