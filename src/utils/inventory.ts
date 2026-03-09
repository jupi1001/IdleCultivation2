/** Inventory helpers shared across crafting UIs (Alchemy, Forging, Cooking, etc.). */

/** Get owned quantity of an item from normalized itemsById (registry-based). Prefer over countItem when using selectItemsById. */
export function getItemQuantity(itemsById: Record<number, number>, itemId: number): number {
  return itemsById[itemId] ?? 0;
}

/** Count owned quantity of a specific item in an inventory array. Prefer getItemQuantity + selectItemsById when using registries. */
export function countItem(items: { id: number; quantity?: number }[], itemId: number): number {
  const entry = items.find((i) => i.id === itemId);
  return entry ? (entry.quantity ?? 1) : 0;
}
