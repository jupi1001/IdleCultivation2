import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CultivationPath } from "../../constants/cultivationPath";
import { fishTypes, oreTypes } from "../../constants/data";
import { getNextRealm, getStepIndex, type RealmId } from "../../constants/realmProgression";
import { TALENT_NODES_BY_ID } from "../../constants/talents";
import Item from "../../interfaces/ItemI";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { ALL_EQUIPMENT_SLOTS } from "../../types/EquipmentSlot";

export type CurrentFishingArea = {
  areaId: number;
  fishingXP: number;
  fishingDelay: number;
  fishingLootIds: number[];
};

export type CurrentMiningArea = {
  areaId: number;
  miningXP: number;
  miningDelay: number;
  miningLootId: number;
};

interface CharacterState {
  name: string;
  attack: number;
  defense: number;
  health: number;
  money: number;
  miner: number;
  items: Item[];
  fishingXP: number;
  realm: RealmId;
  realmLevel: number;
  qi: number;
  currentActivity: string;
  equipment: Record<EquipmentSlot, Item | null>;
  /** Righteous vs Demonic; chosen once at game start. Affects sects and cultivation tree. */
  path: CultivationPath | null;
  /** Talent id -> current level (0 = not purchased) */
  talentLevels: Record<number, number>;
  /** Immortals Island: when non-null, character is on expedition until this timestamp (ms) */
  expeditionEndTime: number | null;
  expeditionMissionId: number | null;
  /** When fishing: area being fished; cleared when activity changes away from fish */
  currentFishingArea: CurrentFishingArea | null;
  /** Current cast progress: start time (ms) and duration (ms); null when no cast in progress */
  fishingCastStartTime: number | null;
  fishingCastDuration: number;
  miningXP: number;
  currentMiningArea: CurrentMiningArea | null;
  miningCastStartTime: number | null;
  miningCastDuration: number;
}

const initialEquipment = ALL_EQUIPMENT_SLOTS.reduce(
  (acc, slot) => ({ ...acc, [slot]: null }),
  {} as Record<EquipmentSlot, Item | null>
);

const initialState: CharacterState = {
  name: "Mortal",
  attack: 10,
  defense: 1,
  health: 10,
  money: 500,
  miner: 0,
  items: [],
  fishingXP: 0,
  realm: "Mortal",
  realmLevel: 0,
  qi: 0,
  currentActivity: "none",
  equipment: initialEquipment,
  path: null,
  talentLevels: {},
  expeditionEndTime: null,
  expeditionMissionId: null,
  currentFishingArea: null,
  fishingCastStartTime: null,
  fishingCastDuration: 0,
  miningXP: 0,
  currentMiningArea: null,
  miningCastStartTime: null,
  miningCastDuration: 0,
};

export const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    addAttack: (state, action: PayloadAction<number>) => {
      state.attack = state.attack + action.payload;
    },
    reduceAttack: (state, action: PayloadAction<number>) => {
      state.attack = state.attack - action.payload;
    },
    addDefense: (state, action: PayloadAction<number>) => {
      state.defense = state.defense + action.payload;
    },
    reduceDefense: (state, action: PayloadAction<number>) => {
      state.defense = state.defense - action.payload;
    },
    addHealth: (state, action: PayloadAction<number>) => {
      state.health = state.health + action.payload;
    },
    reduceHealth: (state, action: PayloadAction<number>) => {
      state.health = state.health - action.payload;
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
    addItem: (state, action: PayloadAction<Item>) => {
      const item = action.payload;
      const qty = item.quantity ?? 1;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity = (existing.quantity ?? 1) + qty;
      } else {
        state.items.push({ ...item, quantity: qty });
      }
    },
    addItems: (state, action: PayloadAction<Item[]>) => {
      action.payload.forEach((item) => {
        const qty = item.quantity ?? 1;
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity = (existing.quantity ?? 1) + qty;
        } else {
          state.items.push({ ...item, quantity: qty });
        }
      });
    },
    removeItem: (state, action: PayloadAction<Item>) => {
      const { id } = action.payload;
      const idx = state.items.findIndex((i) => i.id === id);
      if (idx < 0) return;
      const entry = state.items[idx];
      const qty = entry.quantity ?? 1;
      if (qty <= 1) {
        state.items.splice(idx, 1);
      } else {
        entry.quantity = qty - 1;
      }
    },
    addFishingXP: (state, action: PayloadAction<number>) => {
      state.fishingXP = state.fishingXP + action.payload;
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
    },
    breakthrough: (state) => {
      state.qi = 0;
      const next = getNextRealm(state.realm, state.realmLevel);
      if (next) {
        state.realm = next.realmId;
        state.realmLevel = next.realmLevel;
      }
    },
    setCurrentActivity: (state, action: PayloadAction<string>) => {
      state.currentActivity = action.payload;
      if (action.payload !== "fish") {
        state.currentFishingArea = null;
        state.fishingCastStartTime = null;
        state.fishingCastDuration = 0;
      }
      if (action.payload !== "mine") {
        state.currentMiningArea = null;
        state.miningCastStartTime = null;
        state.miningCastDuration = 0;
      }
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
      action: PayloadAction<{ startTime: number; duration: number }>
    ) => {
      state.fishingCastStartTime = action.payload.startTime;
      state.fishingCastDuration = action.payload.duration;
    },
    completeFishingCast: (
      state,
      action: PayloadAction<{ fishingXP: number; fishingLootIds: number[] }>
    ) => {
      state.fishingCastStartTime = null;
      state.fishingCastDuration = 0;
      if (state.currentActivity !== "fish" || !state.currentFishingArea) return;
      const { fishingXP, fishingLootIds } = action.payload;
      state.fishingXP += fishingXP;
      const randomId =
        fishingLootIds[Math.floor(Math.random() * fishingLootIds.length)];
      const fish = fishTypes.find((f) => f.id === randomId);
      if (fish) {
        const existing = state.items.find((i) => i.id === fish.id);
        if (existing) {
          existing.quantity = (existing.quantity ?? 1) + 1;
        } else {
          state.items.push({ ...fish, quantity: 1 });
        }
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
      action: PayloadAction<{ startTime: number; duration: number }>
    ) => {
      state.miningCastStartTime = action.payload.startTime;
      state.miningCastDuration = action.payload.duration;
    },
    completeMiningCast: (
      state,
      action: PayloadAction<{ miningXP: number; miningLootId: number }>
    ) => {
      state.miningCastStartTime = null;
      state.miningCastDuration = 0;
      if (state.currentActivity !== "mine" || !state.currentMiningArea) return;
      const { miningXP, miningLootId } = action.payload;
      state.miningXP += miningXP;
      const ore = oreTypes.find((o) => o.id === miningLootId);
      if (ore) {
        const existing = state.items.find((i) => i.id === ore.id);
        if (existing) {
          existing.quantity = (existing.quantity ?? 1) + 1;
        } else {
          state.items.push({ ...ore, quantity: 1 });
        }
      }
    },
    equipItem: (state, action: PayloadAction<{ slot: EquipmentSlot; item: Item }>) => {
      const { slot, item } = action.payload;
      const existing = state.equipment[slot];
      if (existing) {
        const existingInBag = state.items.find((i) => i.id === existing.id);
        if (existingInBag) {
          existingInBag.quantity = (existingInBag.quantity ?? 1) + 1;
        } else {
          state.items.push({ ...existing, quantity: 1 });
        }
      }
      state.equipment[slot] = item;
      const idx = state.items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const entry = state.items[idx];
        const qty = entry.quantity ?? 1;
        if (qty <= 1) {
          state.items.splice(idx, 1);
        } else {
          entry.quantity = qty - 1;
        }
      }
    },
    unequipItem: (state, action: PayloadAction<EquipmentSlot>) => {
      const item = state.equipment[action.payload];
      if (item) {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity = (existing.quantity ?? 1) + 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
        state.equipment[action.payload] = null;
      }
    },
    setPath: (state, action: PayloadAction<CultivationPath>) => {
      state.path = action.payload;
    },
    startExpedition: (
      state,
      action: PayloadAction<{ endTime: number; missionId: number }>
    ) => {
      state.expeditionEndTime = action.payload.endTime;
      state.expeditionMissionId = action.payload.missionId;
      state.currentActivity = "expedition";
    },
    clearExpedition: (state) => {
      state.expeditionEndTime = null;
      state.expeditionMissionId = null;
      if (state.currentActivity === "expedition") state.currentActivity = "none";
    },
    purchaseTalentLevel: (state, action: PayloadAction<number>) => {
      const node = TALENT_NODES_BY_ID[action.payload];
      if (!node) return;
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
  addItem,
  addItems,
  removeItem,
  addFishingXP,
  addQi,
  setQi,
  setRealm,
  breakthrough,
  setCurrentActivity,
  setCurrentFishingArea,
  setFishingCast,
  completeFishingCast,
  setCurrentMiningArea,
  setMiningCast,
  completeMiningCast,
  equipItem,
  unequipItem,
  setPath,
  startExpedition,
  clearExpedition,
  purchaseTalentLevel,
} = characterSlice.actions;

export default characterSlice.reducer;
