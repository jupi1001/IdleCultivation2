/**
 * Per-slice persistence migrations.
 *
 * MIGRATION OWNERSHIP:
 * - character: state/reducers/characterCoreSlice — defaults, inventory shape (items → itemsById).
 * - settings: state/reducers/settingsSlice — defaults.
 * - reincarnation: state/reducers/reincarnationSlice — defaults.
 * - content: state/reducers/contentSlice — legacy page string → route object.
 * - achievements: no migrations yet (slice is already normalized).
 * - global: store — one-time cross-slice moves (extract settings/reincarnation from character).
 *
 * When adding a new slice (Task 1), add an entry to SLICE_MIGRATIONS and document above.
 */

import { characterMigrations } from "./characterMigrations";
import { contentMigrations } from "./contentMigrations";
import { globalMigrations } from "./globalMigrations";
import { reincarnationMigrations } from "./reincarnationMigrations";
import { settingsMigrations } from "./settingsMigrations";
import type { SliceKey, SliceMigrationMap } from "./types";
import { parsePersistedRootState } from "../../schemas/saveState";

/** Per-slice migration maps. Each slice runs its migrators in order; migrators must be idempotent. */
export const SLICE_MIGRATIONS: Partial<Record<SliceKey, SliceMigrationMap>> = {
  character: characterMigrations,
  settings: settingsMigrations,
  reincarnation: reincarnationMigrations,
  content: contentMigrations,
};

export { globalMigrations };

/**
 * Run all per-slice migrations, then global migrations.
 * Called from redux-persist migrate callback.
 */
export function runMigrations(state: unknown): unknown {
  if (!state || typeof state !== "object") return state;
  const s = state as Record<string, unknown>;

  for (const key of Object.keys(SLICE_MIGRATIONS) as SliceKey[]) {
    const migrators = SLICE_MIGRATIONS[key];
    if (!migrators || !(key in s)) continue;
    let sliceState = s[key];
    for (const migrate of migrators) {
      sliceState = migrate(sliceState);
    }
    s[key] = sliceState;
  }

  for (const migrate of globalMigrations) {
    migrate(s);
  }

  // Dev/test-only: assert that migrated state still matches persisted root schema.
  if (process.env.NODE_ENV !== "production") {
    parsePersistedRootState(s);
  }

  return state;
}

export type { SliceMigrator, SliceMigrationMap, SliceKey } from "./types";
