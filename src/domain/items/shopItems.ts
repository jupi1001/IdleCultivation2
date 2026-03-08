/**
 * Shop and black market item definitions (main shop, upgrades, black market).
 */
import type Item from "../../interfaces/ItemI";
import { ALCHEMY_ASSETS } from "../../constants/alchemy";
import { COMBAT_LOOT_QI_PILLS } from "../../constants/alchemy";
import { CRAFT_RECIPES } from "../../constants/forging";

export const existingShopItemUpgrades: Item[] = [
  { ...CRAFT_RECIPES[0].output, price: 500, quantity: 1 },
  { ...CRAFT_RECIPES[3].output, price: 1000, quantity: 1 },
  { ...CRAFT_RECIPES[18].output, price: 10000, quantity: 1 },
];

/** Black market items (e.g. Shadow Bazaar on map) – forbidden or rare wares. */
export const existingBlackMarketItems: Item[] = [
  { id: 500, name: "Forbidden Qi Pill", description: "Unrefined qi from questionable sources. Stronger, riskier.", price: 25, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, value: 3, effect: "attack" },
  { id: 501, name: "Blood Spirit Stone", description: "Spirit stone tinged with demonic essence. No questions asked.", price: 350, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, value: 25, effect: "attack" },
  { id: 502, name: "Veiled Meditation Scroll", description: "A technique not taught in righteous sects. +0.4 Qi/s when meditating.", price: 800, quantity: 1, picture: `${ALCHEMY_ASSETS}/potion1.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 0.4 },
];

export const existingShopItems: Item[] = [
  { ...COMBAT_LOOT_QI_PILLS[0], price: 10, quantity: 1 },
  { ...COMBAT_LOOT_QI_PILLS[4], price: 100, quantity: 1 },
];
