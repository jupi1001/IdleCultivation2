import { z } from "zod";
import { REALM_ORDER } from "../constants/realmProgression";

/**
 * Zod schemas for talents, effects, and tree tiers.
 * Mirrors src/interfaces/TalentI.ts and src/constants/talents.ts.
 */

export const realmIdSchema = z.enum(REALM_ORDER);

export const realmRequirementSchema = z.object({
  realmId: realmIdSchema,
  realmLevel: z.number().int().nonnegative(),
});

export const talentEffectTypeSchema = z.enum([
  "attack",
  "defense",
  "vitality",
  "qiGain",
  "fishingXP",
  "fishingSpeedPercent",
  "miningYieldPercent",
  "gatheringSpeedPercent",
  "alchemySuccessPercent",
  "forgingSpeedPercent",
  "cookingSpeedPercent",
  "critChancePercent",
  "lifestealPercent",
  "damageReflectPercent",
  "aoeChancePercent",
  "spiritStoneIncomePercent",
  "shopDiscountPercent",
]);

export const talentEffectSchema = z.object({
  type: talentEffectTypeSchema,
  value: z.number(),
});

export const talentNodeSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1),
  description: z.string(),
  costQi: z.number().nonnegative(),
  maxLevel: z.number().int().positive(),
  requiredRealm: realmRequirementSchema.optional(),
  requiredTalentIds: z.array(z.number().int().nonnegative()).optional(),
  path: z.string().optional(),
  effect: talentEffectSchema,
});

export const talentTreeTierSchema = z.object({
  realmGate: realmRequirementSchema.optional(),
  nodes: z.array(talentNodeSchema),
});

export const talentTreeTiersArraySchema = z.array(talentTreeTierSchema);

export type TalentNodeFromSchema = z.infer<typeof talentNodeSchema>;
export type TalentTreeTierFromSchema = z.infer<typeof talentTreeTierSchema>;

export function parseTalentTiers(input: unknown): TalentTreeTierFromSchema[] {
  return talentTreeTiersArraySchema.parse(input);
}

