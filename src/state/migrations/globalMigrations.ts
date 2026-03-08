/**
 * Global (cross-slice) migrations.
 * Runs after per-slice migrations. Use for one-time moves between slices (e.g. extract from character).
 */

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

export const globalMigrations: readonly GlobalMigrator[] = [
  extractSettingsFromCharacter,
  extractReincarnationFromCharacter,
];
