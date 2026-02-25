import type Item from "../interfaces/ItemI";

/** Base path for alchemy/pill images. Place images under public/assets/alchemy/ */
export const ALCHEMY_ASSETS = "/assets/alchemy";

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

/** Wood 601–608, herbs 611–622 (from gathering). */
const W = {
  oak: 601,
  bamboo: 602,
  cypress: 603,
  pine: 604,
  ebony: 605,
  voidWillow: 606,
  dragonAsh: 607,
  celestialBamboo: 608,
};
const H = {
  common: 611,
  spiritLeaf: 612,
  spiritGrass: 613,
  silverLeaf: 614,
  jadeHerb: 615,
  ginseng: 616,
  moonPetal: 617,
  starMoss: 618,
  primordialRoot: 619,
  voidBloom: 620,
  celestialLotus: 621,
  transcendentHerb: 622,
};

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
      picture: `${ALCHEMY_ASSETS}/basic-qi-pill.webp`,
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
      picture: `${ALCHEMY_ASSETS}/spirit-qi-pill.webp`,
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
      picture: `${ALCHEMY_ASSETS}/refined-qi-pill.webp`,
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
      picture: `${ALCHEMY_ASSETS}/condensation-pill.webp`,
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
      picture: `${ALCHEMY_ASSETS}/foundation-pill.webp`,
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
      picture: `${ALCHEMY_ASSETS}/herb-vitality-pill.webp`,
      value: 2,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  // Mid-tier Qi pills (new herbs)
  {
    id: "qi-pill-6",
    name: "Lunar Qi Pill",
    description: "Pill refined under moonlight. Uses Moon Petal and Star Moss.",
    recipeLevel: 25,
    ingredients: [{ itemId: H.moonPetal, amount: 2 }, { itemId: H.starMoss, amount: 1 }, { itemId: H.ginseng, amount: 1 }],
    woodForFire: { itemId: W.pine, amount: 2 },
    output: {
      id: 705,
      name: "Lunar Qi Pill",
      description: "Restores a large amount of Qi. Refined with lunar herbs.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/lunar-qi-pill.webp`,
      value: 15,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-7",
    name: "Stellar Condensation Pill",
    description: "Pill infused with star moss and primordial root.",
    recipeLevel: 28,
    ingredients: [{ itemId: H.starMoss, amount: 2 }, { itemId: H.primordialRoot, amount: 1 }, { itemId: H.jadeHerb, amount: 1 }],
    woodForFire: { itemId: W.ebony, amount: 2 },
    output: {
      id: 706,
      name: "Stellar Condensation Pill",
      description: "Restores a very large amount of Qi.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/stellar-condensation-pill.webp`,
      value: 18,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-8",
    name: "Void-Refined Pill",
    description: "Refined near void energy. Uses Void Bloom and Primordial Root.",
    recipeLevel: 30,
    ingredients: [{ itemId: H.primordialRoot, amount: 2 }, { itemId: H.voidBloom, amount: 1 }, { itemId: H.ginseng, amount: 1 }],
    woodForFire: { itemId: W.voidWillow, amount: 2 },
    output: {
      id: 707,
      name: "Void-Refined Pill",
      description: "Restores a massive amount of Qi. Touched by the void.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/void-refined-pill.webp`,
      value: 22,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-9",
    name: "Celestial Qi Pill",
    description: "Heavenly pill using Celestial Lotus and Void Bloom.",
    recipeLevel: 33,
    ingredients: [{ itemId: H.voidBloom, amount: 2 }, { itemId: H.celestialLotus, amount: 1 }, { itemId: H.moonPetal, amount: 1 }],
    woodForFire: { itemId: W.dragonAsh, amount: 2 },
    output: {
      id: 708,
      name: "Celestial Qi Pill",
      description: "Restores an immense amount of Qi. Heavenly grade.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/celestial-qi-pill.webp`,
      value: 26,
      effect: "qi",
    },
    outputAmount: 1,
  },
  {
    id: "qi-pill-10",
    name: "Transcendent Qi Pill",
    description: "Peak pill using Transcendent Spirit Herb and Celestial Lotus.",
    recipeLevel: 35,
    ingredients: [{ itemId: H.celestialLotus, amount: 2 }, { itemId: H.transcendentHerb, amount: 1 }, { itemId: H.primordialRoot, amount: 1 }],
    woodForFire: { itemId: W.celestialBamboo, amount: 3 },
    output: {
      id: 709,
      name: "Transcendent Qi Pill",
      description: "The pinnacle of Qi pills. Transcendent grade.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/transcendent-qi-pill.webp`,
      value: 32,
      effect: "qi",
    },
    outputAmount: 1,
  },
  // Mid- and high-tier Vitality pills
  {
    id: "vitality-pill-2",
    name: "Spirit Vitality Pill",
    description: "Stronger vitality pill using Silver Leaf and Moon Petal.",
    recipeLevel: 22,
    ingredients: [{ itemId: H.silverLeaf, amount: 1 }, { itemId: H.jadeHerb, amount: 1 }, { itemId: H.moonPetal, amount: 2 }],
    woodForFire: { itemId: W.bamboo, amount: 2 },
    output: {
      id: 711,
      name: "Spirit Vitality Pill",
      description: "Increases max vitality when consumed.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/spirit-vitality-pill.webp`,
      value: 4,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "vitality-pill-3",
    name: "Refined Vitality Pill",
    description: "Vitality pill with Star Moss and high-grade herbs.",
    recipeLevel: 26,
    ingredients: [{ itemId: H.jadeHerb, amount: 1 }, { itemId: H.ginseng, amount: 1 }, { itemId: H.starMoss, amount: 2 }],
    woodForFire: { itemId: W.cypress, amount: 2 },
    output: {
      id: 712,
      name: "Refined Vitality Pill",
      description: "Significantly increases max vitality when consumed.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/refined-vitality-pill.webp`,
      value: 6,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "vitality-pill-4",
    name: "Primordial Vitality Pill",
    description: "Ancient formula using Primordial Root and Void Bloom.",
    recipeLevel: 31,
    ingredients: [{ itemId: H.primordialRoot, amount: 2 }, { itemId: H.voidBloom, amount: 1 }, { itemId: H.starMoss, amount: 1 }],
    woodForFire: { itemId: W.ebony, amount: 2 },
    output: {
      id: 713,
      name: "Primordial Vitality Pill",
      description: "Greatly increases max vitality when consumed.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/primordial-vitality-pill.webp`,
      value: 8,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "vitality-pill-5",
    name: "Transcendent Vitality Pill",
    description: "Peak vitality pill using Celestial Lotus and Transcendent Herb.",
    recipeLevel: 34,
    ingredients: [{ itemId: H.celestialLotus, amount: 2 }, { itemId: H.transcendentHerb, amount: 1 }, { itemId: H.voidBloom, amount: 1 }],
    woodForFire: { itemId: W.dragonAsh, amount: 3 },
    output: {
      id: 714,
      name: "Transcendent Vitality Pill",
      description: "Max vitality increase. Transcendent grade.",
      price: 0,
      quantity: 1,
      picture: `${ALCHEMY_ASSETS}/transcendent-vitality-pill.webp`,
      value: 10,
      effect: "vitality",
    },
    outputAmount: 1,
  },
];

/** Qi pills used as combat loot, ordered by strength (tier 0 = Basic, tier 9 = Transcendent). Maps to combat area tier. */
export const COMBAT_LOOT_QI_PILLS: Item[] = ALCHEMY_RECIPES.filter((r) => r.id.startsWith("qi-pill-"))
  .sort((a, b) => {
    const nA = parseInt(a.id.replace("qi-pill-", ""), 10);
    const nB = parseInt(b.id.replace("qi-pill-", ""), 10);
    return nA - nB;
  })
  .map((r) => r.output);
