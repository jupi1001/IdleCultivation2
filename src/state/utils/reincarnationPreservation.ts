/**
 * Reincarnation: which items are preserved (unique/legendary). Used by reincarnate thunk
 * to compute preservedItemsById from inventory + equipment.
 */
import { ITEMS_BY_ID } from "../../constants/data";
import { getEquipmentSlot } from "../../interfaces/ItemI";
import type Item from "../../interfaces/ItemI";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { ALL_EQUIPMENT_SLOTS } from "../../types/EquipmentSlot";

export function isReincarnationPreservedItem(item: Item): boolean {
  const slot = getEquipmentSlot(item);
  return (
    slot === "qiTechnique" ||
    slot === "combatTechnique" ||
    slot === "ring" ||
    slot === "amulet" ||
    ("skillSet" in item && item.skillSet != null) ||
    (item.id >= 981 && item.id <= 986)
  );
}

export function getPreservedItemsById(
  itemsById: Record<number, number>,
  equipment: Record<EquipmentSlot, Item | null>
): Record<number, number> {
  const preserved: Record<number, number> = {};
  const seenIds = new Set<number>();
  for (const itemId of Object.keys(itemsById).map(Number)) {
    const item = ITEMS_BY_ID[itemId];
    if (item && isReincarnationPreservedItem(item) && !seenIds.has(itemId)) {
      preserved[itemId] = 1;
      seenIds.add(itemId);
    }
  }
  for (const slot of ALL_EQUIPMENT_SLOTS) {
    const eq = equipment[slot];
    if (eq && isReincarnationPreservedItem(eq) && !seenIds.has(eq.id)) {
      preserved[eq.id] = 1;
      seenIds.add(eq.id);
    }
  }
  return preserved;
}
