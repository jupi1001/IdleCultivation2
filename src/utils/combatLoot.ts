/**
 * Combat loot: resolve loot table (normal vs sect raid) and roll drops.
 * Pure functions for testability and correct memoization (Task 11).
 */
import { isSectRaidArea, SECT_RAID_AREA_TO_SECT_ID } from "../constants/combatAreaRules";
import { getSectRaidLootForRank, SECTS_BY_ID } from "../constants/data";
import type EnemyI from "../interfaces/EnemyI";
import type Item from "../interfaces/ItemI";
import { getEquipmentSlot } from "../interfaces/ItemI";
import type { EnemyLootDisplayEntry, ResolvedLootTable, SectLootContext } from "../types/combatTypes";

/**
 * Resolve enemy loot table for the current area and sect context.
 * For sect raids with matching conditions (opposite path, rank > 0), returns sect raid loot; otherwise enemy loot.
 */
export function getResolvedLootTable(
  enemy: EnemyI,
  context: SectLootContext
): ResolvedLootTable | null {
  let items = enemy.loot?.items;
  let weight = enemy.loot?.weight;

  if (context.area != null && isSectRaidArea(context.area)) {
    const sectId = SECT_RAID_AREA_TO_SECT_ID[context.area];
    const currentSect = context.currentSectId != null ? SECTS_BY_ID[context.currentSectId] : null;
    if (
      sectId != null &&
      currentSect != null &&
      context.path != null &&
      currentSect.path === context.path
    ) {
      const targetSect = SECTS_BY_ID[sectId];
      if (targetSect && targetSect.path !== currentSect.path && context.sectRankIndex > 0) {
        const loot = getSectRaidLootForRank(sectId, context.sectRankIndex);
        if (loot) {
          items = loot.items;
          weight = loot.weight;
        }
      }
    }
  }

  if (!items?.length || !weight?.length || items.length !== weight.length) return null;
  return { items, weight: weight.slice() };
}

/**
 * Pure helper for combat UI: get display entries (item, chancePercent, amount) for an enemy.
 * Call with explicit inputs so useMemo dependency array is correct (currentEnemy, area, sect context).
 */
export function getEnemyLootEntries(
  enemy: EnemyI | null | undefined,
  context: SectLootContext
): EnemyLootDisplayEntry[] {
  if (!enemy) return [];
  const table = getResolvedLootTable(enemy, context);
  if (!table || !table.items.length) return [];
  const total = table.weight.reduce((a, b) => a + b, 0);
  if (total <= 0) return [];
  return table.items.map((item, i) => ({
    item,
    chancePercent: (table.weight[i] / total) * 100,
    amount: item.quantity ?? 1,
  }));
}

/**
 * Roll one item from a resolved loot table. Techniques (qi/combat) are skipped if already owned.
 */
export function rollOneDrop(
  table: ResolvedLootTable | null,
  ownedTechniqueIds: Set<number>
): Item | null {
  if (!table || table.items.length === 0) return null;
  const weights = table.weight.slice();
  for (let i = 0; i < weights.length; i++) {
    weights[i] += weights[i - 1] ?? 0;
  }
  const total = weights[weights.length - 1];
  if (total <= 0) return null;
  const random = Math.random() * total;
  let i = 0;
  for (; i < weights.length; i++) {
    if (weights[i] > random) break;
  }
  const dropped = table.items[i];
  const isTechnique = (slot: string | undefined) => slot === "qiTechnique" || slot === "combatTechnique";
  if (isTechnique(getEquipmentSlot(dropped)) && ownedTechniqueIds.has(dropped.id)) return null;
  return dropped;
}
