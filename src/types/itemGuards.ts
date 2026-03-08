/**
 * Discriminated item kinds and type guards for type-safe narrowing.
 * Use with optional `kind` on Item for gradual migration.
 */
import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "./EquipmentSlot";

/** Type guard: item has effect (consumable). Works with or without kind. */
export function isConsumableItem(item: Item): item is Item & { effect: string } {
  return (item as Item & { kind?: string }).kind === "consumable" || (item as Item).effect != null;
}

/** Type guard: item has equipmentSlot (equipment). Works with or without kind. */
export function isEquipmentItem(item: Item): item is Item & { equipmentSlot: EquipmentSlot } {
  return (item as Item & { kind?: string }).kind === "equipment" || (item as Item).equipmentSlot != null;
}

/** Type guard: item is qi or combat technique. */
export function isTechniqueItem(
  item: Item
): item is Item & { equipmentSlot: "qiTechnique" | "combatTechnique" } {
  if ((item as Item & { kind?: string }).kind === "technique") return true;
  const slot = (item as Item).equipmentSlot;
  return slot === "qiTechnique" || slot === "combatTechnique";
}

/** Type guard: item is a set piece (has skillSet and skillSetTier). */
export function isSetPieceItem(
  item: Item
): item is Item & { skillSet: string; skillSetTier: string } {
  return (
    (item as Item & { kind?: string }).kind === "setPiece" ||
    ((item as Item).skillSet != null && (item as Item).skillSetTier != null)
  );
}
