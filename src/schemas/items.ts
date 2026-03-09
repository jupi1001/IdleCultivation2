import { z } from "zod";

/**
 * Zod schemas for domain items (Task 13).
 * Mirrors the discriminated union in src/types/items.ts for runtime validation.
 */

export const itemKindSchema = z.enum([
  "consumable",
  "equipment",
  "technique",
  "material",
  "quest",
  "setPiece",
]);

export const baseItemFieldsSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1),
  description: z.string(),
  quantity: z.number().int().nonnegative().optional(),
  price: z.number().int().nonnegative(),
  picture: z.string().min(1).optional(),
});

export const consumableEffectSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("healVitality"), amount: z.number() }),
  z.object({ type: z.literal("grantQi"), amount: z.number() }),
  z.object({ type: z.literal("grantAttack"), amount: z.number() }),
  z.object({ type: z.literal("grantDefense"), amount: z.number() }),
  z.object({ type: z.literal("grantVitality"), amount: z.number() }),
]);

export const consumableItemSchema = baseItemFieldsSchema.extend({
  kind: z.literal("consumable"),
  effect: consumableEffectSchema,
});

// EquipmentSlot enum is string-based; mirror values here for runtime checks.
export const equipmentSlotSchema = z.enum([
  "sword",
  "helmet",
  "body",
  "shoes",
  "legs",
  "ring",
  "amulet",
  "qiTechnique",
  "combatTechnique",
]);

export const equipmentItemSchema = baseItemFieldsSchema.extend({
  kind: z.literal("equipment"),
  equipmentSlot: equipmentSlotSchema.refine(
    (value) => value !== "qiTechnique" && value !== "combatTechnique",
    { message: "equipment items cannot use technique slots" }
  ),
  attackBonus: z.number().optional(),
  defenseBonus: z.number().optional(),
  vitalityBonus: z.number().optional(),
  qiGainBonus: z.number().optional(),
  attackMultiplier: z.number().optional(),
  attackSpeedReduction: z.number().optional(),
});

export const techniqueItemSchema = baseItemFieldsSchema.extend({
  kind: z.literal("technique"),
  equipmentSlot: z.enum(["qiTechnique", "combatTechnique"]),
  qiGainBonus: z.number().optional(),
  attackMultiplier: z.number().optional(),
  attackSpeedReduction: z.number().optional(),
});

export const setPieceItemSchema = baseItemFieldsSchema.extend({
  kind: z.literal("setPiece"),
  equipmentSlot: equipmentSlotSchema,
  skillSet: z.enum(["fishing", "mining", "gathering", "alchemy", "forging", "cooking"]),
  skillSetTier: z.enum(["lesser", "greater", "perfected"]),
  skillSpeedBonus: z.number().optional(),
  skillXpBonus: z.number().optional(),
});

export const questItemSchema = baseItemFieldsSchema.extend({
  kind: z.literal("quest"),
});

export const materialItemSchema = baseItemFieldsSchema.extend({
  kind: z.literal("material"),
});

export const itemSchema = z.discriminatedUnion("kind", [
  consumableItemSchema,
  equipmentItemSchema,
  techniqueItemSchema,
  setPieceItemSchema,
  questItemSchema,
  materialItemSchema,
]);

export const itemsArraySchema = z.array(itemSchema);

export type ItemSchema = typeof itemSchema;
export type ItemFromSchema = z.infer<typeof itemSchema>;

/** Validate a single item definition. Throws ZodError on invalid input. */
export function parseItem(input: unknown): ItemFromSchema {
  return itemSchema.parse(input);
}

/** Validate an array of item definitions. Throws ZodError on invalid input. */
export function parseItems(input: unknown): ItemFromSchema[] {
  return itemsArraySchema.parse(input);
}

