import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Item from "../../interfaces/ItemI";

interface CharacterState {
  name: string;
  attack: number;
  defense: number;
  money: number;
  items: Item[];
}

const initialState: CharacterState = {
  name: "No Name",
  attack: 0,
  defense: 0,
  money: 0,
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
    addItem: (state, action: PayloadAction<Item>) => {
      if (state.items[action.payload.id] === null) {
        state.items[action.payload.id] = action.payload;
      } else {
        state.items[action.payload.id].quantity = state.items[action.payload.id].quantity + action.payload.quantity;
      }
    },
  },
});

export const { addAttack, reduceAttack, addDefense, reduceDefense, addMoney, reduceMoney, addItem } =
  characterSlice.actions;

export default characterSlice.reducer;
