import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Item from "../../interfaces/ItemI";

interface CharacterState {
  name: string;
  attack: number;
  defense: number;
  money: number;
  miner: number;
  items: Item[];
}

const initialState: CharacterState = {
  name: "No Name",
  attack: 0,
  defense: 0,
  money: 500,
  miner: 0,
  items: [],
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
    removeItem: (state, action: PayloadAction<Item>) => {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
  },
});

export const {
  addAttack,
  reduceAttack,
  addDefense,
  reduceDefense,
  addMoney,
  reduceMoney,
  addMiner,
  addItem,
  removeItem,
} = characterSlice.actions;

export default characterSlice.reducer;
