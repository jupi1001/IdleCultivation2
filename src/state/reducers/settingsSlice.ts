/**
 * Settings slice: notification prefs, sound volume, death penalty mode,
 * auto-loot / auto-eat toggles (persist through reincarnation).
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationPrefs {
  toastsEnabled: boolean;
  levelUp: boolean;
  rareDrop: boolean;
  achievement: boolean;
  expedition: boolean;
}

export interface SettingsState {
  notificationPrefs: NotificationPrefs;
  soundVolume: { music: number; sfx: number };
  deathPenaltyMode: "normal" | "casual";
  autoLootUnlocked: boolean;
  autoLoot: boolean;
  autoEatUnlocked: boolean;
  autoEat: boolean;
  autoEatHpPercent: number;
}

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  toastsEnabled: true,
  levelUp: true,
  rareDrop: true,
  achievement: true,
  expedition: true,
};

const DEFAULT_SOUND_VOLUME = { music: 100, sfx: 100 };

const initialState: SettingsState = {
  notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
  soundVolume: { ...DEFAULT_SOUND_VOLUME },
  deathPenaltyMode: "normal",
  autoLootUnlocked: false,
  autoLoot: false,
  autoEatUnlocked: false,
  autoEat: false,
  autoEatHpPercent: 30,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setNotificationPrefs: (state, action: PayloadAction<Partial<NotificationPrefs>>) => {
      Object.assign(state.notificationPrefs, action.payload);
    },
    setSoundVolume: (state, action: PayloadAction<{ music?: number; sfx?: number }>) => {
      if (action.payload.music != null)
        state.soundVolume.music = Math.max(0, Math.min(100, action.payload.music));
      if (action.payload.sfx != null)
        state.soundVolume.sfx = Math.max(0, Math.min(100, action.payload.sfx));
    },
    setDeathPenaltyMode: (state, action: PayloadAction<"normal" | "casual">) => {
      state.deathPenaltyMode = action.payload;
    },
    purchaseAutoLootUnlock: (state) => {
      if (state.autoLootUnlocked) return;
      state.autoLootUnlocked = true;
      state.autoLoot = true;
    },
    setAutoLoot: (state, action: PayloadAction<boolean>) => {
      if (!state.autoLootUnlocked) return;
      state.autoLoot = action.payload;
    },
    purchaseAutoEatUnlock: (state) => {
      if (state.autoEatUnlocked) return;
      state.autoEatUnlocked = true;
      state.autoEat = true;
    },
    setAutoEat: (state, action: PayloadAction<boolean>) => {
      if (!state.autoEatUnlocked) return;
      state.autoEat = action.payload;
    },
    setAutoEatHpPercent: (state, action: PayloadAction<number>) => {
      state.autoEatHpPercent = Math.min(99, Math.max(1, Math.round(action.payload)));
    },
  },
});

export const {
  setNotificationPrefs,
  setSoundVolume,
  setDeathPenaltyMode,
  purchaseAutoLootUnlock,
  setAutoLoot,
  purchaseAutoEatUnlock,
  setAutoEat,
  setAutoEatHpPercent,
} = settingsSlice.actions;

export default settingsSlice.reducer;
