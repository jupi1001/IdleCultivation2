import type { RootState } from "../store";

/** Focused character and system selectors grouped by feature domain. */

// Character core
export const selectAttack = (state: RootState) => state.character.attack;
export const selectDefense = (state: RootState) => state.character.defense;
export const selectHealth = (state: RootState) => state.character.health;
export const selectBonusAttack = (state: RootState) => state.character.bonusAttack;
export const selectBonusDefense = (state: RootState) => state.character.bonusDefense;
export const selectBonusHealth = (state: RootState) => state.character.bonusHealth;
export const selectRealm = (state: RootState) => state.character.realm;
export const selectRealmLevel = (state: RootState) => state.character.realmLevel;
export const selectPath = (state: RootState) => state.character.path;
export const selectQi = (state: RootState) => state.character.qi;
export const selectMoney = (state: RootState) => state.character.money;
export const selectCurrentActivity = (state: RootState) => state.character.currentActivity;
export const selectMiner = (state: RootState) => state.character.miner;
export const selectLastActiveTimestamp = (state: RootState) => state.character.lastActiveTimestamp;
export const selectReincarnationCount = (state: RootState) => state.reincarnation.reincarnationCount;
export const selectKarmaPoints = (state: RootState) => state.reincarnation.karmaPoints;
export const selectTotalKarmaEarned = (state: RootState) => state.reincarnation.totalKarmaEarned;
export const selectKarmaBonusLevels = (state: RootState) => state.reincarnation.karmaBonusLevels;
export const selectTalentLevels = (state: RootState) => state.character.talentLevels;
export const selectLastOfflineSummary = (state: RootState) => state.character.lastOfflineSummary;

// Combat
export const selectCurrentHealth = (state: RootState) => state.combat.currentHealth;
export const selectIsWeakened = (state: RootState) => state.combat.isWeakened;
export const selectWeakenedMeditationSecondsDone = (state: RootState) =>
  state.combat.weakenedMeditationSecondsDone;

// Equipment & inventory
export const selectEquipment = (state: RootState) => state.equipment.equipment;

// Skills
export const selectCurrentFishingArea = (state: RootState) => state.skills.currentFishingArea;
export const selectFishingXP = (state: RootState) => state.skills.fishingXP;
export const selectCurrentMiningArea = (state: RootState) => state.skills.currentMiningArea;
export const selectMiningXP = (state: RootState) => state.skills.miningXP;
export const selectCurrentGatheringArea = (state: RootState) =>
  state.skills.currentGatheringArea;
export const selectGatheringXP = (state: RootState) => state.skills.gatheringXP;
export const selectFishingCastStartTime = (state: RootState) =>
  state.skills.fishingCastStartTime;
export const selectMiningCastStartTime = (state: RootState) =>
  state.skills.miningCastStartTime;
export const selectGatheringCastStartTime = (state: RootState) =>
  state.skills.gatheringCastStartTime;
export const selectFishingCastDuration = (state: RootState) => state.skills.fishingCastDuration;
export const selectMiningCastDuration = (state: RootState) => state.skills.miningCastDuration;
export const selectGatheringCastDuration = (state: RootState) =>
  state.skills.gatheringCastDuration;
export const selectAlchemyXP = (state: RootState) => state.skills.alchemyXP;
export const selectForgingXP = (state: RootState) => state.skills.forgingXP;
export const selectCookingXP = (state: RootState) => state.skills.cookingXP;

// Sect
export const selectCurrentSectId = (state: RootState) => state.sect.currentSectId;
export const selectSectRankIndex = (state: RootState) => state.sect.sectRankIndex;
export const selectPromotionEndTime = (state: RootState) => state.sect.promotionEndTime;
export const selectPromotionToRankIndex = (state: RootState) => state.sect.promotionToRankIndex;
export const selectSectQuestProgress = (state: RootState) => state.sect.sectQuestProgress;
export const selectSectQuestKillCount = (state: RootState) => state.sect.sectQuestKillCount;
export const selectObtainedSectTreasureIds = (state: RootState) =>
  state.sect.obtainedSectTreasureIds;
export const selectNpcFavor = (state: RootState) => state.sect.npcFavor;
export const selectRealmDialogueUsed = (state: RootState) => state.sect.realmDialogueUsed;
export const selectCultivationPartner = (state: RootState) => state.sect.cultivationPartner;

// Settings
export const selectDeathPenaltyMode = (state: RootState) => state.settings.deathPenaltyMode;
export const selectAutoLoot = (state: RootState) => state.settings.autoLoot;
export const selectAutoLootUnlocked = (state: RootState) => state.settings.autoLootUnlocked;
export const selectAutoEatUnlocked = (state: RootState) => state.settings.autoEatUnlocked;
export const selectAutoEat = (state: RootState) => state.settings.autoEat;
export const selectAutoEatHpPercent = (state: RootState) => state.settings.autoEatHpPercent;
export const selectNotificationPrefs = (state: RootState) => state.settings.notificationPrefs;

// Misc
export const selectMoneyState = (state: RootState) => state.character.money;
export const selectStats = (state: RootState) => state.stats;
export const selectGender = (state: RootState) => state.character.gender;
export const selectReincarnationCountState = (state: RootState) =>
  state.reincarnation.reincarnationCount;

