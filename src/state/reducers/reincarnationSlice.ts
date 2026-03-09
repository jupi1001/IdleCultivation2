/**
 * Reincarnation slice: reincarnation count, karma points, total karma earned,
 * and purchased karma bonus levels. Preserved across reincarnations.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KARMA_BONUSES_BY_ID, type KarmaBonusId } from "../../constants/reincarnation";

export interface ReincarnationState {
  reincarnationCount: number;
  karmaPoints: number;
  totalKarmaEarned: number;
  karmaBonusLevels: Partial<Record<KarmaBonusId, number>>;
}

const initialState: ReincarnationState = {
  reincarnationCount: 0,
  karmaPoints: 0,
  totalKarmaEarned: 0,
  karmaBonusLevels: {},
};

export const reincarnationSlice = createSlice({
  name: "reincarnation",
  initialState,
  reducers: {
    /** Called when player reincarnates. Payload includes startingMoneyBonus for character reset. */
    reincarnate: (state, action: PayloadAction<{ karmaEarned: number; startingMoneyBonus?: number }>) => {
      state.reincarnationCount += 1;
      state.karmaPoints += action.payload.karmaEarned;
      state.totalKarmaEarned += action.payload.karmaEarned;
    },
    purchaseKarmaBonus: (state, action: PayloadAction<KarmaBonusId>) => {
      const bonus = KARMA_BONUSES_BY_ID[action.payload];
      if (!bonus) return;
      const currentLevel = state.karmaBonusLevels[action.payload] ?? 0;
      if (currentLevel >= bonus.maxLevel) return;
      if (state.karmaPoints < bonus.costPerLevel) return;
      state.karmaPoints -= bonus.costPerLevel;
      state.karmaBonusLevels[action.payload] = currentLevel + 1;
    },
  },
});

export const { reincarnate, purchaseKarmaBonus } = reincarnationSlice.actions;

export default reincarnationSlice.reducer;
