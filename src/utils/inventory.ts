/** Inventory helpers shared across crafting UIs (Alchemy, Forging, Cooking, etc.). */

/** Count owned quantity of a specific item in an inventory array. */
export function countItem(items: { id: number; quantity?: number }[], itemId: number): number {
  const entry = items.find((i) => i.id === itemId);
  return entry ? (entry.quantity ?? 1) : 0;
}
