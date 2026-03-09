/**
 * Global (cross-slice) migrations.
 * Runs after per-slice migrations. Use for one-time moves between slices (e.g. extract from character).
 */

import { getCombatStatsFromRealm } from "../../constants/realmProgression";
import { INITIAL_CHARACTER_STATS } from "../types/characterStats";
import { DEFAULT_NOTIFICATION_PREFS, DEFAULT_SOUND_VOLUME } from "./characterMigrations";

export type GlobalMigrator = (rootState: Record<string, unknown>) => void;

/** v1: Extract settings from character if still embedded (legacy persist). */
const extractSettingsFromCharacter: GlobalMigrator = (rootState) => {
  const char = rootState.character;
  if (!rootState.settings && char && typeof char === "object" && !Array.isArray(char)) {
    const c = char as Record<string, unknown>;
    rootState.settings = {
      notificationPrefs: c.notificationPrefs ?? { ...DEFAULT_NOTIFICATION_PREFS },
      soundVolume: c.soundVolume ?? { ...DEFAULT_SOUND_VOLUME },
      deathPenaltyMode: c.deathPenaltyMode ?? "normal",
      autoLootUnlocked: c.autoLootUnlocked ?? false,
      autoLoot: c.autoLoot ?? false,
      autoEatUnlocked: c.autoEatUnlocked ?? false,
      autoEat: c.autoEat ?? false,
      autoEatHpPercent: c.autoEatHpPercent ?? 30,
    };
    delete c.notificationPrefs;
    delete c.soundVolume;
    delete c.deathPenaltyMode;
    delete c.autoLootUnlocked;
    delete c.autoLoot;
    delete c.autoEatUnlocked;
    delete c.autoEat;
    delete c.autoEatHpPercent;
  }
};

/** v2: Extract reincarnation from character if still embedded (legacy persist). */
const extractReincarnationFromCharacter: GlobalMigrator = (rootState) => {
  const char = rootState.character;
  if (!rootState.reincarnation && char && typeof char === "object" && !Array.isArray(char)) {
    const c = char as Record<string, unknown>;
    rootState.reincarnation = {
      reincarnationCount: c.reincarnationCount ?? 0,
      karmaPoints: c.karmaPoints ?? 0,
      totalKarmaEarned: c.totalKarmaEarned ?? 0,
      karmaBonusLevels: c.karmaBonusLevels ?? {},
    };
    delete c.reincarnationCount;
    delete c.karmaPoints;
    delete c.totalKarmaEarned;
    delete c.karmaBonusLevels;
  }
};

/** v3: Ensure combat slice exists (extracted from character). Migrate currentHealth/isWeakened from character if present. */
const ensureCombatSlice: GlobalMigrator = (rootState) => {
  if (rootState.combat != null && typeof rootState.combat === "object") return;
  const char = rootState.character;
  const c = char && typeof char === "object" && !Array.isArray(char) ? (char as Record<string, unknown>) : null;
  const initialHealth = getCombatStatsFromRealm("Mortal", 0).health;
  rootState.combat = {
    currentHealth: (c?.currentHealth as number) ?? initialHealth,
    isWeakened: (c?.isWeakened as boolean) ?? false,
    weakenedMeditationSecondsDone: (c?.weakenedMeditationSecondsDone as number) ?? 0,
  };
  if (c) {
    delete c.currentHealth;
    delete c.isWeakened;
    delete c.weakenedMeditationSecondsDone;
  }
};

/** v4: Ensure stats slice exists (extracted from character). */
const ensureStatsSlice: GlobalMigrator = (rootState) => {
  if (rootState.stats != null && typeof rootState.stats === "object") return;
  const char = rootState.character;
  const c = char && typeof char === "object" && !Array.isArray(char) ? (char as Record<string, unknown>) : null;
  const fromChar = c?.stats && typeof c.stats === "object" ? (c.stats as Record<string, unknown>) : null;
  rootState.stats = fromChar
    ? {
        enemiesKilledByArea: fromChar.enemiesKilledByArea ?? {},
        itemsGatheredFishing: fromChar.itemsGatheredFishing ?? 0,
        itemsGatheredMining: fromChar.itemsGatheredMining ?? 0,
        itemsGatheredGathering: fromChar.itemsGatheredGathering ?? 0,
        totalSpiritStonesEarned: fromChar.totalSpiritStonesEarned ?? 0,
        totalQiGenerated: fromChar.totalQiGenerated ?? 0,
        totalBreakthroughs: fromChar.totalBreakthroughs ?? 0,
        timePlayedMs: fromChar.timePlayedMs ?? 0,
        highestRealmStep: fromChar.highestRealmStep ?? 0,
        itemsCraftedAlchemy: fromChar.itemsCraftedAlchemy ?? 0,
        itemsCraftedForging: fromChar.itemsCraftedForging ?? 0,
        itemsCraftedCooking: fromChar.itemsCraftedCooking ?? 0,
        deaths: fromChar.deaths ?? 0,
      }
    : { ...INITIAL_CHARACTER_STATS };
  if (c) delete c.stats;
};

/** v5: Ensure sect slice exists (extracted from character). */
const ensureSectSlice: GlobalMigrator = (rootState) => {
  if (rootState.sect != null && typeof rootState.sect === "object") return;
  const char = rootState.character;
  const c = char && typeof char === "object" && !Array.isArray(char) ? (char as Record<string, unknown>) : null;
  rootState.sect = {
    currentSectId: c?.currentSectId ?? null,
    sectRankIndex: (c?.sectRankIndex as number) ?? 0,
    promotionEndTime: c?.promotionEndTime ?? null,
    promotionToRankIndex: c?.promotionToRankIndex ?? null,
    sectQuestProgress: (c?.sectQuestProgress as Record<number, number>) ?? {},
    sectQuestKillCount: (c?.sectQuestKillCount as Record<number, number>) ?? {},
    obtainedSectTreasureIds: (c?.obtainedSectTreasureIds as number[]) ?? [],
    npcFavor: (c?.npcFavor as Record<string, number>) ?? {},
    realmDialogueUsed: (c?.realmDialogueUsed as Record<string, Record<string, boolean>>) ?? {},
    cultivationPartner: c?.cultivationPartner ?? null,
  };
  if (c) {
    delete c.currentSectId;
    delete c.sectRankIndex;
    delete c.promotionEndTime;
    delete c.promotionToRankIndex;
    delete c.sectQuestProgress;
    delete c.sectQuestKillCount;
    delete c.obtainedSectTreasureIds;
    delete c.npcFavor;
    delete c.realmDialogueUsed;
    delete c.cultivationPartner;
  }
};

/** v6: Ensure inventory slice exists (extracted from character). */
const ensureInventorySlice: GlobalMigrator = (rootState) => {
  if (rootState.inventory != null && typeof rootState.inventory === "object") return;
  const char = rootState.character;
  const c = char && typeof char === "object" && !Array.isArray(char) ? (char as Record<string, unknown>) : null;
  rootState.inventory = {
    itemsById: (c?.itemsById as Record<number, number>) ?? {},
  };
  if (c) delete c.itemsById;
};

/** v7: Ensure equipment slice exists (extracted from character). */
const ensureEquipmentSlice: GlobalMigrator = (rootState) => {
  if (rootState.equipment != null && typeof rootState.equipment === "object") return;
  const char = rootState.character;
  const c = char && typeof char === "object" && !Array.isArray(char) ? (char as Record<string, unknown>) : null;
  const ALL_EQUIPMENT_SLOTS = ["sword", "helmet", "body", "shoes", "legs", "ring", "amulet", "qiTechnique", "combatTechnique"] as const;
  const emptyEquipment = ALL_EQUIPMENT_SLOTS.reduce(
    (acc, slot) => ({ ...acc, [slot]: null }),
    {} as Record<string, unknown>
  );
  rootState.equipment = {
    equipment: (c?.equipment as Record<string, unknown>) ?? emptyEquipment,
  };
  if (c) delete c.equipment;
};

/** v8: Ensure skills slice exists (extracted from character). XP and cast state for fishing/mining/gathering/alchemy/forging/cooking. */
const ensureSkillsSlice: GlobalMigrator = (rootState) => {
  if (rootState.skills != null && typeof rootState.skills === "object") return;
  const char = rootState.character;
  const c = char && typeof char === "object" && !Array.isArray(char) ? (char as Record<string, unknown>) : null;
  rootState.skills = {
    fishingXP: (c?.fishingXP as number) ?? 0,
    miningXP: (c?.miningXP as number) ?? 0,
    gatheringXP: (c?.gatheringXP as number) ?? 0,
    alchemyXP: (c?.alchemyXP as number) ?? 0,
    forgingXP: (c?.forgingXP as number) ?? 0,
    cookingXP: (c?.cookingXP as number) ?? 0,
    currentFishingArea: c?.currentFishingArea ?? null,
    fishingCastStartTime: c?.fishingCastStartTime ?? null,
    fishingCastDuration: (c?.fishingCastDuration as number) ?? 0,
    fishingCastId: (c?.fishingCastId as number) ?? 0,
    currentMiningArea: c?.currentMiningArea ?? null,
    miningCastStartTime: c?.miningCastStartTime ?? null,
    miningCastDuration: (c?.miningCastDuration as number) ?? 0,
    miningCastId: (c?.miningCastId as number) ?? 0,
    currentGatheringArea: c?.currentGatheringArea ?? null,
    gatheringCastStartTime: c?.gatheringCastStartTime ?? null,
    gatheringCastDuration: (c?.gatheringCastDuration as number) ?? 0,
    gatheringCastId: (c?.gatheringCastId as number) ?? 0,
  };
  if (c) {
    delete c.fishingXP;
    delete c.miningXP;
    delete c.gatheringXP;
    delete c.alchemyXP;
    delete c.forgingXP;
    delete c.cookingXP;
    delete c.currentFishingArea;
    delete c.fishingCastStartTime;
    delete c.fishingCastDuration;
    delete c.fishingCastId;
    delete c.currentMiningArea;
    delete c.miningCastStartTime;
    delete c.miningCastDuration;
    delete c.miningCastId;
    delete c.currentGatheringArea;
    delete c.gatheringCastStartTime;
    delete c.gatheringCastDuration;
    delete c.gatheringCastId;
  }
};

/** v9: Ensure avatars slice exists (extracted from character). */
const ensureAvatarsSlice: GlobalMigrator = (rootState) => {
  if (rootState.avatars != null && typeof rootState.avatars === "object") return;
  const char = rootState.character;
  const c = char && typeof char === "object" && !Array.isArray(char) ? (char as Record<string, unknown>) : null;
  rootState.avatars = {
    avatars: (c?.avatars as unknown[]) ?? [],
    nextAvatarId: (c?.nextAvatarId as number) ?? 1,
    expeditionEndTime: c?.expeditionEndTime ?? null,
    expeditionMissionId: c?.expeditionMissionId ?? null,
  };
  if (c) {
    delete c.avatars;
    delete c.nextAvatarId;
    delete c.expeditionEndTime;
    delete c.expeditionMissionId;
  }
};

/** v10: Normalize current skill area payloads from prefixed keys to generic xp/delay. */
const normalizeCurrentSkillAreas: GlobalMigrator = (rootState) => {
  const skills = rootState.skills as Record<string, unknown> | undefined;
  if (!skills || typeof skills !== "object") return;

  const normFishing = skills.currentFishingArea;
  if (normFishing && typeof normFishing === "object" && !Array.isArray(normFishing)) {
    const a = normFishing as Record<string, unknown>;
    if ("fishingXP" in a && !("xp" in a)) {
      skills.currentFishingArea = {
        areaId: a.areaId,
        xp: a.fishingXP,
        delay: a.fishingDelay,
        fishingLootIds: a.fishingLootIds,
        rareDropChancePercent: a.rareDropChancePercent,
        rareDropItemIds: a.rareDropItemIds,
      };
    }
  }

  const normMining = skills.currentMiningArea;
  if (normMining && typeof normMining === "object" && !Array.isArray(normMining)) {
    const a = normMining as Record<string, unknown>;
    if ("miningXP" in a && !("xp" in a)) {
      skills.currentMiningArea = {
        areaId: a.areaId,
        xp: a.miningXP,
        delay: a.miningDelay,
        miningLootId: a.miningLootId,
      };
    }
  }

  const normGathering = skills.currentGatheringArea;
  if (normGathering && typeof normGathering === "object" && !Array.isArray(normGathering)) {
    const a = normGathering as Record<string, unknown>;
    if ("gatheringXP" in a && !("xp" in a)) {
      skills.currentGatheringArea = {
        areaId: a.areaId,
        xp: a.gatheringXP,
        delay: a.gatheringDelay,
        gatheringLootIds: a.gatheringLootIds,
        rareDropChancePercent: a.rareDropChancePercent,
        rareDropItemIds: a.rareDropItemIds,
      };
    }
  }
};

export const globalMigrations: readonly GlobalMigrator[] = [
  extractSettingsFromCharacter,
  extractReincarnationFromCharacter,
  ensureCombatSlice,
  ensureStatsSlice,
  ensureSectSlice,
  ensureInventorySlice,
  ensureEquipmentSlice,
  ensureSkillsSlice,
  normalizeCurrentSkillAreas,
  ensureAvatarsSlice,
];
