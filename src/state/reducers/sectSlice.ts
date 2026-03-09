/**
 * Sect slice: current sect, rank, promotion, quest, NPC favor, cultivation partner.
 * Not reset on reincarnation: sectQuestProgress, sectQuestKillCount, obtainedSectTreasureIds,
 * npcFavor, realmDialogueUsed, cultivationPartner.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SECT_POSITIONS } from "../../constants/data";
import { getStepIndex, type RealmId } from "../../constants/realmProgression";
import {
  REALM_DIALOGUE_FAVOR,
  SECT_QUEST_KILLS_REQUIRED,
  SECT_TREASURE_ITEM_ID_BY_SECT,
  SECT_TREASURE_ITEMS_BY_ID,
} from "../../constants/sectRelationships";
import { reincarnationSlice } from "./reincarnationSlice";

export interface SectState {
  currentSectId: number | null;
  sectRankIndex: number;
  promotionEndTime: number | null;
  promotionToRankIndex: number | null;
  sectQuestProgress: Record<number, number>;
  sectQuestKillCount: Record<number, number>;
  obtainedSectTreasureIds: number[];
  npcFavor: Record<string, number>;
  realmDialogueUsed: Record<string, Record<string, boolean>>;
  cultivationPartner: { sectId: number; npcId: number } | null;
}

const initialState: SectState = {
  currentSectId: null,
  sectRankIndex: 0,
  promotionEndTime: null,
  promotionToRankIndex: null,
  sectQuestProgress: {},
  sectQuestKillCount: {},
  obtainedSectTreasureIds: [],
  npcFavor: {},
  realmDialogueUsed: {},
  cultivationPartner: null,
};

function computeRankForRealm(realm: RealmId, realmLevel: number): number {
  const step = getStepIndex(realm, realmLevel);
  let rank = 0;
  for (let i = 0; i < SECT_POSITIONS.length; i++) {
    if (step >= SECT_POSITIONS[i].requiredStepIndex) rank = i;
  }
  return rank;
}

export const sectSlice = createSlice({
  name: "sect",
  initialState,
  reducers: {
    /** sectId null = leave; when joining pass realm/realmLevel to compute initial rank. */
    setSect: (
      state,
      action: PayloadAction<
        number | null | { sectId: number | null; realm?: RealmId; realmLevel?: number }
      >
    ) => {
      const payload = action.payload;
      const sectId = typeof payload === "object" && payload !== null ? payload.sectId : payload;
      state.currentSectId = sectId;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
      if (sectId == null) {
        state.sectRankIndex = 0;
        return;
      }
      const realm = typeof payload === "object" && payload !== null ? payload.realm : undefined;
      const realmLevel = typeof payload === "object" && payload !== null ? payload.realmLevel : undefined;
      if (realm != null && realmLevel !== undefined) {
        state.sectRankIndex = computeRankForRealm(realm, realmLevel);
      }
    },
    setSectRank: (state, action: PayloadAction<number>) => {
      state.sectRankIndex = Math.max(0, Math.min(3, action.payload));
    },
    startPromotion: (
      state,
      action: PayloadAction<{ targetRankIndex: number; durationMs: number }>
    ) => {
      state.promotionEndTime = Date.now() + action.payload.durationMs;
      state.promotionToRankIndex = action.payload.targetRankIndex;
    },
    /** Pass realm/realmLevel so we can check if promotion completes. */
    completePromotion: (
      state,
      action: PayloadAction<{ realm: RealmId; realmLevel: number }>
    ) => {
      if (state.promotionEndTime == null || state.promotionToRankIndex == null) return;
      if (Date.now() < state.promotionEndTime) return;
      const step = getStepIndex(action.payload.realm, action.payload.realmLevel);
      const required = SECT_POSITIONS[state.promotionToRankIndex].requiredStepIndex;
      if (step >= required) state.sectRankIndex = state.promotionToRankIndex;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
    },
    cancelPromotion: (state) => {
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
    },
    acceptSectQuest: (state, action: PayloadAction<number>) => {
      const sectId = action.payload;
      if (state.currentSectId !== sectId) return;
      const step = state.sectQuestProgress[sectId] ?? 0;
      if (step !== 0) return;
      state.sectQuestProgress[sectId] = 1;
      state.sectQuestKillCount[sectId] = 0;
    },
    incrementSectQuestKillCount: (state, action: PayloadAction<number>) => {
      const sectId = action.payload;
      if (state.currentSectId !== sectId) return;
      const step = state.sectQuestProgress[sectId] ?? 0;
      if (step !== 1) return;
      const count = (state.sectQuestKillCount[sectId] ?? 0) + 1;
      state.sectQuestKillCount[sectId] = count;
      if (count >= SECT_QUEST_KILLS_REQUIRED) state.sectQuestProgress[sectId] = 2;
    },
    /** Caller must dispatch addItemById(sectTreasureItemId, 1) to add the item. */
    claimSectQuestReward: (state, action: PayloadAction<number>) => {
      const sectId = action.payload;
      const step = state.sectQuestProgress[sectId] ?? 0;
      if (step !== 2) return;
      const itemId = SECT_TREASURE_ITEM_ID_BY_SECT[sectId];
      if (itemId == null || state.obtainedSectTreasureIds.includes(itemId)) return;
      if (!SECT_TREASURE_ITEMS_BY_ID[itemId]) return;
      state.sectQuestProgress[sectId] = 3;
      state.obtainedSectTreasureIds.push(itemId);
    },
    addNpcFavor: (state, action: PayloadAction<{ sectId: number; npcId: number; amount: number }>) => {
      const { sectId, npcId, amount } = action.payload;
      const key = `${sectId}-${npcId}`;
      const current = state.npcFavor[key] ?? 0;
      state.npcFavor[key] = Math.min(100, Math.max(0, current + amount));
    },
    useRealmDialogue: (
      state,
      action: PayloadAction<{ sectId: number; npcId: number; realmId: string }>
    ) => {
      const { sectId, npcId, realmId } = action.payload;
      const key = `${sectId}-${npcId}`;
      if (!state.realmDialogueUsed[key]) state.realmDialogueUsed[key] = {};
      if (state.realmDialogueUsed[key][realmId]) return;
      state.realmDialogueUsed[key][realmId] = true;
      const current = state.npcFavor[key] ?? 0;
      state.npcFavor[key] = Math.min(100, current + REALM_DIALOGUE_FAVOR);
    },
    setCultivationPartner: (
      state,
      action: PayloadAction<{ sectId: number; npcId: number } | null>
    ) => {
      state.cultivationPartner = action.payload;
    },
    /** Only updates favor. Caller must dispatch reduceMoney(GIFT_SPIRIT_STONE_COST). */
    giftNpc: (state, action: PayloadAction<{ sectId: number; npcId: number }>) => {
      const { sectId, npcId } = action.payload;
      if (state.currentSectId !== sectId) return;
      const key = `${sectId}-${npcId}`;
      const current = state.npcFavor[key] ?? 0;
      state.npcFavor[key] = Math.min(100, current + 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reincarnationSlice.actions.reincarnate, (state) => {
      state.currentSectId = null;
      state.sectRankIndex = 0;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
    });
  },
});

export const {
  setSect,
  setSectRank,
  startPromotion,
  completePromotion,
  cancelPromotion,
  acceptSectQuest,
  incrementSectQuestKillCount,
  claimSectQuestReward,
  addNpcFavor,
  useRealmDialogue,
  setCultivationPartner,
  giftNpc,
} = sectSlice.actions;

export default sectSlice.reducer;
