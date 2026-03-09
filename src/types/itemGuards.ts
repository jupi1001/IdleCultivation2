/**
 * Type guards for discriminated Item union.
 */
import type { Item } from "../types/items";
import type { ConsumableItem, EquipmentItem, TechniqueItem, SetPieceItem } from "../types/items";
import type { EquipmentSlot } from "./EquipmentSlot";

export function isConsumableItem(item: Item): item is ConsumableItem {
  return item.kind === "consumable";
}

export function isEquipmentItem(item: Item): item is EquipmentItem | SetPieceItem {
  return item.kind === "equipment" || item.kind === "setPiece";
}

export function isTechniqueItem(item: Item): item is TechniqueItem {
  return item.kind === "technique";
}

export function isSetPieceItem(item: Item): item is SetPieceItem {
  return item.kind === "setPiece";
}

/** Narrow to item that has equipmentSlot (equipment, technique, or setPiece). */
export function hasEquipmentSlot(
  item: Item
): item is Item & { equipmentSlot: EquipmentSlot } {
  return "equipmentSlot" in item && item.equipmentSlot != null;
}

/** Get equipment slot if item has one. */
export function getEquipmentSlot(item: Item): EquipmentSlot | undefined {
  return hasEquipmentSlot(item) ? item.equipmentSlot : undefined;
}
