/**
 * Per-slice persistence migrations.
 *
 * SliceMigrator: (sliceState: unknown) => unknown
 * SliceMigrationMap: ordered list of migrators (run in order; each idempotent).
 */

/** Migrates a slice's persisted state. Receives slice state (unknown), returns migrated slice state. Must be idempotent. */
export type SliceMigrator = (sliceState: unknown) => unknown;

/** Ordered list of migrators for a slice (run in order; each is idempotent). */
export type SliceMigrationMap = readonly SliceMigrator[];

/** Slice key in persisted root state. */
export type SliceKey = "character" | "settings" | "reincarnation" | "content" | "achievements";
