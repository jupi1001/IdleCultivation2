/**
 * Ownership helpers for "has this item" checks (inventory + equipment).
 * Used by one-time drop logic and can be reused for loot tables and stores.
 */
import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";
import { ALL_EQUIPMENT_SLOTS } from "../types/EquipmentSlot";

export interface CharacterItemsState {
  itemsById: Record<number, number>;
  equipment: Record<EquipmentSlot, Item | null>;
}

/** Returns the set of item IDs the character has (inventory + any equipped). */
export function getOwnedItemIds(state: CharacterItemsState): Set<number> {
  const ids = new Set<number>();
  for (const idStr of Object.keys(state.itemsById)) {
    if ((state.itemsById[Number(idStr)] ?? 0) > 0) ids.add(Number(idStr));
  }
  for (const slot of ALL_EQUIPMENT_SLOTS) {
    const item = state.equipment[slot];
    if (item?.id != null) ids.add(item.id);
  }
  return ids;
}
