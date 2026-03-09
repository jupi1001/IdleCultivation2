/**
 * Avatars slice: avatars list, nextAvatarId, main-character expedition state.
 * startExpedition/clearExpedition for "main" also update currentActivity via thunks.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AvatarI } from "../../interfaces/AvatarI";
import { reincarnationSlice } from "./reincarnationSlice";

export interface AvatarsState {
  avatars: AvatarI[];
  nextAvatarId: number;
  /** Main character: when non-null, on expedition until this timestamp (ms). */
  expeditionEndTime: number | null;
  expeditionMissionId: number | null;
}

const initialState: AvatarsState = {
  avatars: [],
  nextAvatarId: 1,
  expeditionEndTime: null,
  expeditionMissionId: null,
};

export const avatarsSlice = createSlice({
  name: "avatars",
  initialState,
  reducers: {
    startExpedition: (
      state,
      action: PayloadAction<
        | { endTime: number; missionId: number; entityType: "main" }
        | { endTime: number; missionId: number; entityType: "avatar"; avatarId: number }
      >
    ) => {
      const payload = action.payload;
      if (payload.entityType === "main") {
        state.expeditionEndTime = payload.endTime;
        state.expeditionMissionId = payload.missionId;
      } else {
        const avatar = state.avatars.find((a) => a.id === payload.avatarId);
        if (avatar) {
          avatar.isBusy = true;
          avatar.expeditionEndTime = payload.endTime;
          avatar.expeditionMissionId = payload.missionId;
        }
      }
    },
    clearExpedition: (
      state,
      action: PayloadAction<{ entityType: "main" } | { entityType: "avatar"; avatarId: number }>
    ) => {
      const payload = action.payload;
      if (payload.entityType === "main") {
        state.expeditionEndTime = null;
        state.expeditionMissionId = null;
      } else {
        const avatar = state.avatars.find((a) => a.id === payload.avatarId);
        if (avatar) {
          avatar.isBusy = false;
          avatar.expeditionEndTime = null;
          avatar.expeditionMissionId = null;
        }
      }
    },
    createAvatar: (state, action: PayloadAction<{ name: string }>) => {
      const id = state.nextAvatarId++;
      state.avatars.push({
        id,
        name: action.payload.name || `Avatar ${state.avatars.length + 1}`,
        power: 1,
        isBusy: false,
        expeditionEndTime: null,
        expeditionMissionId: null,
      });
    },
    trainAvatar: (
      state,
      action: PayloadAction<
        | { avatarId: number; costType: "spiritStones" }
        | { avatarId: number; costType: "qiPill"; itemId: number }
      >
    ) => {
      const avatar = state.avatars.find((a) => a.id === action.payload.avatarId);
      if (!avatar || avatar.isBusy) return;
      avatar.power += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reincarnationSlice.actions.reincarnate, () => initialState);
  },
});

export const {
  startExpedition: startExpeditionAction,
  clearExpedition: clearExpeditionAction,
  createAvatar,
  trainAvatar,
} = avatarsSlice.actions;

export default avatarsSlice.reducer;
