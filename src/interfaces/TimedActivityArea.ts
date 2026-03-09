import type { BaseArea } from "./BaseArea";

/**
 * Activity areas with a timed cast: delay, XP reward, and XP unlock threshold.
 * Shared by fishing, mining, and gathering. Extend this for skill-specific loot (e.g. fishingLootIds, miningLootId).
 */
export interface TimedActivityArea extends BaseArea {
  /** XP awarded per completion. */
  xp: number;
  /** Total XP required to unlock this area. */
  xpUnlock: number;
  /** Cast duration in milliseconds. */
  delay: number;
}
