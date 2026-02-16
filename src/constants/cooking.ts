import type Item from "../interfaces/ItemI";

/** Base path for cooked food images. Place images under public/assets/cooking/ */
const COOKING_ASSETS = "/assets/cooking";

export const COOKING_MAX_LEVEL = 99;

export function getCookingLevel(cookingXP: number): number {
  return Math.max(1, Math.min(COOKING_MAX_LEVEL, 1 + Math.floor(cookingXP / 100)));
}

export interface CookingIngredient {
  itemId: number;
  amount: number;
}

export interface CookingRecipeI {
  id: string;
  name: string;
  description: string;
  /** Fish (and optionally other ingredients) */
  ingredients: CookingIngredient[];
  output: Item;
  outputAmount: number;
}

const FISH = { minnow: 301, carp: 302, tuna: 303, mackerel: 304, puffer: 305 };

export const COOKING_RECIPES: CookingRecipeI[] = [
  {
    id: "cook-carp",
    name: "Grilled River Carp",
    description: "Cooked carp. Restores vitality when used (e.g. in combat).",
    ingredients: [{ itemId: FISH.carp, amount: 1 }],
    output: {
      id: 750,
      name: "Grilled River Carp",
      description: "Restores 3 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-carp.png`,
      value: 3,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-tuna",
    name: "Grilled Jade Tuna",
    description: "Cooked tuna. Restores more vitality.",
    ingredients: [{ itemId: FISH.tuna, amount: 1 }],
    output: {
      id: 751,
      name: "Grilled Jade Tuna",
      description: "Restores 4 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-tuna.png`,
      value: 4,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-mackerel",
    name: "Grilled Silver Mackerel",
    description: "Cooked mackerel.",
    ingredients: [{ itemId: FISH.mackerel, amount: 1 }],
    output: {
      id: 752,
      name: "Grilled Silver Mackerel",
      description: "Restores 3 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-mackerel.png`,
      value: 3,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-puffer",
    name: "Prepared Abyssal Puffer",
    description: "Carefully prepared puffer. Restores more vitality.",
    ingredients: [{ itemId: FISH.puffer, amount: 1 }],
    output: {
      id: 753,
      name: "Prepared Abyssal Puffer",
      description: "Restores 6 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/grilled-puffer.png`,
      value: 6,
      effect: "vitality",
    },
    outputAmount: 1,
  },
  {
    id: "cook-minnow",
    name: "Dried Spirit Minnow",
    description: "Light snack from a spirit minnow. Small vitality restore.",
    ingredients: [{ itemId: FISH.minnow, amount: 1 }],
    output: {
      id: 754,
      name: "Dried Spirit Minnow",
      description: "Restores 2 vitality when used.",
      price: 0,
      quantity: 1,
      picture: `${COOKING_ASSETS}/dried-minnow.png`,
      value: 2,
      effect: "vitality",
    },
    outputAmount: 1,
  },
];
