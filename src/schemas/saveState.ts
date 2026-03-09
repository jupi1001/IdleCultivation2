import { z } from "zod";

/**
 * Zod schemas for persisted root state (redux-persist payload).
 * This is intentionally shallow: it asserts required top-level slices exist,
 * without constraining their internal structure yet.
 */

export const persistedRootSchema = z
  .object({
    character: z.unknown(),
    avatars: z.unknown(),
    combat: z.unknown(),
    settings: z.unknown(),
    stats: z.unknown(),
    reincarnation: z.unknown(),
    sect: z.unknown(),
    inventory: z.unknown(),
    equipment: z.unknown(),
    skills: z.unknown(),
    content: z.unknown(),
    toast: z.unknown(),
    achievements: z.unknown(),
    log: z.unknown(),
  })
  .passthrough();

export type PersistedRootStateFromSchema = z.infer<typeof persistedRootSchema>;

/** Validate a persisted root state object (e.g. redux-persist payload after migrations). */
export function parsePersistedRootState(input: unknown): PersistedRootStateFromSchema {
  return persistedRootSchema.parse(input);
}

