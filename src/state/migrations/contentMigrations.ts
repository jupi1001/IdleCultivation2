/**
 * Content slice migrations.
 * Owned by: state/reducers/contentSlice.
 */

import type { SliceMigrator } from "./types";
import { parseLegacyPage } from "../types/contentRoute";

/** v1: Parse legacy page string into route object. */
const contentLegacyPageToRoute: SliceMigrator = (sliceState) => {
  if (!sliceState || typeof sliceState !== "object") return sliceState;
  const c = sliceState as Record<string, unknown>;
  if (c.route == null && c.page != null && typeof c.page === "string") {
    c.route = parseLegacyPage(c.page);
  }
  return sliceState;
};

export const contentMigrations: readonly SliceMigrator[] = [contentLegacyPageToRoute];
