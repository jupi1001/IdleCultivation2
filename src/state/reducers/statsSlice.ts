/**
 * Stats slice: lifetime statistics (enemies killed, items gathered, spirit stones, etc.).
 * Updated via own reducers and via extraReducers listening to character/skills actions.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStepIndex } from "../../constants/realmProgression";
import { characterCoreSlice } from "./characterCoreSlice";
import { skillsSlice } from "./skillsSlice";
import type { CharacterStats } from "../types/characterStats";
import { INITIAL_CHARACTER_STATS } from "../types/characterStats";

export type { CharacterStats };

const initialState: CharacterStats = { ...INITIAL_CHARACTER_STATS };

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    recordEnemyKill: (state, action: PayloadAction<string>) => {
      const area = action.payload;
      state.enemiesKilledByArea[area] = (state.enemiesKilledByArea[area] ?? 0) + 1;
    },
    recordDeath: (state) => {
      state.deaths += 1;
    },
    recordItemCrafted: (state, action: PayloadAction<"alchemy" | "forging" | "cooking">) => {
      if (action.payload === "alchemy") state.itemsCraftedAlchemy += 1;
      else if (action.payload === "forging") state.itemsCraftedForging += 1;
      else state.itemsCraftedCooking += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(characterCoreSlice.actions.addMoney, (state, action) => {
        state.totalSpiritStonesEarned += action.payload;
      })
      .addCase(characterCoreSlice.actions.addQi, (state, action) => {
        state.totalQiGenerated += action.payload;
      })
      .addCase(characterCoreSlice.actions.setLastActiveTimestamp, (state, action) => {
        const payload = action.payload as { newTimestamp: number; previousTimestamp?: number };
        if (payload.previousTimestamp != null && payload.previousTimestamp > 0) {
          state.timePlayedMs += Math.max(0, payload.newTimestamp - payload.previousTimestamp);
        }
      })
      .addCase(characterCoreSlice.actions.breakthrough, (state, action) => {
        if (action.payload) {
          state.totalBreakthroughs += 1;
          const step = getStepIndex(action.payload.nextRealmId, action.payload.nextRealmLevel);
          if (step > state.highestRealmStep) state.highestRealmStep = step;
        }
      })
      .addCase(skillsSlice.actions.completeFishingCastCommit, (state, action) => {
        const count =
          1 +
          (action.payload.rareDropItem ? 1 : 0) +
          (action.payload.skillingSetDropItem ? 1 : 0);
        state.itemsGatheredFishing += count;
      })
      .addCase(skillsSlice.actions.completeMiningCastCommit, (state, action) => {
        const lootQty = Math.max(1, action.payload.lootQuantity ?? 1);
        state.itemsGatheredMining +=
          lootQty +
          (action.payload.geodeDropped ? 1 : 0) +
          (action.payload.skillingSetDropItem ? 1 : 0);
      })
      .addCase(skillsSlice.actions.completeGatheringCastCommit, (state, action) => {
        const count =
          1 +
          (action.payload.rareDropItem ? 1 : 0) +
          (action.payload.skillingSetDropItem ? 1 : 0);
        state.itemsGatheredGathering += count;
      });
  },
});

export const { recordEnemyKill, recordDeath, recordItemCrafted } = statsSlice.actions;
export default statsSlice.reducer;
