import type Item from "../interfaces/ItemI";

/** Base path for gem/geode images. Place under public/assets/gems/ */
const GEMS_ASSETS = "/assets/gems";

/** Single consumable item: open to roll a gem from the loot table. */
export const GEODE_ITEM_ID = 350;

/** Gem item IDs (used in geode table and forging). */
export const GEM_IDS = {
  ruby: 351,
  sapphire: 352,
  emerald: 353,
  jadeShard: 354,
  amethyst: 355,
  topaz: 356,
  onyx: 357,
  moonstone: 358,
  sunstone: 359,
  spiritCrystal: 360,
} as const;

/** Geode: consumable that grants a random gem when opened. */
export const GEODE_ITEM: Item = {
  id: GEODE_ITEM_ID,
  name: "Geode",
  description: "A rough stone that may contain a gem. Use to open it.",
  price: 5,
  quantity: 1,
  picture: `${GEMS_ASSETS}/geode.webp`,
};

const GEM_ITEMS_LIST: Item[] = [
  { id: GEM_IDS.ruby, name: "Ruby", description: "A red gem. Used in forging rings and amulets.", price: 20, quantity: 1, picture: `${GEMS_ASSETS}/ruby.webp` },
  { id: GEM_IDS.sapphire, name: "Sapphire", description: "A blue gem. Used in forging.", price: 20, quantity: 1, picture: `${GEMS_ASSETS}/sapphire.webp` },
  { id: GEM_IDS.emerald, name: "Emerald", description: "A green gem. Used in forging.", price: 25, quantity: 1, picture: `${GEMS_ASSETS}/emerald.webp` },
  { id: GEM_IDS.jadeShard, name: "Jade Shard", description: "A shard of spirit jade. Used in forging.", price: 30, quantity: 1, picture: `${GEMS_ASSETS}/jade-shard.webp` },
  { id: GEM_IDS.amethyst, name: "Amethyst", description: "A purple gem. Used in forging.", price: 35, quantity: 1, picture: `${GEMS_ASSETS}/amethyst.webp` },
  { id: GEM_IDS.topaz, name: "Topaz", description: "A golden gem. Used in forging.", price: 40, quantity: 1, picture: `${GEMS_ASSETS}/topaz.webp` },
  { id: GEM_IDS.onyx, name: "Onyx", description: "A black gem. Used in forging.", price: 50, quantity: 1, picture: `${GEMS_ASSETS}/onyx.webp` },
  { id: GEM_IDS.moonstone, name: "Moonstone", description: "A pale stone that glows under moonlight. Used in forging.", price: 60, quantity: 1, picture: `${GEMS_ASSETS}/moonstone.webp` },
  { id: GEM_IDS.sunstone, name: "Sunstone", description: "A radiant stone. Used in forging.", price: 80, quantity: 1, picture: `${GEMS_ASSETS}/sunstone.webp` },
  { id: GEM_IDS.spiritCrystal, name: "Spirit Crystal", description: "A crystal infused with Qi. Used in forging.", price: 100, quantity: 1, picture: `${GEMS_ASSETS}/spirit-crystal.webp` },
];

/** All gem items for lookup. */
export const GEM_ITEMS: Item[] = GEM_ITEMS_LIST;

/** Get gem item by id. */
export function getGemItemById(id: number): Item | undefined {
  return GEM_ITEMS_LIST.find((g) => g.id === id);
}

/**
 * Weighted geode loot table: [gemId, weight]. Higher weight = more common.
 * Common: Ruby, Sapphire, Emerald. Uncommon: Jade Shard, Amethyst, Topaz. Rare: Onyx, Moonstone, Sunstone, Spirit Crystal.
 */
const GEODE_LOOT_TABLE: [number, number][] = [
  [GEM_IDS.ruby, 25],
  [GEM_IDS.sapphire, 22],
  [GEM_IDS.emerald, 20],
  [GEM_IDS.jadeShard, 12],
  [GEM_IDS.amethyst, 10],
  [GEM_IDS.topaz, 5],
  [GEM_IDS.onyx, 2],
  [GEM_IDS.moonstone, 2],
  [GEM_IDS.sunstone, 1],
  [GEM_IDS.spiritCrystal, 1],
];

const GEODE_TOTAL_WEIGHT = GEODE_LOOT_TABLE.reduce((s, [, w]) => s + w, 0);

/** Roll one gem from the geode table. Returns a new Item (quantity 1) to add to inventory. */
export function rollGemFromGeode(): Item {
  let r = Math.random() * GEODE_TOTAL_WEIGHT;
  for (const [gemId, weight] of GEODE_LOOT_TABLE) {
    r -= weight;
    if (r <= 0) {
      const gem = getGemItemById(gemId);
      return gem ? { ...gem, quantity: 1 } : { ...GEODE_ITEM, id: gemId, name: "Gem", quantity: 1 };
    }
  }
  const fallback = getGemItemById(GEODE_LOOT_TABLE[0][0]);
  return fallback ? { ...fallback, quantity: 1 } : { ...GEODE_ITEM, id: GEM_IDS.ruby, name: "Ruby", quantity: 1 };
}
