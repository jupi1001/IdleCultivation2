/**
 * Settings slice migrations.
 * Owned by: state/reducers/settingsSlice.
 */

import type { SliceMigrator } from "./types";

const DEFAULT_NOTIFICATION_PREFS = {
  toastsEnabled: true,
  levelUp: true,
  rareDrop: true,
  achievement: true,
  expedition: true,
};

const DEFAULT_SOUND_VOLUME = { music: 100, sfx: 100 };

/** v1: Ensure settings has all required fields with defaults. */
const ensureSettingsDefaults: SliceMigrator = (sliceState) => {
  if (!sliceState || typeof sliceState !== "object") return sliceState;
  const s = sliceState as Record<string, unknown>;
  if (s.notificationPrefs == null) s.notificationPrefs = { ...DEFAULT_NOTIFICATION_PREFS };
  if (s.soundVolume == null) s.soundVolume = { ...DEFAULT_SOUND_VOLUME };
  if (s.deathPenaltyMode == null) s.deathPenaltyMode = "normal";
  if (s.autoLootUnlocked == null) s.autoLootUnlocked = false;
  if (s.autoLoot == null) s.autoLoot = false;
  if (s.autoEatUnlocked == null) s.autoEatUnlocked = false;
  if (s.autoEat == null) s.autoEat = false;
  if (s.autoEatHpPercent == null) s.autoEatHpPercent = 30;
  return sliceState;
};

export const settingsMigrations: readonly SliceMigrator[] = [ensureSettingsDefaults];
