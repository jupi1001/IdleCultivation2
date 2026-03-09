/**
 * Shared types for the skilling framework (fishing, mining, gathering).
 * Use with useSkillActivity and SkillAreaCard.
 */
import type { BaseArea } from "../interfaces/BaseArea";
import type Item from "../interfaces/ItemI";

export type SkillKind = "fishing" | "mining" | "gathering";

/** Props that any skill area card can receive (unified for shared UI). */
export interface SkillAreaCardProps {
  title: string;
  imageSrc: string;
  altText: string;
  /** XP per cast/success (skill-specific label in UI). */
  xpPerCast: number;
  /** Delay/duration in ms. */
  delayMs: number;
  requiredLevel: number;
  possibleLoot: Item[];
  lootEntries?: { item: Item; chancePercent: number }[];
  ownedItemIds?: Set<number>;
  unlocked: boolean;
  onClick: () => void;
  /** For CSS and labels, e.g. "fishing" | "mining" | "gathering". */
  skillKind: SkillKind;
}

/** Area that supports rare drops (fishing, gathering). */
export interface RareDropArea extends BaseArea {
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
}
