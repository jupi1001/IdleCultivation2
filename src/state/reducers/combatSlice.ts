/**
 * Combat slice: current vitality (HP), weakened state after death, and recovery progress.
 * Synced with realm via extraReducers (setRealm, breakthrough, reincarnate).
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCombatStatsFromRealm } from "../../constants/realmProgression";
import { characterCoreSlice } from "./characterCoreSlice";
import { reincarnationSlice } from "./reincarnationSlice";
import { settingsSlice } from "./settingsSlice";

/** Seconds of meditation required to clear weakened state after death (normal mode). */
export const WEAKENED_MEDITATION_SECONDS = 30;

/** Stat multiplier when weakened (e.g. 0.5 = 50% attack/defense/health). */
export const WEAKENED_STAT_MULTIPLIER = 0.5;

export interface CombatState {
  currentHealth: number;
  isWeakened: boolean;
  weakenedMeditationSecondsDone: number;
}

const initialRealmStats = getCombatStatsFromRealm("Mortal", 0);

const initialState: CombatState = {
  currentHealth: initialRealmStats.health,
  isWeakened: false,
  weakenedMeditationSecondsDone: 0,
};

export const combatSlice = createSlice({
  name: "combat",
  initialState,
  reducers: {
    setCurrentHealth: (state, action: PayloadAction<number>) => {
      state.currentHealth = Math.max(0, action.payload);
    },
    regenerateVitality: (state, action: PayloadAction<{ amount: number; maxHealth: number }>) => {
      const { amount, maxHealth } = action.payload;
      state.currentHealth = Math.min(maxHealth, state.currentHealth + amount);
    },
    setWeakened: (state, action: PayloadAction<boolean>) => {
      state.isWeakened = action.payload;
      if (!action.payload) state.weakenedMeditationSecondsDone = 0;
    },
    tickWeakenedRecovery: (
      state,
      action: PayloadAction<{ seconds: number; deathPenaltyMode: "normal" | "casual" }>
    ) => {
      if (!state.isWeakened || action.payload.deathPenaltyMode !== "normal") return;
      state.weakenedMeditationSecondsDone += action.payload.seconds;
      if (state.weakenedMeditationSecondsDone >= WEAKENED_MEDITATION_SECONDS) {
        state.isWeakened = false;
        state.weakenedMeditationSecondsDone = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(characterCoreSlice.actions.setRealm, (state, action) => {
        const stats = getCombatStatsFromRealm(action.payload.realm, action.payload.realmLevel);
        state.currentHealth = stats.health;
      })
      .addCase(characterCoreSlice.actions.breakthrough, (state, action) => {
        if (action.payload) {
          const stats = getCombatStatsFromRealm(action.payload.nextRealmId, action.payload.nextRealmLevel);
          state.currentHealth = stats.health;
        }
      })
      .addCase(reincarnationSlice.actions.reincarnate, () => {
        const stats = getCombatStatsFromRealm("Mortal", 0);
        return {
          currentHealth: stats.health,
          isWeakened: false,
          weakenedMeditationSecondsDone: 0,
        };
      })
      .addCase(settingsSlice.actions.setDeathPenaltyMode, (state, action) => {
        if (action.payload === "casual") {
          state.isWeakened = false;
          state.weakenedMeditationSecondsDone = 0;
        }
      });
  },
});

export const { setCurrentHealth, regenerateVitality, setWeakened, tickWeakenedRecovery } =
  combatSlice.actions;

export default combatSlice.reducer;
