/**
 * Skills slice: XP and cast state for fishing, mining, gathering, alchemy, forging, cooking.
 * Clears area/cast when currentActivity changes (via extraReducers) or on reincarnation.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ActivityType } from "../../constants/activities";
import type Item from "../../interfaces/ItemI";
import { characterCoreSlice } from "./characterCoreSlice";
import { reincarnationSlice } from "./reincarnationSlice";

/** Common optional rare-drop fields shared by skill areas that support rare drops. */
export interface RareDropFields {
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
}

export interface CurrentFishingArea extends RareDropFields {
  areaId: number;
  xp: number;
  delay: number;
  fishingLootIds: number[];
}

export interface CurrentMiningArea {
  areaId: number;
  xp: number;
  delay: number;
  miningLootId: number;
}

export interface CurrentGatheringArea extends RareDropFields {
  areaId: number;
  xp: number;
  delay: number;
  gatheringLootIds: number[];
}

/** Payload for skills portion of offline progress (XP + clear casts). Matches ApplyOfflineProgressPayload skill keys. */
export interface RewardResult {
  xp: number;
  items: Item[];
}

export interface SkillsOfflineProgressPayload {
  fishing?: RewardResult & { casts: number };
  mining?: RewardResult & { casts: number };
  gathering?: RewardResult & { casts: number };
}

interface SkillsState {
  fishingXP: number;
  miningXP: number;
  gatheringXP: number;
  alchemyXP: number;
  forgingXP: number;
  cookingXP: number;
  currentFishingArea: CurrentFishingArea | null;
  fishingCastStartTime: number | null;
  fishingCastDuration: number;
  fishingCastId: number;
  currentMiningArea: CurrentMiningArea | null;
  miningCastStartTime: number | null;
  miningCastDuration: number;
  miningCastId: number;
  currentGatheringArea: CurrentGatheringArea | null;
  gatheringCastStartTime: number | null;
  gatheringCastDuration: number;
  gatheringCastId: number;
}

const initialState: SkillsState = {
  fishingXP: 0,
  miningXP: 0,
  gatheringXP: 0,
  alchemyXP: 0,
  forgingXP: 0,
  cookingXP: 0,
  currentFishingArea: null,
  fishingCastStartTime: null,
  fishingCastDuration: 0,
  fishingCastId: 0,
  currentMiningArea: null,
  miningCastStartTime: null,
  miningCastDuration: 0,
  miningCastId: 0,
  currentGatheringArea: null,
  gatheringCastStartTime: null,
  gatheringCastDuration: 0,
  gatheringCastId: 0,
};

export const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    addFishingXP: (state, action: PayloadAction<number>) => {
      state.fishingXP += action.payload;
    },
    addMiningXP: (state, action: PayloadAction<number>) => {
      state.miningXP += action.payload;
    },
    addGatheringXP: (state, action: PayloadAction<number>) => {
      state.gatheringXP += action.payload;
    },
    addAlchemyXP: (state, action: PayloadAction<number>) => {
      state.alchemyXP += action.payload;
    },
    addForgingXP: (state, action: PayloadAction<number>) => {
      state.forgingXP += action.payload;
    },
    addCookingXP: (state, action: PayloadAction<number>) => {
      state.cookingXP += action.payload;
    },
    setCurrentFishingArea: (state, action: PayloadAction<CurrentFishingArea | null>) => {
      state.currentFishingArea = action.payload;
      if (!action.payload) {
        state.fishingCastStartTime = null;
        state.fishingCastDuration = 0;
      }
    },
    setFishingCast: (
      state,
      action: PayloadAction<{ startTime: number; duration: number; castId: number }>
    ) => {
      state.fishingCastStartTime = action.payload.startTime;
      state.fishingCastDuration = action.payload.duration;
      state.fishingCastId = action.payload.castId;
    },
    completeFishingCastCommit: (
      state,
      action: PayloadAction<{
        castId: number;
        xp: number;
        fishingLootIds: number[];
        rareDropItem?: Item | null;
        skillingSetDropItem?: Item | null;
      }>
    ) => {
      if (action.payload.castId !== state.fishingCastId) return;
      state.fishingCastStartTime = null;
      state.fishingCastDuration = 0;
      if (state.currentFishingArea) {
        state.fishingXP += action.payload.xp;
      }
    },
    setCurrentMiningArea: (state, action: PayloadAction<CurrentMiningArea | null>) => {
      state.currentMiningArea = action.payload;
      if (!action.payload) {
        state.miningCastStartTime = null;
        state.miningCastDuration = 0;
      }
    },
    setMiningCast: (
      state,
      action: PayloadAction<{ startTime: number; duration: number; castId: number }>
    ) => {
      state.miningCastStartTime = action.payload.startTime;
      state.miningCastDuration = action.payload.duration;
      state.miningCastId = action.payload.castId;
    },
    completeMiningCastCommit: (
      state,
      action: PayloadAction<{
        castId: number;
        xp: number;
        miningLootId: number;
        lootQuantity?: number;
        geodeDropped?: boolean;
        skillingSetDropItem?: Item | null;
      }>
    ) => {
      if (action.payload.castId !== state.miningCastId) return;
      state.miningCastStartTime = null;
      state.miningCastDuration = 0;
      if (state.currentMiningArea) {
        state.miningXP += action.payload.xp;
      }
    },
    setCurrentGatheringArea: (state, action: PayloadAction<CurrentGatheringArea | null>) => {
      state.currentGatheringArea = action.payload;
      if (!action.payload) {
        state.gatheringCastStartTime = null;
        state.gatheringCastDuration = 0;
      }
    },
    setGatheringCast: (
      state,
      action: PayloadAction<{ startTime: number; duration: number; castId: number }>
    ) => {
      state.gatheringCastStartTime = action.payload.startTime;
      state.gatheringCastDuration = action.payload.duration;
      state.gatheringCastId = action.payload.castId;
    },
    completeGatheringCastCommit: (
      state,
      action: PayloadAction<{
        castId: number;
        xp: number;
        gatheringLootIds: number[];
        rareDropItem?: Item | null;
        skillingSetDropItem?: Item | null;
      }>
    ) => {
      if (action.payload.castId !== state.gatheringCastId) return;
      state.gatheringCastStartTime = null;
      state.gatheringCastDuration = 0;
      if (state.currentGatheringArea) {
        state.gatheringXP += action.payload.xp;
      }
    },
    applyOfflineProgress: (state, action: PayloadAction<SkillsOfflineProgressPayload>) => {
      const p = action.payload;
      if (p.fishing) {
        state.fishingXP += p.fishing.xp;
        state.fishingCastStartTime = null;
        state.fishingCastDuration = 0;
      }
      if (p.mining) {
        state.miningXP += p.mining.xp;
        state.miningCastStartTime = null;
        state.miningCastDuration = 0;
      }
      if (p.gathering) {
        state.gatheringXP += p.gathering.xp;
        state.gatheringCastStartTime = null;
        state.gatheringCastDuration = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(characterCoreSlice.actions.setCurrentActivity, (state, action: PayloadAction<ActivityType>) => {
        const activity = action.payload;
        if (activity !== "fish") {
          state.currentFishingArea = null;
          state.fishingCastStartTime = null;
          state.fishingCastDuration = 0;
        }
        if (activity !== "mine") {
          state.currentMiningArea = null;
          state.miningCastStartTime = null;
          state.miningCastDuration = 0;
        }
        if (activity !== "gather") {
          state.currentGatheringArea = null;
          state.gatheringCastStartTime = null;
          state.gatheringCastDuration = 0;
        }
      })
      .addCase(reincarnationSlice.actions.reincarnate, () => initialState);
  },
});

export const {
  addFishingXP,
  addMiningXP,
  addGatheringXP,
  addAlchemyXP,
  addForgingXP,
  addCookingXP,
  setCurrentFishingArea,
  setFishingCast,
  completeFishingCastCommit,
  setCurrentMiningArea,
  setMiningCast,
  completeMiningCastCommit,
  setCurrentGatheringArea,
  setGatheringCast,
  completeGatheringCastCommit,
  applyOfflineProgress,
} = skillsSlice.actions;

export default skillsSlice.reducer;
