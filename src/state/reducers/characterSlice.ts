import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CultivationPath } from "../../constants/cultivationPath";
import { fishTypes, gatheringLootTypes, oreTypes, SECT_POSITIONS } from "../../constants/data";
import { getBreakthroughQiRequired, getNextRealm, getStepIndex, getCombatStatsFromRealm, type RealmId } from "../../constants/realmProgression";
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

export type CurrentGatheringArea = {
  areaId: number;
  gatheringXP: number;
  gatheringDelay: number;
  gatheringLootIds: number[];
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
  /** Male or Female; chosen at game start. Affects character portrait (default vs lotus in meditation). */
  gender: "Male" | "Female" | null;
  /** Sect id the character has joined; null if none. Only one sect at a time. */
  currentSectId: number | null;
  /** Rank index inside the sect: 0 = Sect Aspirant, 1 = Outer, 2 = Inner, 3 = Core. Affects sect store availability. */
  sectRankIndex: number;
  /** When set, promotion is in progress; at this timestamp it completes. */
  promotionEndTime: number | null;
  /** Rank index we're promoting to (while promotion in progress). */
  promotionToRankIndex: number | null;
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
  gatheringXP: number;
  currentGatheringArea: CurrentGatheringArea | null;
  gatheringCastStartTime: number | null;
  gatheringCastDuration: number;
  /** XP for alchemy; backloaded curve, level from total XP; affects pill craft success chance */
  alchemyXP: number;
  /** XP for forging; backloaded curve, level from total XP */
  forgingXP: number;
  /** XP for cooking; backloaded curve, level from total XP */
  cookingXP: number;
  /** Permanent bonus to attack from consumables/shop (effective = realm + equipment + this) */
  bonusAttack: number;
  /** Permanent bonus to defense from consumables/shop */
  bonusDefense: number;
  /** Permanent bonus to max vitality/health from consumables/shop */
  bonusHealth: number;
  /** Current vitality (HP); persists between combats. Capped by effective max (realm + equipment + bonus). */
  currentHealth: number;
}

const initialEquipment = ALL_EQUIPMENT_SLOTS.reduce(
  (acc, slot) => ({ ...acc, [slot]: null }),
  {} as Record<EquipmentSlot, Item | null>
);

const initialCombatStats = getCombatStatsFromRealm("Mortal", 0);

const initialState: CharacterState = {
  name: "Mortal",
  attack: initialCombatStats.attack,
  defense: initialCombatStats.defense,
  health: initialCombatStats.health,
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
  gender: null,
  currentSectId: null,
  sectRankIndex: 0,
  promotionEndTime: null,
  promotionToRankIndex: null,
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
  gatheringXP: 0,
  currentGatheringArea: null,
  gatheringCastStartTime: null,
  gatheringCastDuration: 0,
  alchemyXP: 0,
  forgingXP: 0,
  cookingXP: 0,
  bonusAttack: 0,
  bonusDefense: 0,
  bonusHealth: 0,
  currentHealth: initialCombatStats.health,
};

export const characterSlice = createSlice({
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
    /** Consume multiple items by id and amount. Caller must ensure sufficient quantity. */
    consumeItems: (state, action: PayloadAction<{ itemId: number; amount: number }[]>) => {
      action.payload.forEach(({ itemId, amount }) => {
        const idx = state.items.findIndex((i) => i.id === itemId);
        if (idx < 0) return;
        const entry = state.items[idx];
        const qty = entry.quantity ?? 1;
        if (qty <= amount) {
          state.items.splice(idx, 1);
        } else {
          entry.quantity = qty - amount;
        }
      });
    },
    addAlchemyXP: (state, action: PayloadAction<number>) => {
      state.alchemyXP = state.alchemyXP + action.payload;
    },
    addForgingXP: (state, action: PayloadAction<number>) => {
      state.forgingXP = state.forgingXP + action.payload;
    },
    addCookingXP: (state, action: PayloadAction<number>) => {
      state.cookingXP = state.cookingXP + action.payload;
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
      const stats = getCombatStatsFromRealm(action.payload.realm, action.payload.realmLevel);
      state.attack = stats.attack;
      state.defense = stats.defense;
      state.health = stats.health;
      state.currentHealth = stats.health;
    },
    breakthrough: (state) => {
      const next = getNextRealm(state.realm, state.realmLevel);
      if (next) {
        const requiredQi = getBreakthroughQiRequired(state.realm, state.realmLevel);
        state.qi = Math.max(0, Math.round((state.qi - requiredQi) * 100) / 100);
        state.realm = next.realmId;
        state.realmLevel = next.realmLevel;
        const stats = getCombatStatsFromRealm(next.realmId, next.realmLevel);
        state.attack = stats.attack;
        state.defense = stats.defense;
        state.health = stats.health;
        state.currentHealth = stats.health;
      }
    },
    setCurrentHealth: (state, action: PayloadAction<number>) => {
      state.currentHealth = Math.max(0, action.payload);
    },
    regenerateVitality: (state, action: PayloadAction<{ amount: number; maxHealth: number }>) => {
      const { amount, maxHealth } = action.payload;
      state.currentHealth = Math.min(maxHealth, state.currentHealth + amount);
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
      if (action.payload !== "gather") {
        state.currentGatheringArea = null;
        state.gatheringCastStartTime = null;
        state.gatheringCastDuration = 0;
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
    setCurrentGatheringArea: (state, action: PayloadAction<CurrentGatheringArea | null>) => {
      state.currentGatheringArea = action.payload;
      if (!action.payload) {
        state.gatheringCastStartTime = null;
        state.gatheringCastDuration = 0;
      }
    },
    setGatheringCast: (
      state,
      action: PayloadAction<{ startTime: number; duration: number }>
    ) => {
      state.gatheringCastStartTime = action.payload.startTime;
      state.gatheringCastDuration = action.payload.duration;
    },
    completeGatheringCast: (
      state,
      action: PayloadAction<{ gatheringXP: number; gatheringLootIds: number[] }>
    ) => {
      state.gatheringCastStartTime = null;
      state.gatheringCastDuration = 0;
      if (state.currentActivity !== "gather" || !state.currentGatheringArea) return;
      const { gatheringXP, gatheringLootIds } = action.payload;
      state.gatheringXP += gatheringXP;
      const randomId =
        gatheringLootIds[Math.floor(Math.random() * gatheringLootIds.length)];
      const loot = gatheringLootTypes.find((l) => l.id === randomId);
      if (loot) {
        const existing = state.items.find((i) => i.id === loot.id);
        if (existing) {
          existing.quantity = (existing.quantity ?? 1) + 1;
        } else {
          state.items.push({ ...loot, quantity: 1 });
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
    setGender: (state, action: PayloadAction<"Male" | "Female">) => {
      state.gender = action.payload;
    },
    setSect: (state, action: PayloadAction<number | null>) => {
      state.currentSectId = action.payload;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
      if (action.payload == null) {
        state.sectRankIndex = 0;
        return;
      }
      const step = getStepIndex(state.realm, state.realmLevel);
      let rank = 0;
      for (let i = 0; i < SECT_POSITIONS.length; i++) {
        if (step >= SECT_POSITIONS[i].requiredStepIndex) rank = i;
      }
      state.sectRankIndex = rank;
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
    completePromotion: (state) => {
      if (state.promotionEndTime == null || state.promotionToRankIndex == null) return;
      if (Date.now() < state.promotionEndTime) return;
      const step = getStepIndex(state.realm, state.realmLevel);
      const required = SECT_POSITIONS[state.promotionToRankIndex].requiredStepIndex;
      if (step >= required) state.sectRankIndex = state.promotionToRankIndex;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
    },
    cancelPromotion: (state) => {
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
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
  consumeItems,
  addAlchemyXP,
  addForgingXP,
  addCookingXP,
  addFishingXP,
  addQi,
  setQi,
  setRealm,
  breakthrough,
  setCurrentHealth,
  regenerateVitality,
  setCurrentActivity,
  setCurrentFishingArea,
  setFishingCast,
  completeFishingCast,
  setCurrentMiningArea,
  setMiningCast,
  completeMiningCast,
  setCurrentGatheringArea,
  setGatheringCast,
  completeGatheringCast,
  equipItem,
  unequipItem,
  setPath,
  setGender,
  setSect,
  setSectRank,
  startPromotion,
  completePromotion,
  cancelPromotion,
  startExpedition,
  clearExpedition,
  purchaseTalentLevel,
} = characterSlice.actions;

export default characterSlice.reducer;
