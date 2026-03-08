import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { WEAKENED_STAT_MULTIPLIER } from "../reducers/characterSlice";
import { canEnterCombatArea as canEnterCombatAreaRule } from "../../utils/contentRules";
import {
  SET_IDS,
  FULL_SET_SPEED_BONUS_PERCENT,
  FULL_SET_ALCHEMY_SUCCESS_PERCENT,
  FULL_SET_FORGING_SAVINGS_PERCENT,
  FULL_SET_COOKING_DOUBLE_PERCENT,
  type SkillSetName,
  type SkillSetTier,
} from "../../constants/skillSets";
import { KARMA_BONUSES_BY_ID, type KarmaBonusId } from "../../constants/reincarnation";
import { getTalentBonuses } from "../../constants/talents";
import { getSectNpcById, getDualCultivationBonusPercent, type SectNpcI } from "../../constants/sectRelationships";

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

/** Item ids the character owns that are any skill set pieces (all 6 skills; for "Possible loot" and drop roll). */
export const getOwnedSetPieceIds = createSelector(
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

/** @deprecated Use getOwnedSetPieceIds. Same set for gathering (fishing/mining/gathering). */
export const getOwnedSkillingSetPieceIds = getOwnedSetPieceIds;

/** Compute skill speed bonus (0–100) for a given gathering skill from equipped set pieces + full-set bonuses. */
function computeSkillSpeedBonus(
  equipment: RootState["character"]["equipment"],
  skill: "fishing" | "mining" | "gathering"
): number {
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
    const ids = SET_IDS[skill][tier];
    const required = [ids.helmet, ids.body, ids.legs, ids.shoes];
    const allEquipped = slots.every((slot, i) => equipment[slot]?.id === required[i]);
    if (allEquipped) total += FULL_SET_SPEED_BONUS_PERCENT[tier];
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
  (equipment, talentBonuses) => computeSkillSpeedBonus(equipment, "mining")
);
export const getSkillSpeedBonusGathering = createSelector(
  [(state: RootState) => state.character.equipment, getTalentBonusesSelector],
  (equipment, talentBonuses) => computeSkillSpeedBonus(equipment, "gathering") + talentBonuses.gatheringSpeedPercent
);

/** Mining yield bonus from talents (Miner's Strength: "more ore per swing"). Use when computing ore quantity per cast. */
export const getMiningYieldBonusPercent = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => talentBonuses.miningYieldPercent
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
    (state: RootState) => state.reincarnation.karmaBonusLevels,
    (state: RootState) => state.settings.deathPenaltyMode,
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

/** Item ids the character owns that are crafting set pieces (alchemy/forging/cooking). Same as getOwnedSetPieceIds. */
export const getOwnedCraftingSetPieceIds = getOwnedSetPieceIds;

/** Compute crafting set bonuses from equipped pieces: XP per skill + full-set bonuses. */
function computeCraftingSetBonuses(equipment: RootState["character"]["equipment"]) {
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
      if (item?.skillSet === skill && item.skillXpBonus != null) {
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
        else if (skill === "forging") forgingSavingsPercent += FULL_SET_FORGING_SAVINGS_PERCENT[tier];
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

/** Crafting set bonuses (for alchemy/forging/cooking). */
export const getCraftingSetBonuses = createSelector(
  [(state: RootState) => state.character.equipment],
  (equipment) => computeCraftingSetBonuses(equipment)
);

/** Alchemy success chance bonus from crafting set (percent). */
export const getCraftingSetAlchemySuccessPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.alchemySuccessPercent
);

/** Forging material savings from crafting set (percent; e.g. 10 = consume 10% less). */
export const getCraftingSetForgingSavingsPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.forgingSavingsPercent
);

/** Cooking double output chance from crafting set (percent). */
export const getCraftingSetCookingDoubleChancePercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.cookingDoubleChancePercent
);

/** Alchemy XP bonus from crafting set (percent). */
export const getCraftingSetAlchemyXpPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.alchemyXpPercent
);

/** Forging XP bonus from crafting set (percent). */
export const getCraftingSetForgingXpPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.forgingXpPercent
);

/** Cooking XP bonus from crafting set (percent). */
export const getCraftingSetCookingXpPercent = createSelector(
  [getCraftingSetBonuses],
  (b) => b.cookingXpPercent
);

/** Talent alchemy success bonus (percent added to success chance). */
export const getTalentAlchemySuccessPercent = createSelector(
  [getTalentBonusesSelector],
  (talentBonuses) => talentBonuses.alchemySuccessPercent
);

/** Cultivation partner info for meditation (dual cultivation qi bonus). */
export const getCultivationPartnerInfo = createSelector(
  [
    (state: RootState) => state.character.cultivationPartner,
    (state: RootState) => state.character.npcFavor,
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
export const selectRealm = (state: RootState) => state.character.realm;
export const selectRealmLevel = (state: RootState) => state.character.realmLevel;
export const selectPath = (state: RootState) => state.character.path;
export const selectQi = (state: RootState) => state.character.qi;
export const selectCurrentHealth = (state: RootState) => state.character.currentHealth;
export const selectMoney = (state: RootState) => state.character.money;
export const selectCurrentActivity = (state: RootState) => state.character.currentActivity;
export const selectIsWeakened = (state: RootState) => state.character.isWeakened;
export const selectDeathPenaltyMode = (state: RootState) => state.settings.deathPenaltyMode;
export const selectWeakenedMeditationSecondsDone = (state: RootState) => state.character.weakenedMeditationSecondsDone;
export const selectEquipment = (state: RootState) => state.character.equipment;
export const selectItems = (state: RootState) => state.character.items;
export const selectCurrentFishingArea = (state: RootState) => state.character.currentFishingArea;
export const selectFishingXP = (state: RootState) => state.character.fishingXP;
export const selectCurrentMiningArea = (state: RootState) => state.character.currentMiningArea;
export const selectMiningXP = (state: RootState) => state.character.miningXP;
export const selectCurrentGatheringArea = (state: RootState) => state.character.currentGatheringArea;
export const selectGatheringXP = (state: RootState) => state.character.gatheringXP;
export const selectAutoLoot = (state: RootState) => state.settings.autoLoot;
export const selectAutoEatUnlocked = (state: RootState) => state.settings.autoEatUnlocked;
export const selectAutoEat = (state: RootState) => state.settings.autoEat;
export const selectAutoEatHpPercent = (state: RootState) => state.settings.autoEatHpPercent;
export const selectGender = (state: RootState) => state.character.gender;
export const selectReincarnationCount = (state: RootState) => state.reincarnation.reincarnationCount;
export const selectStats = (state: RootState) => state.character.stats;
export const selectCurrentSectId = (state: RootState) => state.character.currentSectId;
export const selectSectRankIndex = (state: RootState) => state.character.sectRankIndex;
export const selectPromotionEndTime = (state: RootState) => state.character.promotionEndTime;
export const selectPromotionToRankIndex = (state: RootState) => state.character.promotionToRankIndex;
export const selectSectQuestProgress = (state: RootState) => state.character.sectQuestProgress;
export const selectSectQuestKillCount = (state: RootState) => state.character.sectQuestKillCount;
export const selectObtainedSectTreasureIds = (state: RootState) => state.character.obtainedSectTreasureIds;
export const selectNpcFavor = (state: RootState) => state.character.npcFavor;
export const selectRealmDialogueUsed = (state: RootState) => state.character.realmDialogueUsed;
export const selectCultivationPartner = (state: RootState) => state.character.cultivationPartner;
export const selectLastOfflineSummary = (state: RootState) => state.character.lastOfflineSummary;
export const selectAutoLootUnlocked = (state: RootState) => state.settings.autoLootUnlocked;
export const selectFishingCastStartTime = (state: RootState) => state.character.fishingCastStartTime;
export const selectMiningCastStartTime = (state: RootState) => state.character.miningCastStartTime;
export const selectGatheringCastStartTime = (state: RootState) => state.character.gatheringCastStartTime;
export const selectFishingCastDuration = (state: RootState) => state.character.fishingCastDuration;
export const selectMiningCastDuration = (state: RootState) => state.character.miningCastDuration;
export const selectGatheringCastDuration = (state: RootState) => state.character.gatheringCastDuration;
export const selectMiner = (state: RootState) => state.character.miner;
export const selectAlchemyXP = (state: RootState) => state.character.alchemyXP;
export const selectForgingXP = (state: RootState) => state.character.forgingXP;
export const selectCookingXP = (state: RootState) => state.character.cookingXP;
export const selectLastActiveTimestamp = (state: RootState) => state.character.lastActiveTimestamp;
export const selectNotificationPrefs = (state: RootState) => state.settings.notificationPrefs;
export const selectKarmaPoints = (state: RootState) => state.reincarnation.karmaPoints;
export const selectTotalKarmaEarned = (state: RootState) => state.reincarnation.totalKarmaEarned;
export const selectKarmaBonusLevels = (state: RootState) => state.reincarnation.karmaBonusLevels;
export const selectTalentLevels = (state: RootState) => state.character.talentLevels;
export const selectExpeditionEndTime = (state: RootState) => state.character.expeditionEndTime;
export const selectExpeditionMissionId = (state: RootState) => state.character.expeditionMissionId;
export const selectAvatars = (state: RootState) => state.character.avatars;

/** Whether the character can enter the given combat area (realm/level check). Uses centralized content rules. */
export function selectCanEnterCombatArea(state: RootState, areaKey: string): boolean {
  return canEnterCombatAreaRule(
    state.character.realm,
    state.character.realmLevel,
    areaKey
  );
}
