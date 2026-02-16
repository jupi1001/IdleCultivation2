import type Item from "../interfaces/ItemI";

/** Base path for forging/weapon/armour images. Place images under public/assets/forging/ */
const FORGING_ASSETS = "/assets/forging";
const MINING_ASSETS = "/assets/mining";
const GATHERING_ASSETS = "/assets/gathering";

/** Max display level in left-panel card */
export const FORGING_MAX_LEVEL = 99;

/** Forging level from XP: level 1 at 0 XP, +1 per 100 XP */
export function getForgingLevel(forgingXP: number): number {
  return Math.max(1, Math.min(FORGING_MAX_LEVEL, 1 + Math.floor(forgingXP / 100)));
}

export interface ForgingIngredient {
  itemId: number;
  amount: number;
}

/** Refine raw ore into bars (consumes ore only) */
export interface RefineRecipeI {
  id: string;
  name: string;
  description: string;
  ore: ForgingIngredient;
  output: Item;
  outputAmount: number;
}

/** Craft bars into weapon or armour */
export interface CraftRecipeI {
  id: string;
  name: string;
  description: string;
  bars: ForgingIngredient[];
  output: Item;
  outputAmount: number;
}

const ORE = { copper: 501, iron: 502, spirit: 503 };
const BAR = { copper: 801, iron: 802, spirit: 803 };

/** Bar items (refined from ore). Use public/mining or forging assets for icons. */
export const FORGE_BAR_ITEMS: Item[] = [
  {
    id: BAR.copper,
    name: "Copper Bar",
    description: "Refined copper. Used to forge copper weapons and armour.",
    price: 0,
    quantity: 1,
    picture: `${MINING_ASSETS}/item-copper-ore.png`,
    value: 0,
  },
  {
    id: BAR.iron,
    name: "Iron Bar",
    description: "Refined iron. Used to forge iron weapons and armour.",
    price: 0,
    quantity: 1,
    picture: `${MINING_ASSETS}/item-iron-ore.png`,
    value: 0,
  },
  {
    id: BAR.spirit,
    name: "Spirit Bar",
    description: "Condensed spirit bar. Used for spirit-tier gear.",
    price: 0,
    quantity: 1,
    picture: `${MINING_ASSETS}/item-spirit-stone.png`,
    value: 0,
  },
];

export const REFINE_RECIPES: RefineRecipeI[] = [
  {
    id: "refine-copper",
    name: "Refine Copper Bar",
    description: "Smelt copper ore to produce a copper bar.",
    ore: { itemId: ORE.copper, amount: 1 },
    output: FORGE_BAR_ITEMS[0],
    outputAmount: 1,
  },
  {
    id: "refine-iron",
    name: "Refine Iron Bar",
    description: "Smelt iron ore to produce an iron bar.",
    ore: { itemId: ORE.iron, amount: 1 },
    output: FORGE_BAR_ITEMS[1],
    outputAmount: 1,
  },
  {
    id: "refine-spirit",
    name: "Refine Spirit Bar",
    description: "Condense spirit stones into a spirit bar.",
    ore: { itemId: ORE.spirit, amount: 3 },
    output: FORGE_BAR_ITEMS[2],
    outputAmount: 1,
  },
];

/** Craft recipes: bars → weapon or armour. Outputs are equippable. */
export const CRAFT_RECIPES: CraftRecipeI[] = [
  {
    id: "craft-copper-sword",
    name: "Copper Sword",
    description: "A basic forged weapon. Equip in combat technique slot.",
    bars: [{ itemId: BAR.copper, amount: 2 }],
    output: {
      id: 901,
      name: "Copper Sword",
      description: "A sturdy copper blade.",
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/copper-sword.png`,
      equipmentSlot: "combatTechnique",
    },
    outputAmount: 1,
  },
  {
    id: "craft-iron-sword",
    name: "Iron Sword",
    description: "A stronger forged weapon.",
    bars: [{ itemId: BAR.iron, amount: 3 }],
    output: {
      id: 902,
      name: "Iron Sword",
      description: "A sharp iron blade.",
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/iron-sword.png`,
      equipmentSlot: "combatTechnique",
    },
    outputAmount: 1,
  },
  {
    id: "craft-spirit-sword",
    name: "Spirit Sword",
    description: "A spirit-infused weapon.",
    bars: [{ itemId: BAR.spirit, amount: 4 }],
    output: {
      id: 903,
      name: "Spirit Sword",
      description: "A blade touched by spirit energy.",
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/spirit-sword.png`,
      equipmentSlot: "combatTechnique",
    },
    outputAmount: 1,
  },
  {
    id: "craft-copper-helmet",
    name: "Copper Helmet",
    description: "Forged head protection.",
    bars: [{ itemId: BAR.copper, amount: 3 }],
    output: {
      id: 911,
      name: "Copper Helmet",
      description: "A copper helmet.",
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/copper-helmet.png`,
      equipmentSlot: "helmet",
    },
    outputAmount: 1,
  },
  {
    id: "craft-iron-helmet",
    name: "Iron Helmet",
    description: "Stronger head protection.",
    bars: [{ itemId: BAR.iron, amount: 4 }],
    output: {
      id: 912,
      name: "Iron Helmet",
      description: "An iron helmet.",
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/iron-helmet.png`,
      equipmentSlot: "helmet",
    },
    outputAmount: 1,
  },
  {
    id: "craft-copper-body",
    name: "Copper Chestplate",
    description: "Forged body armour.",
    bars: [{ itemId: BAR.copper, amount: 4 }],
    output: {
      id: 921,
      name: "Copper Chestplate",
      description: "Copper body armour.",
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/copper-body.png`,
      equipmentSlot: "body",
    },
    outputAmount: 1,
  },
  {
    id: "craft-iron-body",
    name: "Iron Chestplate",
    description: "Stronger body armour.",
    bars: [{ itemId: BAR.iron, amount: 5 }],
    output: {
      id: 922,
      name: "Iron Chestplate",
      description: "Iron body armour.",
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/iron-body.png`,
      equipmentSlot: "body",
    },
    outputAmount: 1,
  },
];

/** All items that can appear from forging (bars + crafted gear) for lookup */
export const FORGE_OUTPUT_ITEMS: Item[] = [
  ...FORGE_BAR_ITEMS,
  ...CRAFT_RECIPES.map((r) => r.output),
];
