import type Item from "../interfaces/ItemI";
import type { EquipmentSlot } from "../types/EquipmentSlot";

/** Base path for forging images. Subfolders: bar/, sword/, helmet/, body/. Place under public/assets/forging/ */
const FORGING_ASSETS = "/assets/forging";

/** Max display level in left-panel card */
export const FORGING_MAX_LEVEL = 120;

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
  if (level >= FORGING_MAX_LEVEL) return 0;
  return Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_EXPONENT));
}

/** Level from total XP (backloaded curve). */
export function getForgingLevel(forgingXP: number): number {
  const total = Math.max(0, Math.floor(forgingXP));
  let level = 1;
  while (level < FORGING_MAX_LEVEL && total >= totalXpForLevel(level + 1)) {
    level++;
  }
  return level;
}

export interface ForgingLevelInfo {
  level: number;
  xpInLevel: number;
  xpRequiredForNext: number;
  totalXp: number;
}

export function getForgingLevelInfo(totalXp: number): ForgingLevelInfo {
  const total = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (level < FORGING_MAX_LEVEL && total >= totalXpForLevel(level + 1)) {
    level++;
  }
  const xpInLevel = total - totalXpForLevel(level);
  const xpRequiredForNext = xpRequiredForNextLevel(level);
  return { level, xpInLevel, xpRequiredForNext, totalXp: total };
}

/** Tier index 0..N-1 for XP scaling. Use FORGING_TIER_ORDER.indexOf(tier). */
export function getForgingTierIndex(tier: string): number {
  const i = FORGING_TIER_ORDER.indexOf(tier);
  return i >= 0 ? i : 0;
}

/** XP per refine; scales by tier (early ore = less, celestial = more). */
export function getForgingXPRefine(tierIndex: number): number {
  return Math.max(1, 4 + 3 * tierIndex);
}

/** XP per craft (weapon/armour); scales by tier. */
export function getForgingXPCraft(tierIndex: number): number {
  return Math.max(1, 6 + 4 * tierIndex);
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
export type CraftEquipmentSlot = Exclude<EquipmentSlot, "qiTechnique" | "combatTechnique">;

export interface CraftRecipeI {
  id: string;
  name: string;
  description: string;
  tier: string;
  bars: ForgingIngredient[];
  output: Item & { equipmentSlot: CraftEquipmentSlot };
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
  "Ascendant",
  "Karmic",
  "Immortal",
  "Dao",
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
  ascendant: 514,
  karmic: 515,
  immortal: 516,
  dao: 517,
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
  ascendant: 814,
  karmic: 815,
  immortal: 816,
  dao: 817,
};

/** Bar items (refined from ore). Icons in /assets/forging/bar/ use -bar.webp. */
export const FORGE_BAR_ITEMS: Item[] = [
  { kind: "material", id: BAR.copper, name: "Copper Bar", description: "Refined copper.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/copper-bar.webp` },
  { kind: "material", id: BAR.iron, name: "Iron Bar", description: "Refined iron.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/iron-bar.webp` },
  { kind: "material", id: BAR.spirit, name: "Spirit Bar", description: "Condensed spirit bar.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/spirit-bar.webp` },
  { kind: "material", id: BAR.tin, name: "Tin Bar", description: "Refined tin.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/tin-bar.webp` },
  { kind: "material", id: BAR.jade, name: "Jade Bar", description: "Polished jade bar.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/jade-bar.webp` },
  { kind: "material", id: BAR.silver, name: "Silver Bar", description: "Refined silver.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/silver-bar.webp` },
  { kind: "material", id: BAR.gold, name: "Gold Bar", description: "Refined gold.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/gold-bar.webp` },
  { kind: "material", id: BAR.thunder, name: "Thunder Crystal Bar", description: "Crystal fused with lightning Qi.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/thunder-crystal-bar.webp` },
  { kind: "material", id: BAR.obsidian, name: "Obsidian Bar", description: "Forged volcanic glass.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/obsidian-bar.webp` },
  { kind: "material", id: BAR.starIron, name: "Star Iron Bar", description: "Meteor iron bar.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/star-iron-bar.webp` },
  { kind: "material", id: BAR.voidstone, name: "Voidstone Bar", description: "Condensed voidstone.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/voidstone-bar.webp` },
  { kind: "material", id: BAR.dragonbone, name: "Dragonbone Bar", description: "Reinforced dragonbone.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/dragonbone-bar.webp` },
  { kind: "material", id: BAR.celestial, name: "Celestial Bar", description: "Heavenly Qi condensed.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/celestial-bar.webp` },
  { kind: "material", id: BAR.ascendant, name: "Ascendant Bar", description: "Refined ascendant ore. Used to enhance Celestial gear.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/ascendant-bar.webp` },
  { kind: "material", id: BAR.karmic, name: "Karmic Bar", description: "Refined karmic crystal. Used to enhance Celestial gear.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/karmic-bar.webp` },
  { kind: "material", id: BAR.immortal, name: "Immortal Bar", description: "Refined immortal stone. Used to enhance Celestial gear.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/immortal-bar.webp` },
  { kind: "material", id: BAR.dao, name: "Dao Bar", description: "Refined Dao fragment. Used to enhance Celestial gear.", price: 0, quantity: 1, picture: `${FORGING_ASSETS}/bar/dao-bar.webp` },
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
  { id: "refine-ascendant", name: "Refine Ascendant Bar", description: "Smelt ascendant ore into a bar. Requires reincarnation.", tier: "Ascendant", ore: { itemId: ORE.ascendant, amount: 3 }, output: FORGE_BAR_ITEMS[13], outputAmount: 1 },
  { id: "refine-karmic", name: "Refine Karmic Bar", description: "Refine karmic crystal into a bar. Requires reincarnation.", tier: "Karmic", ore: { itemId: ORE.karmic, amount: 3 }, output: FORGE_BAR_ITEMS[14], outputAmount: 1 },
  { id: "refine-immortal", name: "Refine Immortal Bar", description: "Forge immortal stone into a bar. Requires reincarnation.", tier: "Immortal", ore: { itemId: ORE.immortal, amount: 3 }, output: FORGE_BAR_ITEMS[15], outputAmount: 1 },
  { id: "refine-dao", name: "Refine Dao Bar", description: "Condense Dao fragments into a bar. Requires reincarnation.", tier: "Dao", ore: { itemId: ORE.dao, amount: 3 }, output: FORGE_BAR_ITEMS[16], outputAmount: 1 },
];

function mkWeapon(
  id: number,
  name: string,
  desc: string,
  barId: number,
  barAmount: number,
  tier: string,
  attackBonus: number
): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [{ itemId: barId, amount: barAmount }],
    output: {
      kind: "equipment",
      id,
      name,
      description: desc,
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/sword/${tier.toLowerCase().replace(/\s+/g, "-")}-sword.webp`,
      equipmentSlot: "sword" as CraftEquipmentSlot,
      attackBonus,
    },
    outputAmount: 1,
  };
}

function mkHelmet(
  id: number,
  name: string,
  desc: string,
  barId: number,
  barAmount: number,
  tier: string,
  defenseBonus: number,
  vitalityBonus: number
): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [{ itemId: barId, amount: barAmount }],
    output: {
      kind: "equipment",
      id,
      name,
      description: desc,
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/helmet/${tier.toLowerCase().replace(/\s+/g, "-")}-helmet.webp`,
      equipmentSlot: "helmet" as CraftEquipmentSlot,
      defenseBonus,
      vitalityBonus,
    },
    outputAmount: 1,
  };
}

function mkBody(
  id: number,
  name: string,
  desc: string,
  barId: number,
  barAmount: number,
  tier: string,
  defenseBonus: number,
  vitalityBonus: number
): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [{ itemId: barId, amount: barAmount }],
    output: {
      kind: "equipment",
      id,
      name,
      description: desc,
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/body/${tier.toLowerCase().replace(/\s+/g, "-")}-body.webp`,
      equipmentSlot: "body" as CraftEquipmentSlot,
      defenseBonus,
      vitalityBonus,
    },
    outputAmount: 1,
  };
}

/** Enhancement: 1 Celestial Bar + 1 enhancement bar → enhanced Celestial gear (same slot, higher stats). */
function mkEnhanceWeapon(
  id: number,
  name: string,
  desc: string,
  enhancementBarId: number,
  tier: string,
  attackBonus: number
): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [
      { itemId: BAR.celestial, amount: 1 },
      { itemId: enhancementBarId, amount: 1 },
    ],
    output: {
      kind: "equipment",
      id,
      name,
      description: desc,
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/sword/${tier.toLowerCase().replace(/\s+/g, "-")}-enhanced-sword.webp`,
      equipmentSlot: "sword" as CraftEquipmentSlot,
      attackBonus,
    },
    outputAmount: 1,
  };
}

function mkEnhanceHelmet(
  id: number,
  name: string,
  desc: string,
  enhancementBarId: number,
  tier: string,
  defenseBonus: number,
  vitalityBonus: number
): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [
      { itemId: BAR.celestial, amount: 1 },
      { itemId: enhancementBarId, amount: 1 },
    ],
    output: {
      kind: "equipment",
      id,
      name,
      description: desc,
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/helmet/${tier.toLowerCase().replace(/\s+/g, "-")}-enhanced-helmet.webp`,
      equipmentSlot: "helmet" as CraftEquipmentSlot,
      defenseBonus,
      vitalityBonus,
    },
    outputAmount: 1,
  };
}

function mkEnhanceBody(
  id: number,
  name: string,
  desc: string,
  enhancementBarId: number,
  tier: string,
  defenseBonus: number,
  vitalityBonus: number
): CraftRecipeI {
  return {
    id: `craft-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description: desc,
    tier,
    bars: [
      { itemId: BAR.celestial, amount: 1 },
      { itemId: enhancementBarId, amount: 1 },
    ],
    output: {
      kind: "equipment",
      id,
      name,
      description: desc,
      price: 0,
      quantity: 1,
      picture: `${FORGING_ASSETS}/body/${tier.toLowerCase().replace(/\s+/g, "-")}-enhanced-body.webp`,
      equipmentSlot: "body" as CraftEquipmentSlot,
      defenseBonus,
      vitalityBonus,
    },
    outputAmount: 1,
  };
}

/** Craft recipes: bars → weapon or armour. Sword gives attack; helmet & body give defense and vitality. */
export const CRAFT_RECIPES: CraftRecipeI[] = [
  // Copper
  mkWeapon(901, "Copper Sword", "A sturdy copper blade.", BAR.copper, 2, "Copper", 2),
  mkHelmet(911, "Copper Helmet", "A copper helmet.", BAR.copper, 3, "Copper", 3, 3),
  mkBody(921, "Copper Chestplate", "Copper body armour.", BAR.copper, 4, "Copper", 4, 4),
  // Iron
  mkWeapon(902, "Iron Sword", "A sharp iron blade.", BAR.iron, 3, "Iron", 3),
  mkHelmet(912, "Iron Helmet", "An iron helmet.", BAR.iron, 4, "Iron", 4, 4),
  mkBody(922, "Iron Chestplate", "Iron body armour.", BAR.iron, 5, "Iron", 5, 5),
  // Spirit
  mkWeapon(903, "Spirit Sword", "A blade touched by spirit energy.", BAR.spirit, 4, "Spirit", 4),
  mkHelmet(913, "Spirit Helmet", "Helmet infused with Qi.", BAR.spirit, 5, "Spirit", 5, 5),
  mkBody(923, "Spirit Chestplate", "Spirit-reinforced armour.", BAR.spirit, 6, "Spirit", 6, 6),
  // Tin
  mkWeapon(904, "Tin Blade", "Light tin weapon.", BAR.tin, 2, "Tin", 2),
  mkHelmet(914, "Tin Helmet", "Tin head protection.", BAR.tin, 3, "Tin", 3, 3),
  mkBody(924, "Tin Chestplate", "Tin body armour.", BAR.tin, 4, "Tin", 4, 4),
  // Jade
  mkWeapon(905, "Jade Sabre", "Jade blade for talismans.", BAR.jade, 3, "Jade", 3),
  mkHelmet(915, "Jade Circlet", "Jade headpiece.", BAR.jade, 4, "Jade", 4, 4),
  mkBody(925, "Jade Vest", "Jade-reinforced vest.", BAR.jade, 5, "Jade", 5, 5),
  // Silver
  mkWeapon(906, "Silver Rapier", "Conductive silver blade.", BAR.silver, 3, "Silver", 3),
  mkHelmet(916, "Silver Helm", "Silver helmet.", BAR.silver, 4, "Silver", 4, 4),
  mkBody(926, "Silver Cuirass", "Silver body armour.", BAR.silver, 5, "Silver", 5, 5),
  // Gold
  mkWeapon(907, "Gold Sword", "Noble gold blade.", BAR.gold, 4, "Gold", 4),
  mkHelmet(917, "Gold Helm", "Gold helmet.", BAR.gold, 5, "Gold", 5, 5),
  mkBody(927, "Gold Chestplate", "Gold body armour.", BAR.gold, 6, "Gold", 6, 6),
  // Obsidian (defensive focus: strong armour, lighter weapon)
  mkWeapon(908, "Obsidian Dagger", "Sharp but light obsidian blade.", BAR.obsidian, 2, "Obsidian", 2),
  mkHelmet(918, "Obsidian Great Helm", "Heavy obsidian helmet.", BAR.obsidian, 5, "Obsidian", 5, 5),
  mkBody(928, "Obsidian Bulwark", "Heavy obsidian body armour.", BAR.obsidian, 6, "Obsidian", 6, 6),
  // Thunder Crystal (offensive focus: strong weapon, lighter armour)
  mkWeapon(909, "Thunder Blade", "Crackling lightning weapon.", BAR.thunder, 5, "Thunder Crystal", 5),
  mkHelmet(919, "Thunder Crest", "Light helm with thunder Qi.", BAR.thunder, 3, "Thunder Crystal", 3, 3),
  mkBody(929, "Thunder Guard", "Light armour with thunder resonance.", BAR.thunder, 4, "Thunder Crystal", 4, 4),
  // Star Iron
  mkWeapon(910, "Star Iron Sword", "Enchantment-holding blade.", BAR.starIron, 4, "Star Iron", 4),
  mkHelmet(920, "Star Iron Helm", "Star iron helmet.", BAR.starIron, 5, "Star Iron", 5, 5),
  mkBody(930, "Star Iron Chestplate", "Star iron body armour.", BAR.starIron, 6, "Star Iron", 6, 6),
  // Voidstone
  mkWeapon(940, "Void Edge", "Light-bending blade.", BAR.voidstone, 4, "Voidstone", 4),
  mkHelmet(941, "Voidstone Helm", "Voidstone helmet.", BAR.voidstone, 5, "Voidstone", 5, 5),
  mkBody(942, "Voidstone Cuirass", "Voidstone body armour.", BAR.voidstone, 6, "Voidstone", 6, 6),
  // Dragonbone
  mkWeapon(943, "Dragonbone Blade", "Blade from dragon strata.", BAR.dragonbone, 5, "Dragonbone", 5),
  mkHelmet(944, "Dragonbone Helm", "Dragonbone helmet.", BAR.dragonbone, 6, "Dragonbone", 6, 6),
  mkBody(945, "Dragonbone Armour", "Dragonbone body armour.", BAR.dragonbone, 7, "Dragonbone", 7, 7),
  // Celestial
  mkWeapon(946, "Celestial Sword", "Radiant heavenly blade.", BAR.celestial, 6, "Celestial", 6),
  mkHelmet(947, "Celestial Crown", "Celestial helmet.", BAR.celestial, 7, "Celestial", 7, 7),
  mkBody(948, "Celestial Plate", "Celestial body armour.", BAR.celestial, 8, "Celestial", 8, 8),
  // Ascendant enhancement (L105)
  mkEnhanceWeapon(949, "Ascendant Celestial Sword", "Celestial blade enhanced with ascendant ore.", BAR.ascendant, "Ascendant", 7),
  mkEnhanceHelmet(950, "Ascendant Celestial Crown", "Celestial crown enhanced with ascendant ore.", BAR.ascendant, "Ascendant", 8, 8),
  mkEnhanceBody(951, "Ascendant Celestial Plate", "Celestial plate enhanced with ascendant ore.", BAR.ascendant, "Ascendant", 9, 9),
  // Karmic enhancement (L110)
  mkEnhanceWeapon(952, "Karmic Celestial Sword", "Celestial blade enhanced with karmic crystal.", BAR.karmic, "Karmic", 8),
  mkEnhanceHelmet(953, "Karmic Celestial Crown", "Celestial crown enhanced with karmic crystal.", BAR.karmic, "Karmic", 9, 9),
  mkEnhanceBody(954, "Karmic Celestial Plate", "Celestial plate enhanced with karmic crystal.", BAR.karmic, "Karmic", 10, 10),
  // Immortal enhancement (L115)
  mkEnhanceWeapon(955, "Immortal Celestial Sword", "Celestial blade enhanced with immortal stone.", BAR.immortal, "Immortal", 9),
  mkEnhanceHelmet(956, "Immortal Celestial Crown", "Celestial crown enhanced with immortal stone.", BAR.immortal, "Immortal", 10, 10),
  mkEnhanceBody(957, "Immortal Celestial Plate", "Celestial plate enhanced with immortal stone.", BAR.immortal, "Immortal", 11, 11),
  // Dao enhancement (L120)
  mkEnhanceWeapon(958, "Dao Celestial Sword", "Celestial blade enhanced with Dao fragments.", BAR.dao, "Dao", 10),
  mkEnhanceHelmet(959, "Dao Celestial Crown", "Celestial crown enhanced with Dao fragments.", BAR.dao, "Dao", 11, 11),
  mkEnhanceBody(960, "Dao Celestial Plate", "Celestial plate enhanced with Dao fragments.", BAR.dao, "Dao", 12, 12),
];

/** All items that can appear from forging (bars + crafted gear) for lookup */
export const FORGE_OUTPUT_ITEMS: Item[] = [
  ...FORGE_BAR_ITEMS,
  ...CRAFT_RECIPES.map((r) => r.output),
];
