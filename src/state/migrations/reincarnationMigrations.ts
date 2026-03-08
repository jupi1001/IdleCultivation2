/**
 * Reincarnation slice migrations.
 * Owned by: state/reducers/reincarnationSlice.
 */

import type { SliceMigrator } from "./types";

/** v1: Ensure reincarnation has all required fields with defaults. */
const ensureReincarnationDefaults: SliceMigrator = (sliceState) => {
  if (!sliceState || typeof sliceState !== "object") return sliceState;
  const r = sliceState as Record<string, unknown>;
  if (r.reincarnationCount == null) r.reincarnationCount = 0;
  if (r.karmaPoints == null) r.karmaPoints = 0;
  if (r.totalKarmaEarned == null) r.totalKarmaEarned = 0;
  if (r.karmaBonusLevels == null) r.karmaBonusLevels = {};
  return sliceState;
};

export const reincarnationMigrations: readonly SliceMigrator[] = [ensureReincarnationDefaults];
