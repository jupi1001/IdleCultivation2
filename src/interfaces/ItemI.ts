/**
 * Item type. Discriminated union; re-exports from types/items.
 */
export type {
  Item,
  ItemKind,
  DomainItem,
  ConsumableEffect,
  ConsumableItem,
  EquipmentItem,
  TechniqueItem,
  SetPieceItem,
  QuestItem,
  MaterialItem,
  BaseItemFields,
} from "../types/items";
export { getConsumableEffect, hasConsumableEffect } from "../types/items";
export { getEquipmentSlot, hasEquipmentSlot } from "../types/itemGuards";

import type { Item } from "../types/items";
export type { Item as default };
