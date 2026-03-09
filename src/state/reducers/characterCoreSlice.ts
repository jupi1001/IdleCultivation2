/**
 * Character core slice: name, combat stats, money, realm, qi, path, gender,
 * currentActivity, talentLevels, bonus stats, lastActiveTimestamp, lastOfflineSummary.
 * Avatars/expedition live in avatarsSlice.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ActivityType } from "../../constants/activities";
import type { CultivationPath } from "../../constants/cultivationPath";
import { getBreakthroughQiRequired, getNextRealm, getStepIndex, getCombatStatsFromRealm, type RealmId } from "../../constants/realmProgression";
import { REINCARNATION_MIN_STEP } from "../../constants/reincarnation";
import { TALENT_NODES_BY_ID } from "../../constants/talents";
import Item from "../../interfaces/ItemI";
import { reincarnationSlice } from "./reincarnationSlice";
import { settingsSlice } from "./settingsSlice";

/** Seconds of meditation required to clear weakened state after death (normal mode). Re-exported for backward compat. */
export const WEAKENED_MEDITATION_SECONDS = 30;

/** Stat multiplier when weakened. Re-exported for backward compat. */
export const WEAKENED_STAT_MULTIPLIER = 0.5;

/** Payload for applyOfflineProgress (matches OfflineProgressResult from utils/offlineProgress). */
export interface ApplyOfflineProgressPayload {
  offlineMs: number;
  offlineQi: number;
  offlineSpiritStones: number;
  fishing?: { xp: number; casts: number; items: Item[] };
  mining?: { xp: number; casts: number; items: Item[] };
  gathering?: { xp: number; casts: number; items: Item[] };
}

/** Re-export skill area types from skillsSlice for backward compatibility. */
export type { CurrentFishingArea, CurrentMiningArea, CurrentGatheringArea, RareDropFields } from "./skillsSlice";

/** @deprecated Import from state/types/characterStats. Re-exported for backward compatibility. */
export type { CharacterStats } from "../types/characterStats";

/** Display-only summary for the Welcome Back modal (no item lists). */
export interface OfflineProgressSummary {
  offlineMs: number;
  offlineQi: number;
  offlineSpiritStones: number;
  fishing?: { xp: number; casts: number; itemCount: number };
  mining?: { xp: number; casts: number; itemCount: number };
  gathering?: { xp: number; casts: number; itemCount: number };
}

interface CharacterCoreState {
  name: string;
  attack: number;
  defense: number;
  health: number;
  money: number;
  miner: number;
  realm: RealmId;
  realmLevel: number;
  qi: number;
  currentActivity: ActivityType;
  path: CultivationPath | null;
  gender: "Male" | "Female" | null;
  talentLevels: Record<number, number>;
  bonusAttack: number;
  bonusDefense: number;
  bonusHealth: number;
  lastActiveTimestamp: number;
  lastOfflineSummary: OfflineProgressSummary | null;
}

const initialCombatStats = getCombatStatsFromRealm("Mortal", 0);

const initialState: CharacterCoreState = {
  name: "Mortal",
  attack: initialCombatStats.attack,
  defense: initialCombatStats.defense,
  health: initialCombatStats.health,
  money: 500,
  miner: 0,
  realm: "Mortal",
  realmLevel: 0,
  qi: 0,
  currentActivity: "none",
  path: null,
  gender: null,
  talentLevels: {},
  bonusAttack: 0,
  bonusDefense: 0,
  bonusHealth: 0,
  lastActiveTimestamp: 0,
  lastOfflineSummary: null,
};

export const characterCoreSlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    addAttack: (state, action: PayloadAction<number>) => {
      state.bonusAttack = state.bonusAttack + action.payload;
    },
    reduceAttack: (state, action: PayloadAction<number>) => {
      state.bonusAttack = Math.max(0, state.bonusAttack - action.payload);
    },
    addDefense: (state, action: PayloadAction<number>) => {
      state.bonusDefense = state.bonusDefense + action.payload;
    },
    reduceDefense: (state, action: PayloadAction<number>) => {
      state.bonusDefense = Math.max(0, state.bonusDefense - action.payload);
    },
    addHealth: (state, action: PayloadAction<number>) => {
      state.bonusHealth = state.bonusHealth + action.payload;
    },
    reduceHealth: (state, action: PayloadAction<number>) => {
      state.bonusHealth = Math.max(0, state.bonusHealth - action.payload);
    },
    addMoney: (state, action: PayloadAction<number>) => {
      state.money = state.money + action.payload;
    },
    reduceMoney: (state, action: PayloadAction<number>) => {
      state.money = state.money - action.payload;
    },
    addMiner: (state, action: PayloadAction<number>) => {
      state.miner = state.miner + action.payload;
    },
    addQi: (state, action: PayloadAction<number>) => {
      state.qi = Math.round((state.qi + action.payload) * 100) / 100;
    },
    setQi: (state, action: PayloadAction<number>) => {
      state.qi = action.payload;
    },
    setRealm: (state, action: PayloadAction<{ realm: RealmId; realmLevel: number }>) => {
      state.realm = action.payload.realm;
      state.realmLevel = action.payload.realmLevel;
      const stats = getCombatStatsFromRealm(action.payload.realm, action.payload.realmLevel);
      state.attack = stats.attack;
      state.defense = stats.defense;
      state.health = stats.health;
    },
    breakthrough: (state, action: PayloadAction<{ nextRealmId: RealmId; nextRealmLevel: number } | undefined>) => {
      const payload = action.payload;
      const next = payload ? { realmId: payload.nextRealmId, realmLevel: payload.nextRealmLevel } : getNextRealm(state.realm, state.realmLevel);
      if (next) {
        const requiredQi = getBreakthroughQiRequired(state.realm, state.realmLevel);
        state.qi = Math.max(0, Math.round((state.qi - requiredQi) * 100) / 100);
        state.realm = next.realmId;
        state.realmLevel = next.realmLevel;
        const stats = getCombatStatsFromRealm(next.realmId, next.realmLevel);
        state.attack = stats.attack;
        state.defense = stats.defense;
        state.health = stats.health;
      }
    },
    setCurrentActivity: (state, action: PayloadAction<ActivityType>) => {
      state.currentActivity = action.payload;
    },
    setPath: (state, action: PayloadAction<CultivationPath>) => {
      state.path = action.payload;
    },
    setGender: (state, action: PayloadAction<"Male" | "Female">) => {
      state.gender = action.payload;
    },
    purchaseTalentLevel: (state, action: PayloadAction<number>) => {
      const node = TALENT_NODES_BY_ID[action.payload];
      if (!node) return;
      if (node.path != null && state.path !== node.path) return;
      const currentLevel = state.talentLevels[node.id] ?? 0;
      if (currentLevel >= node.maxLevel) return;
      if (state.qi < node.costQi) return;
      if (node.requiredRealm) {
        const charStep = getStepIndex(state.realm, state.realmLevel);
        const reqStep = getStepIndex(node.requiredRealm.realmId, node.requiredRealm.realmLevel);
        if (charStep < reqStep) return;
      }
      if (node.requiredTalentIds?.length) {
        const allMet = node.requiredTalentIds.every((id) => {
          const reqNode = TALENT_NODES_BY_ID[id];
          return reqNode && (state.talentLevels[id] ?? 0) >= reqNode.maxLevel;
        });
        if (!allMet) return;
      }
      state.qi = Math.round((state.qi - node.costQi) * 100) / 100;
      state.talentLevels[node.id] = currentLevel + 1;
    },
    setLastActiveTimestamp: (state, action: PayloadAction<number | { newTimestamp: number; previousTimestamp?: number }>) => {
      const payload = action.payload;
      const newTimestamp = typeof payload === "number" ? payload : payload.newTimestamp;
      state.lastActiveTimestamp = newTimestamp;
    },
    applyOfflineProgress: (state, action: PayloadAction<ApplyOfflineProgressPayload>) => {
      const p = action.payload;
      state.qi = Math.round((state.qi + p.offlineQi) * 100) / 100;
      state.money += Math.floor(p.offlineSpiritStones);
      state.lastActiveTimestamp = Date.now();
      state.lastOfflineSummary = {
        offlineMs: p.offlineMs,
        offlineQi: p.offlineQi,
        offlineSpiritStones: p.offlineSpiritStones,
        ...(p.fishing && { fishing: { xp: p.fishing.xp, casts: p.fishing.casts, itemCount: p.fishing.items.length } }),
        ...(p.mining && { mining: { xp: p.mining.xp, casts: p.mining.casts, itemCount: p.mining.items.length } }),
        ...(p.gathering && { gathering: { xp: p.gathering.xp, casts: p.gathering.casts, itemCount: p.gathering.items.length } }),
      };
    },
    clearOfflineSummary: (state) => {
      state.lastOfflineSummary = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reincarnationSlice.actions.reincarnate, (state, action) => {
      const step = getStepIndex(state.realm, state.realmLevel);
      if (step < REINCARNATION_MIN_STEP) return;
      const startingMoneyBonus = action.payload.startingMoneyBonus ?? 0;
      const stats = getCombatStatsFromRealm("Mortal", 0);
      state.name = "Mortal";
      state.realm = "Mortal";
      state.realmLevel = 0;
      state.attack = stats.attack;
      state.defense = stats.defense;
      state.health = stats.health;
      state.qi = 0;
      state.money = 500 + startingMoneyBonus;
      state.miner = 0;
      state.bonusAttack = 0;
      state.bonusDefense = 0;
      state.bonusHealth = 0;
      state.talentLevels = {};
      state.currentActivity = "none";
      state.lastActiveTimestamp = Date.now();
      state.lastOfflineSummary = null;
    });
  },
});

export const {
  addAttack,
  reduceAttack,
  addDefense,
  reduceDefense,
  addHealth,
  reduceHealth,
  addMoney,
  reduceMoney,
  addMiner,
  addQi,
  setQi,
  setRealm,
  breakthrough,
  setCurrentActivity,
  setPath,
  setGender,
  purchaseTalentLevel,
  setLastActiveTimestamp,
  applyOfflineProgress,
  clearOfflineSummary,
} = characterCoreSlice.actions;

export { completeFishingCast, completeMiningCast, completeGatheringCast } from "./characterThunks";
export type { NotificationPrefs } from "./settingsSlice";
export default characterCoreSlice.reducer;
