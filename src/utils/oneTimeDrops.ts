/**
 * One-time obtainable item drops: roll only if the player doesn't already own the item.
 * Used by expeditions (mission rare drops), skilling set pieces, and can be reused for enemy uniques.
 */
import type Item from "../interfaces/ItemI";

/**
 * Roll a single one-time drop from a list of item IDs: chancePercent to drop at all,
 * then pick one at random from IDs the player doesn't own. Returns null if no drop or all owned.
 */
export function rollOneTimeDrop(
  ownedIds: Set<number>,
  itemIds: number[],
  chancePercent: number,
  getItemById: (id: number) => Item | undefined
): Item | null {
  if (itemIds.length === 0 || Math.random() * 100 >= chancePercent) return null;
  const available = itemIds.filter((id) => !ownedIds.has(id));
  if (available.length === 0) return null;
  const id = available[Math.floor(Math.random() * available.length)];
  return getItemById(id) ?? null;
}

export interface OneTimeDropEntry {
  itemId: number;
  /** Chance 0–1 (e.g. 0.15 = 15%) */
  chance: number;
}

/**
 * Roll one-time drops from a table (e.g. mission.rareDrops). Tries each entry in order;
 * skips if player already has the item; returns first successful roll. Chance per entry is 0–1.
 */
export function rollOneTimeDropFromTable(
  ownedIds: Set<number>,
  drops: OneTimeDropEntry[],
  getItemById: (id: number) => Item | undefined
): Item | null {
  for (const drop of drops) {
    if (ownedIds.has(drop.itemId)) continue;
    if (Math.random() >= drop.chance) continue;
    const item = getItemById(drop.itemId);
    if (item) return item;
  }
  return null;
}
