/**
 * Shared fields for all activity areas (fishing, mining, gathering).
 * Use as base for skill-specific area interfaces.
 */
export interface BaseArea {
  id: number;
  name: string;
  /** Path to area image (e.g. /assets/fishing/village-pond.webp). Use altText when image is missing. */
  picture: string;
  /** Alt text for the area image (placeholder / accessibility). */
  altText: string;
  /** If true, area only unlocks after at least one reincarnation (level 100+ content). */
  requiresReincarnation?: boolean;
}
