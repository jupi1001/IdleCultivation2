import { z } from "zod";

/**
 * Zod schemas for activity areas (fishing, mining, gathering).
 * Mirrors BaseArea, TimedActivityArea, FishingAreaI, MiningAreaI, GatheringAreaI.
 */

export const baseAreaSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1),
  picture: z.string().min(1),
  altText: z.string(),
  requiresReincarnation: z.boolean().optional(),
});

export const timedActivityAreaSchema = baseAreaSchema.extend({
  xp: z.number().nonnegative(),
  xpUnlock: z.number().nonnegative(),
  delay: z.number().nonnegative(),
});

export const fishingAreaSchema = timedActivityAreaSchema.extend({
  fishingLootIds: z.array(z.number().int().nonnegative()),
  rareDropChancePercent: z.number().min(0).max(100).optional(),
  rareDropItemIds: z.array(z.number().int().nonnegative()).optional(),
});

export const miningAreaSchema = timedActivityAreaSchema.extend({
  miningLootId: z.number().int().nonnegative(),
});

export const gatheringAreaSchema = timedActivityAreaSchema.extend({
  gatheringLootIds: z.array(z.number().int().nonnegative()),
  rareDropChancePercent: z.number().min(0).max(100).optional(),
  rareDropItemIds: z.array(z.number().int().nonnegative()).optional(),
});

export const fishingAreasArraySchema = z.array(fishingAreaSchema);
export const miningAreasArraySchema = z.array(miningAreaSchema);
export const gatheringAreasArraySchema = z.array(gatheringAreaSchema);

export type FishingAreaFromSchema = z.infer<typeof fishingAreaSchema>;
export type MiningAreaFromSchema = z.infer<typeof miningAreaSchema>;
export type GatheringAreaFromSchema = z.infer<typeof gatheringAreaSchema>;

export function parseFishingAreas(input: unknown): FishingAreaFromSchema[] {
  return fishingAreasArraySchema.parse(input);
}

export function parseMiningAreas(input: unknown): MiningAreaFromSchema[] {
  return miningAreasArraySchema.parse(input);
}

export function parseGatheringAreas(input: unknown): GatheringAreaFromSchema[] {
  return gatheringAreasArraySchema.parse(input);
}

