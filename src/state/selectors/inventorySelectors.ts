import { createSelector } from "@reduxjs/toolkit";
import { ITEMS_BY_ID } from "../../constants/data";
import type Item from "../../interfaces/ItemI";
import type { RootState } from "../store";

/** Raw normalized inventory (itemId → quantity). Prefer selectItems for UI. */
export const selectItemsById = (state: RootState) => state.inventory.itemsById;

/** Resolved inventory as Item[] from itemsById + ITEMS_BY_ID. Use for components that expect item list. */
export const selectItems = createSelector([selectItemsById], (itemsById) => {
  const result: Item[] = [];
  for (const idStr of Object.keys(itemsById)) {
    const id = Number(idStr);
    const def = ITEMS_BY_ID[id];
    const qty = itemsById[id] ?? 1;
    if (def) result.push({ ...def, quantity: qty });
  }
  return result;
});

