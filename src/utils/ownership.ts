/**
 * Ownership helpers for "has this item" checks (inventory + equipment).
 * Used by one-time drop logic and can be reused for loot tables and stores.
 */
import type { EquipmentSlot } from "../types/EquipmentSlot";
import { ALL_EQUIPMENT_SLOTS } from "../types/EquipmentSlot";
import type Item from "../interfaces/ItemI";

export interface CharacterItemsState {
  items: Item[];
  equipment: Record<EquipmentSlot, Item | null>;
}

/** Returns the set of item IDs the character has (inventory + any equipped). */
export function getOwnedItemIds(state: CharacterItemsState): Set<number> {
  const ids = new Set<number>();
  for (const item of state.items) {
    ids.add(item.id);
  }
  for (const slot of ALL_EQUIPMENT_SLOTS) {
    const item = state.equipment[slot];
    if (item?.id != null) ids.add(item.id);
  }
  return ids;
}
