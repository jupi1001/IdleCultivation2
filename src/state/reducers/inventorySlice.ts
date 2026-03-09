/**
 * Inventory slice: normalized itemsById (itemId → quantity). Resolve definitions from ITEMS_BY_ID at read time.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GEODE_ITEM_ID, rollGemFromGeode } from "../../constants/gems";
import Item from "../../interfaces/ItemI";

export interface InventoryState {
  /** itemId → quantity */
  itemsById: Record<number, number>;
}

function addQuantityById(itemsById: Record<number, number>, itemId: number, qty: number): void {
  const prev = itemsById[itemId] ?? 0;
  const next = prev + qty;
  if (next <= 0) {
    delete itemsById[itemId];
  } else {
    itemsById[itemId] = next;
  }
}

function getQuantity(itemsById: Record<number, number>, itemId: number): number {
  return itemsById[itemId] ?? 0;
}

const initialState: InventoryState = {
  itemsById: {},
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      addQuantityById(state.itemsById, action.payload.id, action.payload.quantity ?? 1);
    },
    addItems: (state, action: PayloadAction<Item[]>) => {
      action.payload.forEach((item) => addQuantityById(state.itemsById, item.id, item.quantity ?? 1));
    },
    addItemById: (state, action: PayloadAction<{ itemId: number; amount?: number }>) => {
      const { itemId, amount = 1 } = action.payload;
      addQuantityById(state.itemsById, itemId, amount);
    },
    addItemsById: (state, action: PayloadAction<{ itemId: number; amount: number }[]>) => {
      action.payload.forEach(({ itemId, amount }) => addQuantityById(state.itemsById, itemId, amount));
    },
    removeItem: (state, action: PayloadAction<Item>) => {
      const { id } = action.payload;
      const qty = getQuantity(state.itemsById, id);
      if (qty <= 1) {
        delete state.itemsById[id];
      } else {
        state.itemsById[id] = qty - 1;
      }
    },
    consumeItems: (state, action: PayloadAction<{ itemId: number; amount: number }[]>) => {
      action.payload.forEach(({ itemId, amount }) => {
        const qty = getQuantity(state.itemsById, itemId);
        if (qty <= amount) {
          delete state.itemsById[itemId];
        } else {
          state.itemsById[itemId] = qty - amount;
        }
      });
    },
    openGeodes: (state, action: PayloadAction<number>) => {
      const amount = Math.max(0, Math.floor(action.payload));
      if (amount <= 0) return;
      const have = getQuantity(state.itemsById, GEODE_ITEM_ID);
      const toOpen = Math.min(amount, have);
      if (toOpen <= 0) return;
      addQuantityById(state.itemsById, GEODE_ITEM_ID, -toOpen);
      for (let i = 0; i < toOpen; i++) {
        const gem = rollGemFromGeode();
        addQuantityById(state.itemsById, gem.id, 1);
      }
    },
    /** Used by reincarnation flow: replace entire inventory with preserved items. */
    setItemsAfterReincarnation: (state, action: PayloadAction<Record<number, number>>) => {
      state.itemsById = { ...action.payload };
    },
  },
});

export const {
  addItem,
  addItems,
  addItemById,
  addItemsById,
  removeItem,
  consumeItems,
  openGeodes,
  setItemsAfterReincarnation,
} = inventorySlice.actions;

export default inventorySlice.reducer;
