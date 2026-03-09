import { z } from "zod";

/**
 * Zod schemas for persisted root state (redux-persist payload).
 * This is intentionally shallow: it asserts required top-level slices exist,
 * without constraining their internal structure yet.
 */

export const persistedRootSchema = z
  .object({
    character: z.any(),
    avatars: z.any(),
    combat: z.any(),
    settings: z.any(),
    stats: z.any(),
    reincarnation: z.any(),
    sect: z.any(),
    inventory: z.any(),
    equipment: z.any(),
    skills: z.any(),
    content: z.any(),
    toast: z.any(),
    achievements: z.any(),
    log: z.any(),
  })
  .passthrough();

export type PersistedRootStateFromSchema = z.infer<typeof persistedRootSchema>;

/** Validate a persisted root state object (e.g. redux-persist payload after migrations). */
export function parsePersistedRootState(input: unknown): PersistedRootStateFromSchema {
  return persistedRootSchema.parse(input);
}

