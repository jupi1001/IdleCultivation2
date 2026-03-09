/**
 * Content slice migrations.
 * Owned by: state/reducers/contentSlice.
 */

import { parseLegacyPage } from "../types/contentRoute";
import type { SliceMigrator } from "./types";

const DEFAULT_ROUTE = { type: "map" as const };

/** v1: Ensure route exists; migrate legacy page string to route object. */
const contentLegacyPageToRoute: SliceMigrator = (sliceState) => {
  if (!sliceState || typeof sliceState !== "object") return sliceState;
  const c = sliceState as Record<string, unknown>;
  if (c.route == null) {
    c.route =
      c.page != null && typeof c.page === "string"
        ? parseLegacyPage(c.page)
        : DEFAULT_ROUTE;
  }
  return sliceState;
};

export const contentMigrations: readonly SliceMigrator[] = [contentLegacyPageToRoute];
