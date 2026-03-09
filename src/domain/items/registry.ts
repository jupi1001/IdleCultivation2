/**
 * Build a single Record<itemId, Item> from multiple item arrays.
 * Used by the thin data layer to build ITEMS_BY_ID including sect store items.
 */
import type Item from "../../interfaces/ItemI";

export function buildItemsById(arrays: Item[][]): Record<number, Item> {
  const map: Record<number, Item> = {};
  for (const arr of arrays) {
    for (const item of arr) {
      map[item.id] = item;
    }
  }
  return map as Record<number, Item>;
}
