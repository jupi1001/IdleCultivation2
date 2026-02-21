import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";

/** Base path for forging images. Subfolders: bar/, sword/, helmet/, body/. Place under public/assets/forging/ */
const FORGING_ASSETS = "/assets/forging";

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

/** Refine raw ore into bars (consumes ore only). tier used for grouping in UI. */
export interface RefineRecipeI {
  id: string;
  name: string;
  description: string;
  tier: string;
  ore: ForgingIngredient;
  output: Item;
  outputAmount: number;
}

/** Craft bars into weapon or armour. tier used for grouping in UI. */
export interface CraftRecipeI {
  id: string;
  name: string;
  description: string;
  tier: string;
  bars: ForgingIngredient[];
  output: Item & { equipmentSlot: EquipmentSlot };
  outputAmount: number;
}

/** Tier display order for grouping refine + craft by ore tier. */
export const FORGING_TIER_ORDER: string[] = [
  "Copper",
  "Iron",
  "Spirit",
  "Tin",
  "Jade",
  "Silver",
  "Gold",
  "Obsidian",
  "Thunder Crystal",
  "Star Iron",
  "Voidstone",
  "Dragonbone",
  "Celestial",
];

const ORE = {
  copper: 501,
  iron: 502,
  spirit: 503,
  tin: 504,
  jade: 505,
  silver: 506,
  gold: 507,
  thunder: 508,
  obsidian: 509,
  starIron: 510,
  voidstone: 511,
  dragonbone: 512,
  celestial: 513,
};

const BAR = {
  copper: 801,
  iron: 802,
  spirit: 803,
  tin: 804,
  jade: 805,
  silver: 806,
  gold: 807,
  thunder: 808,
  obsidian: 809,
  starIron: 810,
  voidstone: 811,
  dragonbone: 812,
  celestial: 813,
};

/** Bar items (refined from ore). Icons in /assets/forging/bar/ use -bar.webp. */
export const FORGE_BAR_ITEMS: Item[] = [
  { id: BAR.copper, name: "Copper Bar", description: "Refined copper.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/copper-bar.webp`, value: 0 },
  { id: BAR.iron, name: "Iron Bar", description: "Refined iron.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/iron-bar.webp`, value: 0 },
  { id: BAR.spirit, name: "Spirit Bar", description: "Condensed spirit bar.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/spirit-bar.webp`, value: 0 },
  { id: BAR.tin, name: "Tin Bar", description: "Refined tin.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/tin-bar.webp`, value: 0 },
  { id: BAR.jade, name: "Jade Bar", description: "Polished jade bar.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/jade-bar.webp`, value: 0 },
  { id: BAR.silver, name: "Silver Bar", description: "Refined silver.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/silver-bar.webp`, value: 0 },
  { id: BAR.gold, name: "Gold Bar", description: "Refined gold.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/gold-bar.webp`, value: 0 },
  { id: BAR.thunder, name: "Thunder Crystal Bar", description: "Crystal fused with lightning Qi.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/thunder-crystal-bar.webp`, value: 0 },
  { id: BAR.obsidian, name: "Obsidian Bar", description: "Forged volcanic glass.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/obsidian-bar.webp`, value: 0 },
  { id: BAR.starIron, name: "Star Iron Bar", description: "Meteor iron bar.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/star-iron-bar.webp`, value: 0 },
  { id: BAR.voidstone, name: "Voidstone Bar", description: "Condensed voidstone.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/voidstone-bar.webp`, value: 0 },
  { id: BAR.dragonbone, name: "Dragonbone Bar", description: "Reinforced dragonbone.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/dragonbone-bar.webp`, value: 0 },
  { id: BAR.celestial, name: "Celestial Bar", description: "Heavenly Qi condensed.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/celestial-bar.webp`, value: 0 },
];

export const REFINE_RECIPES: RefineRecipeI[] = [
  { id: "refine-copper", name: "Refine Copper Bar", description: "Smelt copper ore to produce a copper bar.", tier: "Copper", ore: { itemId: ORE.copper, amount: 1 }, output: FORGE_BAR_ITEMS[0], outputAmount: 1 },
  { id: "refine-iron", name: "Refine Iron Bar", description: "Smelt iron ore to produce an iron bar.", tier: "Iron", ore: { itemId: ORE.iron, amount: 1 }, output: FORGE_BAR_ITEMS[1], outputAmount: 1 },
  { id: "refine-spirit", name: "Refine Spirit Bar", description: "Condense spirit stones into a spirit bar.", tier: "Spirit", ore: { itemId: ORE.spirit, amount: 3 }, output: FORGE_BAR_ITEMS[2], outputAmount: 1 },
  { id: "refine-tin", name: "Refine Tin Bar", description: "Smelt tin ore into a tin bar.", tier: "Tin", ore: { itemId: ORE.tin, amount: 1 }, output: FORGE_BAR_ITEMS[3], outputAmount: 1 },
  { id: "refine-jade", name: "Refine Jade Bar", description: "Polish jade ore into a jade bar.", tier: "Jade", ore: { itemId: ORE.jade, amount: 1 }, output: FORGE_BAR_ITEMS[4], outputAmount: 1 },
  { id: "refine-silver", name: "Refine Silver Bar", description: "Smelt silver ore into a silver bar.", tier: "Silver", ore: { itemId: ORE.silver, amount: 1 }, output: FORGE_BAR_ITEMS[5], outputAmount: 1 },
  { id: "refine-gold", name: "Refine Gold Bar", description: "Smelt gold ore into a gold bar.", tier: "Gold", ore: { itemId: ORE.gold, amount: 1 }, output: FORGE_BAR_ITEMS[6], outputAmount: 1 },
  { id: "refine-thunder", name: "Refine Thunder Crystal Bar", description: "Fuse thunder crystals into a bar.", tier: "Thunder Crystal", ore: { itemId: ORE.thunder, amount: 2 }, output: FORGE_BAR_ITEMS[7], outputAmount: 1 },
  { id: "refine-obsidian", name: "Refine Obsidian Bar", description: "Forge obsidian shards into a bar.", tier: "Obsidian", ore: { itemId: ORE.obsidian, amount: 2 }, output: FORGE_BAR_ITEMS[8], outputAmount: 1 },
  { id: "refine-star-iron", name: "Refine Star Iron Bar", description: "Work star iron into a bar.", tier: "Star Iron", ore: { itemId: ORE.starIron, amount: 2 }, output: FORGE_BAR_ITEMS[9], outputAmount: 1 },
  { id: "refine-voidstone", name: "Refine Voidstone Bar", description: "Condense voidstone into a bar.", tier: "Voidstone", ore: { itemId: ORE.voidstone, amount: 2 }, output: FORGE_BAR_ITEMS[10], outputAmount: 1 },
  { id: "refine-dragonbone", name: "Refine Dragonbone Bar", description: "Reinforce dragonbone ore into a bar.", tier: "Dragonbone", ore: { itemId: ORE.dragonbone, amount: 3 }, output: FORGE_BAR_ITEMS[11], outputAmount: 1 },
  { id: "refine-celestial", name: "Refine Celestial Bar", description: "Condense celestial crystals into a bar.", tier: "Celestial", ore: { itemId: ORE.celestial, amount: 3 }, output: FORGE_BAR_ITEMS[12], outputAmount: 1 },
];

function mkWeapon(id: number, name: string, desc: string, barId: number, barAmount: number, tier: string): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [{ itemId: barId, amount: barAmount }],
    output: { id, name, description: desc, price: 0, quantity: 1, picture: `${FORGING_ASSETS}/sword/${tier.toLowerCase().replace(/\s+/g, "-")}-sword.webp`, equipmentSlot: "combatTechnique" as EquipmentSlot },
    outputAmount: 1,
  };
}

function mkHelmet(id: number, name: string, desc: string, barId: number, barAmount: number, tier: string): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [{ itemId: barId, amount: barAmount }],
    output: { id, name, description: desc, price: 0, quantity: 1, picture: `${FORGING_ASSETS}/helmet/${tier.toLowerCase().replace(/\s+/g, "-")}-helmet.webp`, equipmentSlot: "helmet" as EquipmentSlot },
    outputAmount: 1,
  };
}

function mkBody(id: number, name: string, desc: string, barId: number, barAmount: number, tier: string): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [{ itemId: barId, amount: barAmount }],
    output: { id, name, description: desc, price: 0, quantity: 1, picture: `${FORGING_ASSETS}/body/${tier.toLowerCase().replace(/\s+/g, "-")}-body.webp`, equipmentSlot: "body" as EquipmentSlot },
    outputAmount: 1,
  };
}

/** Craft recipes: bars → weapon or armour. Grouped by tier in UI. Level-50 tier has Obsidian (defensive) and Thunder (offensive) focus. */
export const CRAFT_RECIPES: CraftRecipeI[] = [
  // Copper
  mkWeapon(901, "Copper Sword", "A sturdy copper blade.", BAR.copper, 2, "Copper"),
  mkHelmet(911, "Copper Helmet", "A copper helmet.", BAR.copper, 3, "Copper"),
  mkBody(921, "Copper Chestplate", "Copper body armour.", BAR.copper, 4, "Copper"),
  // Iron
  mkWeapon(902, "Iron Sword", "A sharp iron blade.", BAR.iron, 3, "Iron"),
  mkHelmet(912, "Iron Helmet", "An iron helmet.", BAR.iron, 4, "Iron"),
  mkBody(922, "Iron Chestplate", "Iron body armour.", BAR.iron, 5, "Iron"),
  // Spirit
  mkWeapon(903, "Spirit Sword", "A blade touched by spirit energy.", BAR.spirit, 4, "Spirit"),
  mkHelmet(913, "Spirit Helmet", "Helmet infused with Qi.", BAR.spirit, 5, "Spirit"),
  mkBody(923, "Spirit Chestplate", "Spirit-reinforced armour.", BAR.spirit, 6, "Spirit"),
  // Tin
  mkWeapon(904, "Tin Blade", "Light tin weapon.", BAR.tin, 2, "Tin"),
  mkHelmet(914, "Tin Helmet", "Tin head protection.", BAR.tin, 3, "Tin"),
  mkBody(924, "Tin Chestplate", "Tin body armour.", BAR.tin, 4, "Tin"),
  // Jade
  mkWeapon(905, "Jade Sabre", "Jade blade for talismans.", BAR.jade, 3, "Jade"),
  mkHelmet(915, "Jade Circlet", "Jade headpiece.", BAR.jade, 4, "Jade"),
  mkBody(925, "Jade Vest", "Jade-reinforced vest.", BAR.jade, 5, "Jade"),
  // Silver
  mkWeapon(906, "Silver Rapier", "Conductive silver blade.", BAR.silver, 3, "Silver"),
  mkHelmet(916, "Silver Helm", "Silver helmet.", BAR.silver, 4, "Silver"),
  mkBody(926, "Silver Cuirass", "Silver body armour.", BAR.silver, 5, "Silver"),
  // Gold
  mkWeapon(907, "Gold Sword", "Noble gold blade.", BAR.gold, 4, "Gold"),
  mkHelmet(917, "Gold Helm", "Gold helmet.", BAR.gold, 5, "Gold"),
  mkBody(927, "Gold Chestplate", "Gold body armour.", BAR.gold, 6, "Gold"),
  // Obsidian (defensive focus: strong armour, lighter weapon)
  mkWeapon(908, "Obsidian Dagger", "Sharp but light obsidian blade.", BAR.obsidian, 2, "Obsidian"),
  mkHelmet(918, "Obsidian Great Helm", "Heavy obsidian helmet.", BAR.obsidian, 5, "Obsidian"),
  mkBody(928, "Obsidian Bulwark", "Heavy obsidian body armour.", BAR.obsidian, 6, "Obsidian"),
  // Thunder Crystal (offensive focus: strong weapon, lighter armour)
  mkWeapon(909, "Thunder Blade", "Crackling lightning weapon.", BAR.thunder, 5, "Thunder Crystal"),
  mkHelmet(919, "Thunder Crest", "Light helm with thunder Qi.", BAR.thunder, 3, "Thunder Crystal"),
  mkBody(929, "Thunder Guard", "Light armour with thunder resonance.", BAR.thunder, 4, "Thunder Crystal"),
  // Star Iron
  mkWeapon(910, "Star Iron Sword", "Enchantment-holding blade.", BAR.starIron, 4, "Star Iron"),
  mkHelmet(920, "Star Iron Helm", "Star iron helmet.", BAR.starIron, 5, "Star Iron"),
  mkBody(930, "Star Iron Chestplate", "Star iron body armour.", BAR.starIron, 6, "Star Iron"),
  // Voidstone
  mkWeapon(940, "Void Edge", "Light-bending blade.", BAR.voidstone, 4, "Voidstone"),
  mkHelmet(941, "Voidstone Helm", "Voidstone helmet.", BAR.voidstone, 5, "Voidstone"),
  mkBody(942, "Voidstone Cuirass", "Voidstone body armour.", BAR.voidstone, 6, "Voidstone"),
  // Dragonbone
  mkWeapon(943, "Dragonbone Blade", "Blade from dragon strata.", BAR.dragonbone, 5, "Dragonbone"),
  mkHelmet(944, "Dragonbone Helm", "Dragonbone helmet.", BAR.dragonbone, 6, "Dragonbone"),
  mkBody(945, "Dragonbone Armour", "Dragonbone body armour.", BAR.dragonbone, 7, "Dragonbone"),
  // Celestial
  mkWeapon(946, "Celestial Sword", "Radiant heavenly blade.", BAR.celestial, 6, "Celestial"),
  mkHelmet(947, "Celestial Crown", "Celestial helmet.", BAR.celestial, 7, "Celestial"),
  mkBody(948, "Celestial Plate", "Celestial body armour.", BAR.celestial, 8, "Celestial"),
];

/** All items that can appear from forging (bars + crafted gear) for lookup */
export const FORGE_OUTPUT_ITEMS: Item[] = [
  ...FORGE_BAR_ITEMS,
  ...CRAFT_RECIPES.map((r) => r.output),
];
