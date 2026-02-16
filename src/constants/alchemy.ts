import type Item from "../interfaces/ItemI";

/** Base path for alchemy/pill images. Place images under public/assets/alchemy/ */
const ALCHEMY_ASSETS = "/assets/alchemy";

/** Max display level in left-panel card (e.g. Level 5/99) */
export const ALCHEMY_MAX_LEVEL = 99;

/** Alchemy level from XP: level 1 at 0 XP, +1 level per 100 XP */
export function getAlchemyLevel(alchemyXP: number): number {
  return Math.max(1, Math.min(ALCHEMY_MAX_LEVEL, 1 + Math.floor(alchemyXP / 100)));
}

/**
 * Success chance (0–100) when crafting a pill.
 * When alchemyLevel >= recipeLevel: 100% at L1, 95% at L5, 90% at L10, 80% at L15, 70% at L20 (piecewise).
 * When recipeLevel > alchemyLevel: excess 5 → 30%, 10 → 10%, 15 → 1%, ≥15 → 0%.
 */
export function getAlchemySuccessChance(alchemyLevel: number, recipeLevel: number): number {
  if (recipeLevel <= 0) return 100;
  const excess = recipeLevel - alchemyLevel;
  if (excess <= 0) {
    if (recipeLevel >= 20) return 70;
    if (recipeLevel >= 15) return 80 - 2 * (recipeLevel - 15);
    if (recipeLevel >= 10) return 90 - 2 * (recipeLevel - 10);
    if (recipeLevel >= 5) return 95 - (recipeLevel - 5);
    return 100 - 1.25 * (recipeLevel - 1);
  }
  if (excess >= 15) return 0;
  if (excess >= 10) return Math.max(0, 10 - 1.8 * (excess - 10));
  if (excess >= 5) return Math.max(0, 30 - 4 * (excess - 5));
  return Math.max(0, 70 - 8 * excess);
}

export interface AlchemyRecipeIngredient {
  itemId: number;
  amount: number;
}

export interface AlchemyRecipeI {
  id: string;
  name: string;
  description: string;
  /** Recipe difficulty 1–35; higher = harder, lower success when underlevelled */
  recipeLevel: number;
  ingredients: AlchemyRecipeIngredient[];
  /** Wood consumed to light the alchemy fire */
  woodForFire: AlchemyRecipeIngredient;
  output: Item;
  outputAmount: number;
}

/** Item ids: wood 601–603 (Oak, Iron Bamboo, Spirit Cypress), herbs 611–616 */
const W = { oak: 601, bamboo: 602, cypress: 603 };
const H = { common: 611, spiritLeaf: 612, spiritGrass: 613, silverLeaf: 614, jadeHerb: 615, ginseng: 616 };

export const ALCHEMY_RECIPES: AlchemyRecipeI[] = [
  {
    id: "qi-pill-1",
    name: "Basic Qi Pill",
    description: "Raises Qi. Consume herbs and wood for fire.",
    recipeLevel: 1,
    ingredients: [{ itemId: H.common, amount: 2 }, { itemId: H.spiritLeaf, amount: 1 }],
    woodForFire: { itemId: W.oak, amount: 1 },
    output: {
      id: 700,
      name: "Basic Qi Pill",
      description: "A simple pill that restores a small amount of Qi.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/potion1.png`,
      value: 1,
      effect: "attack",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-2",
    name: "Spirit Qi Pill",
    description: "Raises more Qi than the basic pill.",
    recipeLevel: 5,
    ingredients: [{ itemId: H.spiritLeaf, amount: 2 }, { itemId: H.spiritGrass, amount: 1 }],
    woodForFire: { itemId: W.oak, amount: 2 },
    output: {
      id: 701,
      name: "Spirit Qi Pill",
      description: "Restores a moderate amount of Qi.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/potion1.png`,
      value: 3,
      effect: "attack",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-3",
    name: "Refined Qi Pill",
    description: "A refined pill for Qi cultivation.",
    recipeLevel: 10,
    ingredients: [{ itemId: H.spiritGrass, amount: 2 }, { itemId: H.silverLeaf, amount: 1 }],
    woodForFire: { itemId: W.bamboo, amount: 1 },
    output: {
      id: 702,
      name: "Refined Qi Pill",
      description: "Restores a good amount of Qi.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/potion1.png`,
      value: 5,
      effect: "attack",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-4",
    name: "Condensation Pill",
    description: "Aids qi condensation. Higher difficulty.",
    recipeLevel: 15,
    ingredients: [{ itemId: H.silverLeaf, amount: 2 }, { itemId: H.jadeHerb, amount: 1 }],
    woodForFire: { itemId: W.bamboo, amount: 2 },
    output: {
      id: 703,
      name: "Condensation Pill",
      description: "Restores a large amount of Qi.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/potion1.png`,
      value: 8,
      effect: "attack",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-5",
    name: "Foundation Pill",
    description: "Strong pill for foundation-stage cultivators.",
    recipeLevel: 20,
    ingredients: [{ itemId: H.jadeHerb, amount: 2 }, { itemId: H.ginseng, amount: 1 }],
    woodForFire: { itemId: W.cypress, amount: 1 },
    output: {
      id: 704,
      name: "Foundation Pill",
      description: "Restores a very large amount of Qi.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/potion1.png`,
      value: 12,
      effect: "attack",
    },
    outputAmount: 1,
  },
  {
    id: "vitality-pill-1",
    name: "Herb Vitality Pill",
    description: "Temporarily strengthens vitality. Uses herbs.",
    recipeLevel: 7,
    ingredients: [{ itemId: H.common, amount: 1 }, { itemId: H.spiritGrass, amount: 2 }],
    woodForFire: { itemId: W.oak, amount: 2 },
    output: {
      id: 710,
      name: "Herb Vitality Pill",
      description: "Temporarily increases max vitality when consumed.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/potion1.png`,
      value: 2,
      effect: "vitality",
    },
    outputAmount: 1,
  },
];
