import type { MissionI } from "../interfaces/MissionI";
import type Item from "../interfaces/ItemI";
import { ALCHEMY_ASSETS } from "./alchemy";

/** Expedition-only items (techniques, herbs). Each obtainable from one mission only. */
export const EXPEDITION_ITEMS_BY_ID: Record<number, Item> = {
  500: {
    id: 500,
    name: "Spirit Herb",
    description: "A herb found on Immortals Island. Used in alchemy.",
    quantity: 1,
    price: 0,
    picture: `${ALCHEMY_ASSETS}/potion1.png`,
  },
  501: {
    id: 501,
    name: "Island Qi Method",
    description: "Qi technique from the island. +0.3 Qi/s when meditating.",
    quantity: 1,
    price: 0,
    picture: `${ALCHEMY_ASSETS}/potion1.png`,
    equipmentSlot: "qiTechnique",
    qiGainBonus: 0.3,
  },
  502: {
    id: 502,
    name: "Explorer's Strike",
    description: "Combat technique from the island.",
    quantity: 1,
    price: 0,
    picture: `${ALCHEMY_ASSETS}/potion1.png`,
    equipmentSlot: "combatTechnique",
  },
  503: {
    id: 503,
    name: "Ancient Circulation",
    description: "Rare Qi technique from the island. +0.4 Qi/s when meditating.",
    quantity: 1,
    price: 0,
    picture: `${ALCHEMY_ASSETS}/potion1.png`,
    equipmentSlot: "qiTechnique",
    qiGainBonus: 0.4,
  },
};

/** Missions for Immortals Island. Each has its own spirit stone range and rare loot pool. */
export const EXPEDITION_MISSIONS: MissionI[] = [
  {
    id: 1,
    name: "Shore Patrol",
    description: "Scout the shores of Immortals Island. Short and safe.",
    durationSeconds: 30,
    requiredRealm: { realmId: "Mortal", realmLevel: 0 },
    spiritStonesMin: 1,
    spiritStonesMax: 5,
    rareDrops: [{ itemId: 500, chance: 0.2 }],
  },
  {
    id: 2,
    name: "Spirit Spring",
    description: "Meditate near a spirit spring on the island.",
    durationSeconds: 60,
    requiredRealm: { realmId: "Qi Condensation", realmLevel: 1 },
    spiritStonesMin: 5,
    spiritStonesMax: 15,
    rareDrops: [{ itemId: 501, chance: 0.15 }],
  },
  {
    id: 3,
    name: "Ruin Explorer",
    description: "Explore ancient ruins for techniques and resources.",
    durationSeconds: 120,
    requiredRealm: { realmId: "Qi Condensation", realmLevel: 3 },
    spiritStonesMin: 15,
    spiritStonesMax: 30,
    rareDrops: [{ itemId: 502, chance: 0.12 }],
  },
  {
    id: 4,
    name: "Peak Ascent",
    description: "Climb to a high peak where rare techniques are said to rest.",
    durationSeconds: 240,
    requiredRealm: { realmId: "Foundation Establishment", realmLevel: 1 },
    spiritStonesMin: 30,
    spiritStonesMax: 60,
    rareDrops: [{ itemId: 503, chance: 0.1 }],
  },
];

export function getExpeditionItem(itemId: number): Item | undefined {
  return EXPEDITION_ITEMS_BY_ID[itemId];
}
