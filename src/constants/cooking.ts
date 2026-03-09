import type Item from "../interfaces/ItemI";
import type { ConsumableEffect } from "../types/items";

/** Build consumable output for cooking recipes. */
function cookingOutput(
  id: number,
  name: string,
  description: string,
  price: number,
  picture: string,
  effect: ConsumableEffect
): Item {
  return { id, name, description, price, quantity: 1, picture, kind: "consumable", effect };
}

/** Base path for cooked food images. Place images under public/assets/cooking/ */
const COOKING_ASSETS = "/assets/cooking";

export const COOKING_MAX_LEVEL = 120;

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
  sageCarp: 323,
  karmicKoi: 324,
  immortalBass: 325,
  daoEssenceSalmon: 326,
};

export const COOKING_RECIPES: CookingRecipeI[] = [
  {
    id: "cook-carp",
    name: "Grilled River Carp",
    description: "Cooked carp. Restores vitality when used (e.g. in combat).",
    recipeLevel: 1,
    ingredients: [{ itemId: FISH.carp, amount: 1 }],
    output: cookingOutput(750, "Grilled River Carp", "Restores 3 vitality when used.", 0, `${COOKING_ASSETS}/grilled-carp.webp`, { type: "healVitality", amount: 3 }),
    outputAmount: 1,
  },
  {
    id: "cook-tuna",
    name: "Grilled Jade Tuna",
    description: "Cooked tuna. Restores more vitality.",
    recipeLevel: 2,
    ingredients: [{ itemId: FISH.tuna, amount: 1 }],
    output: cookingOutput(751, "Grilled Jade Tuna", "Restores 4 vitality when used.", 0, `${COOKING_ASSETS}/grilled-tuna.webp`, { type: "healVitality", amount: 4 }),
    outputAmount: 1,
  },
  {
    id: "cook-mackerel",
    name: "Grilled Silver Mackerel",
    description: "Cooked mackerel.",
    recipeLevel: 3,
    ingredients: [{ itemId: FISH.mackerel, amount: 1 }],
    output: cookingOutput(752, "Grilled Silver Mackerel", "Restores 3 vitality when used.", 0, `${COOKING_ASSETS}/grilled-mackerel.webp`, { type: "healVitality", amount: 3 }),
    outputAmount: 1,
  },
  {
    id: "cook-puffer",
    name: "Prepared Abyssal Puffer",
    description: "Carefully prepared puffer. Restores more vitality.",
    recipeLevel: 4,
    ingredients: [{ itemId: FISH.puffer, amount: 1 }],
    output: cookingOutput(753, "Prepared Abyssal Puffer", "Restores 6 vitality when used.", 0, `${COOKING_ASSETS}/grilled-puffer.webp`, { type: "healVitality", amount: 6 }),
    outputAmount: 1,
  },
  {
    id: "cook-minnow",
    name: "Dried Spirit Minnow",
    description: "Light snack from a spirit minnow. Small vitality restore.",
    recipeLevel: 5,
    ingredients: [{ itemId: FISH.minnow, amount: 1 }],
    output: cookingOutput(754, "Dried Spirit Minnow", "Restores 2 vitality when used.", 0, `${COOKING_ASSETS}/dried-minnow.webp`, { type: "healVitality", amount: 2 }),
    outputAmount: 1,
  },
  // New fish (306–322)
  {
    id: "cook-lotus-koi",
    name: "Stewed Lotus Koi",
    description: "Calming koi stew. Restores Qi.",
    recipeLevel: 6,
    ingredients: [{ itemId: FISH.lotusKoi, amount: 1 }],
    output: cookingOutput(755, "Stewed Lotus Koi", "Restores 4 Qi when used.", 0, `${COOKING_ASSETS}/stewed-lotus-koi.webp`, { type: "grantQi", amount: 4 }),
    outputAmount: 1,
  },
  {
    id: "cook-azure-eel",
    name: "Grilled Azure Eel",
    description: "Eel crackling with lightning Qi.",
    recipeLevel: 7,
    ingredients: [{ itemId: FISH.azureEel, amount: 1 }],
    output: cookingOutput(756, "Grilled Azure Eel", "Restores 5 Qi when used.", 0, `${COOKING_ASSETS}/grilled-azure-eel.webp`, { type: "grantQi", amount: 5 }),
    outputAmount: 1,
  },
  {
    id: "cook-golden-bass",
    name: "Grilled Golden Bass",
    description: "Rare bass prized by alchemists. Restores vitality.",
    recipeLevel: 8,
    ingredients: [{ itemId: FISH.goldenBass, amount: 1 }],
    output: cookingOutput(757, "Grilled Golden Bass", "Restores 6 vitality when used.", 0, `${COOKING_ASSETS}/grilled-golden-bass.webp`, { type: "healVitality", amount: 6 }),
    outputAmount: 1,
  },
  {
    id: "cook-frostfin-trout",
    name: "Frostfin Trout Fillet",
    description: "Cold jade-like trout. Restores vitality.",
    recipeLevel: 9,
    ingredients: [{ itemId: FISH.frostfinTrout, amount: 1 }],
    output: cookingOutput(758, "Frostfin Trout Fillet", "Restores 7 vitality when used.", 0, `${COOKING_ASSETS}/frostfin-fillet.webp`, { type: "healVitality", amount: 7 }),
    outputAmount: 1,
  },
  {
    id: "cook-shadow-catfish",
    name: "Prepared Shadow Catfish",
    description: "Dark Qi-infused catfish. Restores Qi.",
    recipeLevel: 10,
    ingredients: [{ itemId: FISH.shadowCatfish, amount: 1 }],
    output: cookingOutput(759, "Prepared Shadow Catfish", "Restores 8 Qi when used.", 0, `${COOKING_ASSETS}/shadow-catfish-prepared.webp`, { type: "grantQi", amount: 8 }),
    outputAmount: 1,
  },
  {
    id: "cook-celestial-salmon",
    name: "Grilled Celestial Salmon",
    description: "Heavenly salmon. Restores vitality.",
    recipeLevel: 11,
    ingredients: [{ itemId: FISH.celestialSalmon, amount: 1 }],
    output: cookingOutput(760, "Grilled Celestial Salmon", "Restores 10 vitality when used.", 0, `${COOKING_ASSETS}/grilled-celestial-salmon.webp`, { type: "healVitality", amount: 10 }),
    outputAmount: 1,
  },
  {
    id: "cook-dragon-sturgeon",
    name: "Braised Dragon Sturgeon",
    description: "Sturgeon from dragon veins. Restores Qi.",
    recipeLevel: 12,
    ingredients: [{ itemId: FISH.dragonSturgeon, amount: 1 }],
    output: cookingOutput(761, "Braised Dragon Sturgeon", "Restores 14 Qi when used.", 0, `${COOKING_ASSETS}/braised-dragon-sturgeon.webp`, { type: "grantQi", amount: 14 }),
    outputAmount: 1,
  },
  {
    id: "cook-emberfin-snapper",
    name: "Grilled Emberfin Snapper",
    description: "Warm glowing snapper. Restores vitality.",
    recipeLevel: 13,
    ingredients: [{ itemId: FISH.emberfinSnapper, amount: 1 }],
    output: cookingOutput(762, "Grilled Emberfin Snapper", "Restores 9 vitality when used.", 0, `${COOKING_ASSETS}/grilled-emberfin-snapper.webp`, { type: "healVitality", amount: 9 }),
    outputAmount: 1,
  },
  {
    id: "cook-moonwhisker-carp",
    name: "Steamed Moonwhisker Carp",
    description: "Moonlit carp. Enhances spiritual awareness. Restores Qi.",
    recipeLevel: 14,
    ingredients: [{ itemId: FISH.moonwhiskerCarp, amount: 1 }],
    output: cookingOutput(763, "Steamed Moonwhisker Carp", "Restores 10 Qi when used.", 0, `${COOKING_ASSETS}/steamed-moonwhisker-carp.webp`, { type: "grantQi", amount: 10 }),
    outputAmount: 1,
  },
  {
    id: "cook-starfall-guppy",
    name: "Starfall Guppy Fry",
    description: "Tiny shimmering fry. Restores Qi.",
    recipeLevel: 15,
    ingredients: [{ itemId: FISH.starfallGuppy, amount: 1 }],
    output: cookingOutput(764, "Starfall Guppy Fry", "Restores 8 Qi when used.", 0, `${COOKING_ASSETS}/starfall-guppy-fry.webp`, { type: "grantQi", amount: 8 }),
    outputAmount: 1,
  },
  {
    id: "cook-thunderjaw-pike",
    name: "Grilled Thunderjaw Pike",
    description: "Thunder-crackling pike. Restores vitality.",
    recipeLevel: 16,
    ingredients: [{ itemId: FISH.thunderjawPike, amount: 1 }],
    output: cookingOutput(765, "Grilled Thunderjaw Pike", "Restores 12 vitality when used.", 0, `${COOKING_ASSETS}/grilled-thunderjaw-pike.webp`, { type: "healVitality", amount: 12 }),
    outputAmount: 1,
  },
  {
    id: "cook-verdant-tilapia",
    name: "Herbed Verdant Tilapia",
    description: "Spirit-herb fed tilapia. Restores Qi.",
    recipeLevel: 17,
    ingredients: [{ itemId: FISH.verdantTilapia, amount: 1 }],
    output: cookingOutput(766, "Herbed Verdant Tilapia", "Restores 9 Qi when used.", 0, `${COOKING_ASSETS}/herbed-tilapia.webp`, { type: "grantQi", amount: 9 }),
    outputAmount: 1,
  },
  {
    id: "cook-void-lantern",
    name: "Prepared Void Lantern",
    description: "Ghostly lantern fish. Restores Qi.",
    recipeLevel: 18,
    ingredients: [{ itemId: FISH.voidLantern, amount: 1 }],
    output: cookingOutput(767, "Prepared Void Lantern", "Restores 13 Qi when used.", 0, `${COOKING_ASSETS}/void-lantern-prepared.webp`, { type: "grantQi", amount: 13 }),
    outputAmount: 1,
  },
  {
    id: "cook-crimson-koi",
    name: "Braised Crimson Koi",
    description: "Symbol of fortune. Restores vitality.",
    recipeLevel: 19,
    ingredients: [{ itemId: FISH.crimsonKoi, amount: 1 }],
    output: cookingOutput(768, "Braised Crimson Koi", "Restores 14 vitality when used.", 0, `${COOKING_ASSETS}/braised-crimson-koi.webp`, { type: "healVitality", amount: 14 }),
    outputAmount: 1,
  },
  {
    id: "cook-mirror-ray",
    name: "Grilled Heaven's Mirror Ray",
    description: "Sky-reflecting ray. Restores Qi.",
    recipeLevel: 20,
    ingredients: [{ itemId: FISH.mirrorRay, amount: 1 }],
    output: cookingOutput(769, "Grilled Heaven's Mirror Ray", "Restores 15 Qi when used.", 0, `${COOKING_ASSETS}/grilled-mirror-ray.webp`, { type: "grantQi", amount: 15 }),
    outputAmount: 1,
  },
  {
    id: "cook-nine-whisker-catfish",
    name: "Nine-Whisker Catfish Stew",
    description: "Ancient catfish stew. Restores vitality.",
    recipeLevel: 21,
    ingredients: [{ itemId: FISH.nineWhiskerCatfish, amount: 1 }],
    output: cookingOutput(770, "Nine-Whisker Catfish Stew", "Restores 16 vitality when used.", 0, `${COOKING_ASSETS}/nine-whisker-stew.webp`, { type: "healVitality", amount: 16 }),
    outputAmount: 1,
  },
  {
    id: "cook-pearl-eel",
    name: "Mythic Pearl Eel Fillet",
    description: "Spirit-pearl eel. Restores Qi.",
    recipeLevel: 22,
    ingredients: [{ itemId: FISH.pearlEel, amount: 1 }],
    output: cookingOutput(771, "Mythic Pearl Eel Fillet", "Restores 18 Qi when used.", 0, `${COOKING_ASSETS}/pearl-eel-fillet.webp`, { type: "grantQi", amount: 18 }),
    outputAmount: 1,
  },
  {
    id: "cook-sage-carp",
    name: "Grilled Sage Carp",
    description: "Carp from sage waters. Requires reincarnation to obtain.",
    recipeLevel: 23,
    ingredients: [{ itemId: FISH.sageCarp, amount: 1 }],
    output: cookingOutput(772, "Grilled Sage Carp", "Restores 20 vitality when used.", 0, `${COOKING_ASSETS}/sage-carp-grilled.webp`, { type: "healVitality", amount: 20 }),
    outputAmount: 1,
  },
  {
    id: "cook-karmic-koi",
    name: "Karmic Koi Stew",
    description: "Koi that reflects karma. Requires reincarnation to obtain.",
    recipeLevel: 24,
    ingredients: [{ itemId: FISH.karmicKoi, amount: 1 }],
    output: cookingOutput(773, "Karmic Koi Stew", "Restores 22 Qi when used.", 0, `${COOKING_ASSETS}/karmic-koi-stew.webp`, { type: "grantQi", amount: 22 }),
    outputAmount: 1,
  },
  {
    id: "cook-immortal-bass",
    name: "Immortal Bass Fillet",
    description: "Bass rumored to never age. Requires reincarnation to obtain.",
    recipeLevel: 25,
    ingredients: [{ itemId: FISH.immortalBass, amount: 1 }],
    output: cookingOutput(774, "Immortal Bass Fillet", "Restores 24 vitality when used.", 0, `${COOKING_ASSETS}/immortal-bass-fillet.webp`, { type: "healVitality", amount: 24 }),
    outputAmount: 1,
  },
  {
    id: "cook-dao-essence-salmon",
    name: "Dao Essence Salmon",
    description: "Salmon touched by the Dao. Requires reincarnation to obtain.",
    recipeLevel: 26,
    ingredients: [{ itemId: FISH.daoEssenceSalmon, amount: 1 }],
    output: cookingOutput(775, "Dao Essence Salmon", "Restores 26 Qi when used.", 0, `${COOKING_ASSETS}/dao-essence-salmon.webp`, { type: "grantQi", amount: 26 }),
    outputAmount: 1,
  },
];
