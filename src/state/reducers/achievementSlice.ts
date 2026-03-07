import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AchievementState {
  /** Set of unlocked achievement ids. */
  unlocked: Record<string, number>;
}

const initialState: AchievementState = {
  unlocked: {},
};

export const achievementSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    unlockAchievement: (state, action: PayloadAction<string>) => {
      if (!state.unlocked[action.payload]) {
        state.unlocked[action.payload] = Date.now();
      }
    },
    unlockAchievements: (state, action: PayloadAction<string[]>) => {
      const now = Date.now();
      for (const id of action.payload) {
        if (!state.unlocked[id]) {
          state.unlocked[id] = now;
        }
      }
    },
  },
});

export const { unlockAchievement, unlockAchievements } = achievementSlice.actions;
export default achievementSlice.reducer;
