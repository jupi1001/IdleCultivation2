/**
 * Discriminated domain item types (Task 2). Item is the full union; no legacy shape.
 */
import type { EquipmentSlot } from "./EquipmentSlot";

/** Common fields for all items. */
export interface BaseItemFields {
  id: number;
  name: string;
  description: string;
  quantity?: number;
  price: number;
  picture?: string;
}

/** Discriminant for the item union. */
export type ItemKind =
  | "consumable"
  | "equipment"
  | "technique"
  | "material"
  | "quest"
  | "setPiece";

/** Consumable effect: typed by effect rather than string. */
export type ConsumableEffect =
  | { type: "healVitality"; amount: number }
  | { type: "grantQi"; amount: number }
  | { type: "grantAttack"; amount: number }
  | { type: "grantDefense"; amount: number }
  | { type: "grantVitality"; amount: number };

/** Consumable: food, pills, etc. */
export interface ConsumableItem extends BaseItemFields {
  kind: "consumable";
  effect: ConsumableEffect;
}

/** Equipment (weapon, armor, ring, amulet). */
export interface EquipmentItem extends BaseItemFields {
  kind: "equipment";
  equipmentSlot: Exclude<EquipmentSlot, "qiTechnique" | "combatTechnique">;
  attackBonus?: number;
  defenseBonus?: number;
  vitalityBonus?: number;
  qiGainBonus?: number;
  attackMultiplier?: number;
  attackSpeedReduction?: number;
}

/** Qi or combat technique. */
export interface TechniqueItem extends BaseItemFields {
  kind: "technique";
  equipmentSlot: "qiTechnique" | "combatTechnique";
  qiGainBonus?: number;
  attackMultiplier?: number;
  attackSpeedReduction?: number;
}

/** Set piece: skill set bonus. */
export interface SetPieceItem extends BaseItemFields {
  kind: "setPiece";
  equipmentSlot: EquipmentSlot;
  skillSet: "fishing" | "mining" | "gathering" | "alchemy" | "forging" | "cooking";
  skillSetTier: "lesser" | "greater" | "perfected";
  skillSpeedBonus?: number;
  skillXpBonus?: number;
}

/** Quest item. */
export interface QuestItem extends BaseItemFields {
  kind: "quest";
}

/** Stackable material (ore, wood, herbs, fish). */
export interface MaterialItem extends BaseItemFields {
  kind: "material";
}

/** Discriminated union. Use type guards and getConsumableEffect for narrowing. */
export type Item =
  | ConsumableItem
  | EquipmentItem
  | TechniqueItem
  | SetPieceItem
  | QuestItem
  | MaterialItem;

/** Alias for clarity where domain vs legacy might be referenced. */
export type DomainItem = Item;

export function getConsumableEffect(item: Item): ConsumableEffect | null {
  if (item.kind === "consumable") return item.effect;
  return null;
}

export function hasConsumableEffect(item: Item): boolean {
  return item.kind === "consumable";
}
