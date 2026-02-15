import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CultivationPath } from "../../constants/cultivationPath";
import { getNextRealm, type RealmId } from "../../constants/realmProgression";
import Item from "../../interfaces/ItemI";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { ALL_EQUIPMENT_SLOTS } from "../../types/EquipmentSlot";

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
      state.items.push(action.payload);
    },
    addItems: (state, action: PayloadAction<Item[]>) => {
      action.payload.map((item, index) => state.items.push(item));
    },
    removeItem: (state, action: PayloadAction<Item>) => {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
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
    },
    equipItem: (state, action: PayloadAction<{ slot: EquipmentSlot; item: Item }>) => {
      const { slot, item } = action.payload;
      const existing = state.equipment[slot];
      if (existing) {
        state.items.push(existing);
      }
      state.equipment[slot] = item;
      const idx = state.items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      }
    },
    unequipItem: (state, action: PayloadAction<EquipmentSlot>) => {
      const item = state.equipment[action.payload];
      if (item) {
        state.items.push(item);
        state.equipment[action.payload] = null;
      }
    },
    setPath: (state, action: PayloadAction<CultivationPath>) => {
      state.path = action.payload;
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
  equipItem,
  unequipItem,
  setPath,
} = characterSlice.actions;

export default characterSlice.reducer;
