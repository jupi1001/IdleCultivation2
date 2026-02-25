import type Item from "../interfaces/ItemI";

/** Base path for cooked food images. Place images under public/assets/cooking/ */
const COOKING_ASSETS = "/assets/cooking";

export const COOKING_MAX_LEVEL = 99;

/** Backloaded curve (generous for consumable skills): XP for L→L+1 = floor(BASE × L^EXP). */
const XP_CURVE_BASE = 4;
const XP_CURVE_EXPONENT = 1.25;

export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredForNextLevel(L);
  }
  return sum;
}

export function xpRequiredForNextLevel(level: number): number {
  if (level >= COOKING_MAX_LEVEL) return 0;
  return Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_EXPONENT));
}

/** Level from total XP (backloaded curve). */
export function getCookingLevel(cookingXP: number): number {
  const total = Math.max(0, Math.floor(cookingXP));
  let level = 1;
  while (level < COOKING_MAX_LEVEL && total >= totalXpForLevel(level + 1)) {
    level++;
  }
  return level;
}

export interface CookingLevelInfo {
  level: number;
  xpInLevel: number;
  xpRequiredForNext: number;
  totalXp: number;
}

export function getCookingLevelInfo(totalXp: number): CookingLevelInfo {
  const total = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (level < COOKING_MAX_LEVEL && total >= totalXpForLevel(level + 1)) {
    level++;
  }
  const xpInLevel = total - totalXpForLevel(level);
  const xpRequiredForNext = xpRequiredForNextLevel(level);
  return { level, xpInLevel, xpRequiredForNext, totalXp: total };
}

/** XP granted per cook; scales by recipe tier (early recipes give less, late more). */
export function getCookingXP(recipeLevel: number): number {
  return Math.max(1, Math.floor(2 * recipeLevel));
}

export interface CookingIngredient {
  itemId: number;
  amount: number;
}

export interface CookingRecipeI {
  id: string;
  name: string;
  description: string;
  /** Recipe tier 1–N; higher = later game, more XP per cook */
  recipeLevel: number;
  ingredients: CookingIngredient[];
  output: Item;
  outputAmount: number;
}

const FISH = {
  minnow: 301,
  carp: 302,
  tuna: 303,
  mackerel: 304,
  puffer: 305,
  lotusKoi: 306,
  azureEel: 307,
  goldenBass: 308,
  frostfinTrout: 309,
  shadowCatfish: 310,
  celestialSalmon: 311,
  dragonSturgeon: 312,
  emberfinSnapper: 313,
  moonwhiskerCarp: 314,
  starfallGuppy: 315,
  thunderjawPike: 316,
  verdantTilapia: 317,
  voidLantern: 318,
  crimsonKoi: 319,
  mirrorRay: 320,
  nineWhiskerCatfish: 321,
  pearlEel: 322,
};

export const COOKING_RECIPES: CookingRecipeI[] = [
  {
    id: "cook-carp",
    name: "Grilled River Carp",
    description: "Cooked carp. Restores vitality when used (e.g. in combat).",
    recipeLevel: 1,
    ingredients: [{ itemId: FISH.carp, amount: 1 }],
    output: {
      id: 750,
      name: "Grilled River Carp",
      description: "Restores 3 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-carp.webp`,
      value: 3,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-tuna",
    name: "Grilled Jade Tuna",
    description: "Cooked tuna. Restores more vitality.",
    recipeLevel: 2,
    ingredients: [{ itemId: FISH.tuna, amount: 1 }],
    output: {
      id: 751,
      name: "Grilled Jade Tuna",
      description: "Restores 4 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-tuna.webp`,
      value: 4,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-mackerel",
    name: "Grilled Silver Mackerel",
    description: "Cooked mackerel.",
    recipeLevel: 3,
    ingredients: [{ itemId: FISH.mackerel, amount: 1 }],
    output: {
      id: 752,
      name: "Grilled Silver Mackerel",
      description: "Restores 3 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-mackerel.webp`,
      value: 3,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-puffer",
    name: "Prepared Abyssal Puffer",
    description: "Carefully prepared puffer. Restores more vitality.",
    recipeLevel: 4,
    ingredients: [{ itemId: FISH.puffer, amount: 1 }],
    output: {
      id: 753,
      name: "Prepared Abyssal Puffer",
      description: "Restores 6 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-puffer.webp`,
      value: 6,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-minnow",
    name: "Dried Spirit Minnow",
    description: "Light snack from a spirit minnow. Small vitality restore.",
    recipeLevel: 5,
    ingredients: [{ itemId: FISH.minnow, amount: 1 }],
    output: {
      id: 754,
      name: "Dried Spirit Minnow",
      description: "Restores 2 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/dried-minnow.webp`,
      value: 2,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  // New fish (306–322)
  {
    id: "cook-lotus-koi",
    name: "Stewed Lotus Koi",
    description: "Calming koi stew. Restores Qi.",
    recipeLevel: 6,
    ingredients: [{ itemId: FISH.lotusKoi, amount: 1 }],
    output: {
      id: 755,
      name: "Stewed Lotus Koi",
      description: "Restores 4 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/stewed-lotus-koi.webp`,
      value: 4,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-azure-eel",
    name: "Grilled Azure Eel",
    description: "Eel crackling with lightning Qi.",
    recipeLevel: 7,
    ingredients: [{ itemId: FISH.azureEel, amount: 1 }],
    output: {
      id: 756,
      name: "Grilled Azure Eel",
      description: "Restores 5 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-azure-eel.webp`,
      value: 5,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-golden-bass",
    name: "Grilled Golden Bass",
    description: "Rare bass prized by alchemists. Restores vitality.",
    recipeLevel: 8,
    ingredients: [{ itemId: FISH.goldenBass, amount: 1 }],
    output: {
      id: 757,
      name: "Grilled Golden Bass",
      description: "Restores 6 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-golden-bass.webp`,
      value: 6,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-frostfin-trout",
    name: "Frostfin Trout Fillet",
    description: "Cold jade-like trout. Restores vitality.",
    recipeLevel: 9,
    ingredients: [{ itemId: FISH.frostfinTrout, amount: 1 }],
    output: {
      id: 758,
      name: "Frostfin Trout Fillet",
      description: "Restores 7 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/frostfin-fillet.webp`,
      value: 7,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-shadow-catfish",
    name: "Prepared Shadow Catfish",
    description: "Dark Qi-infused catfish. Restores Qi.",
    recipeLevel: 10,
    ingredients: [{ itemId: FISH.shadowCatfish, amount: 1 }],
    output: {
      id: 759,
      name: "Prepared Shadow Catfish",
      description: "Restores 8 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/shadow-catfish-prepared.webp`,
      value: 8,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-celestial-salmon",
    name: "Grilled Celestial Salmon",
    description: "Heavenly salmon. Restores vitality.",
    recipeLevel: 11,
    ingredients: [{ itemId: FISH.celestialSalmon, amount: 1 }],
    output: {
      id: 760,
      name: "Grilled Celestial Salmon",
      description: "Restores 10 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-celestial-salmon.webp`,
      value: 10,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-dragon-sturgeon",
    name: "Braised Dragon Sturgeon",
    description: "Sturgeon from dragon veins. Restores Qi.",
    recipeLevel: 12,
    ingredients: [{ itemId: FISH.dragonSturgeon, amount: 1 }],
    output: {
      id: 761,
      name: "Braised Dragon Sturgeon",
      description: "Restores 14 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/braised-dragon-sturgeon.webp`,
      value: 14,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-emberfin-snapper",
    name: "Grilled Emberfin Snapper",
    description: "Warm glowing snapper. Restores vitality.",
    recipeLevel: 13,
    ingredients: [{ itemId: FISH.emberfinSnapper, amount: 1 }],
    output: {
      id: 762,
      name: "Grilled Emberfin Snapper",
      description: "Restores 9 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-emberfin-snapper.webp`,
      value: 9,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-moonwhisker-carp",
    name: "Steamed Moonwhisker Carp",
    description: "Moonlit carp. Enhances spiritual awareness. Restores Qi.",
    recipeLevel: 14,
    ingredients: [{ itemId: FISH.moonwhiskerCarp, amount: 1 }],
    output: {
      id: 763,
      name: "Steamed Moonwhisker Carp",
      description: "Restores 10 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/steamed-moonwhisker-carp.webp`,
      value: 10,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-starfall-guppy",
    name: "Starfall Guppy Fry",
    description: "Tiny shimmering fry. Restores Qi.",
    recipeLevel: 15,
    ingredients: [{ itemId: FISH.starfallGuppy, amount: 1 }],
    output: {
      id: 764,
      name: "Starfall Guppy Fry",
      description: "Restores 8 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/starfall-guppy-fry.webp`,
      value: 8,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-thunderjaw-pike",
    name: "Grilled Thunderjaw Pike",
    description: "Thunder-crackling pike. Restores vitality.",
    recipeLevel: 16,
    ingredients: [{ itemId: FISH.thunderjawPike, amount: 1 }],
    output: {
      id: 765,
      name: "Grilled Thunderjaw Pike",
      description: "Restores 12 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-thunderjaw-pike.webp`,
      value: 12,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-verdant-tilapia",
    name: "Herbed Verdant Tilapia",
    description: "Spirit-herb fed tilapia. Restores Qi.",
    recipeLevel: 17,
    ingredients: [{ itemId: FISH.verdantTilapia, amount: 1 }],
    output: {
      id: 766,
      name: "Herbed Verdant Tilapia",
      description: "Restores 9 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/herbed-tilapia.webp`,
      value: 9,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-void-lantern",
    name: "Prepared Void Lantern",
    description: "Ghostly lantern fish. Restores Qi.",
    recipeLevel: 18,
    ingredients: [{ itemId: FISH.voidLantern, amount: 1 }],
    output: {
      id: 767,
      name: "Prepared Void Lantern",
      description: "Restores 13 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/void-lantern-prepared.webp`,
      value: 13,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-crimson-koi",
    name: "Braised Crimson Koi",
    description: "Symbol of fortune. Restores vitality.",
    recipeLevel: 19,
    ingredients: [{ itemId: FISH.crimsonKoi, amount: 1 }],
    output: {
      id: 768,
      name: "Braised Crimson Koi",
      description: "Restores 14 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/braised-crimson-koi.webp`,
      value: 14,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-mirror-ray",
    name: "Grilled Heaven's Mirror Ray",
    description: "Sky-reflecting ray. Restores Qi.",
    recipeLevel: 20,
    ingredients: [{ itemId: FISH.mirrorRay, amount: 1 }],
    output: {
      id: 769,
      name: "Grilled Heaven's Mirror Ray",
      description: "Restores 15 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-mirror-ray.webp`,
      value: 15,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "cook-nine-whisker-catfish",
    name: "Nine-Whisker Catfish Stew",
    description: "Ancient catfish stew. Restores vitality.",
    recipeLevel: 21,
    ingredients: [{ itemId: FISH.nineWhiskerCatfish, amount: 1 }],
    output: {
      id: 770,
      name: "Nine-Whisker Catfish Stew",
      description: "Restores 16 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/nine-whisker-stew.webp`,
      value: 16,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-pearl-eel",
    name: "Mythic Pearl Eel Fillet",
    description: "Spirit-pearl eel. Restores Qi.",
    recipeLevel: 22,
    ingredients: [{ itemId: FISH.pearlEel, amount: 1 }],
    output: {
      id: 771,
      name: "Mythic Pearl Eel Fillet",
      description: "Restores 18 Qi when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/pearl-eel-fillet.webp`,
      value: 18,
      effect: "qi",
    },
    outputAmount: 1,
  },
];
