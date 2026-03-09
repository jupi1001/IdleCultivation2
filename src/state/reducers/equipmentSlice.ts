/**
 * Equipment slice: equipped items per slot. Caller must update inventory when equipping/unequipping.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type Item from "../../interfaces/ItemI";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { ALL_EQUIPMENT_SLOTS } from "../../types/EquipmentSlot";
import { reincarnationSlice } from "./reincarnationSlice";

export interface EquipmentState {
  equipment: Record<EquipmentSlot, Item | null>;
}

const initialEquipment = ALL_EQUIPMENT_SLOTS.reduce(
  (acc, slot) => ({ ...acc, [slot]: null }),
  {} as Record<EquipmentSlot, Item | null>
);

const initialState: EquipmentState = {
  equipment: initialEquipment,
};

export const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {
    /** Caller must dispatch consumeItems for the item and addItemById for any current slot item. */
    equipItem: (state, action: PayloadAction<{ slot: EquipmentSlot; item: Item }>) => {
      const { slot, item } = action.payload;
      state.equipment[slot] = item;
    },
    /** Caller must dispatch addItemById for the unequipped item. */
    unequipItem: (state, action: PayloadAction<EquipmentSlot>) => {
      state.equipment[action.payload] = null;
    },
    resetEquipment: (state) => {
      state.equipment = ALL_EQUIPMENT_SLOTS.reduce(
        (acc, slot) => ({ ...acc, [slot]: null }),
        {} as Record<EquipmentSlot, Item | null>
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reincarnationSlice.actions.reincarnate, (state) => {
      state.equipment = ALL_EQUIPMENT_SLOTS.reduce(
        (acc, slot) => ({ ...acc, [slot]: null }),
        {} as Record<EquipmentSlot, Item | null>
      );
    });
  },
});

export const { equipItem, unequipItem, resetEquipment } = equipmentSlice.actions;

export default equipmentSlice.reducer;
