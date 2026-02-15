import { CombatArea } from "../enum/CombatArea";
import type { CultivationPath } from "./cultivationPath";
import EnemyI from "../interfaces/EnemyI";
import FishingAreaI from "../interfaces/FishingAreaI";
import Item from "../interfaces/ItemI";
import SkillI from "../interfaces/SkillI";
import images from "./images";

/** Short descriptions for the Righteous vs Demonic path choice at game start. */
export const pathDescriptions: Record<CultivationPath, { title: string; description: string }> = {
  Righteous:
    { title: "Righteous Path", description: "Walk the path of virtue. Righteous sects and talents will open to you." },
  Demonic:
    { title: "Demonic Path", description: "Embrace the demonic way. Demonic sects and darker talents await." },
};

export const existingShopItemUpgrades: Item[] = [
  {
    id: 1,
    name: "Wooden Spirit Blade",
    description: "A basic spirit weapon",
    price: 500,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
    quantity: 1,
  },
  {
    id: 2,
    name: "Iron Spirit Blade",
    description: "An iron spirit weapon",
    price: 1000,
    picture: "https://www.pokewiki.de/images/thumb/7/72/Sugimori_386.png/250px-Sugimori_386.png",
    quantity: 1,
  },
  {
    id: 3,
    name: "Gold Spirit Blade",
    description: "A gold spirit weapon",
    price: 10000,
    picture: "https://www.pokewiki.de/images/thumb/7/72/Sugimori_386.png/250px-Sugimori_386.png",
    quantity: 1,
  },
];

export const existingShopItems: Item[] = [
  {
    id: 200,
    name: "Qi Pill",
    description: "Pill containing a bit of qi",
    price: 10,
    quantity: 1,
    picture: images.potion1,
    value: 1,
    effect: "attack",
  },
  {
    id: 201,
    name: "Foundation Pill",
    description: "Pill containing a bit of qi",
    price: 100,
    quantity: 1,
    picture: images.potion1,
    value: 10,
    effect: "attack",
  },
];

/** Qi technique equipment - can be bought and equipped in Qi Technique slot */
export const existingShopQiTechniques: Item[] = [
  {
    id: 400,
    name: "Basic Qi Circulation",
    description: "A simple technique. +0.2 Qi/s when meditating.",
    price: 200,
    quantity: 1,
    picture: images.potion1,
    equipmentSlot: "qiTechnique",
    qiGainBonus: 0.2,
  },
  {
    id: 401,
    name: "Spirit Gathering Method",
    description: "Improves qi absorption. +0.5 Qi/s when meditating.",
    price: 600,
    quantity: 1,
    picture: images.potion1,
    equipmentSlot: "qiTechnique",
    qiGainBonus: 0.5,
  },
];

export const existingSkills: SkillI[] = [
  { id: 1, name: "Martial Training", description: "Train combat and face trials" },
  { id: 2, name: "Labour", description: "Earn spirit stones" },
  { id: 3, name: "Meditation", description: "Cultivate qi in solitude" },
  { id: 4, name: "Fishing", description: "Fish in waters for spirit fish" },
  { id: 5, name: "Mining", description: "Mine ores and spirit stones" },
  { id: 6, name: "Gathering", description: "Gather herbs and wood" },
  { id: 7, name: "Cultivation Tree", description: "Unlock permanent talents" },
  { id: 8, name: "Alchemy", description: "Craft pills and elixirs" },
  { id: 9, name: "Forging", description: "Upgrade spirit weapons" },
];

export const enemies: EnemyI[] = [
  {
    id: 1,
    name: "Young Spirit Beast",
    attack: 1,
    defense: 1,
    health: 10,
    location: CombatArea.FARM,
    picture: images.chicken,
    loot: { items: new Array(existingShopItems[0]), weight: [1] },
  },
  {
    id: 2,
    name: "Spirit Beast",
    attack: 3,
    defense: 3,
    health: 20,
    location: CombatArea.FARM,
    picture: images.cow,
    loot: { items: new Array(existingShopItems[0]), weight: [1] },
  },
  {
    id: 3,
    name: "Feral Spirit Beast",
    attack: 2,
    defense: 2,
    health: 15,
    location: CombatArea.FARM,
    picture: images.pig,
    loot: { items: new Array(existingShopItems[0]), weight: [1] },
  },
  {
    id: 4,
    name: "Cave Demon",
    attack: 5,
    defense: 5,
    health: 10,
    location: CombatArea.CAVE,
    picture: images.goblin,
    loot: { items: new Array(existingShopItems[0]), weight: [1] },
  },
];

export const fishingAreaData: FishingAreaI[] = [
  {
    id: 1,
    name: "Village Pond",
    fishingXP: 1,
    fishingXPUnlock: 0,
    fishingDelay: 3000,
    fishingLootIds: [301],
    picture: images.puddle,
  },
  {
    id: 2,
    name: "Small Lake",
    fishingXP: 2,
    fishingXPUnlock: 25,
    fishingDelay: 4000,
    fishingLootIds: [301, 304],
    picture: images.puddle,
  },
  {
    id: 3,
    name: "Spirit River",
    fishingXP: 4,
    fishingXPUnlock: 100,
    fishingDelay: 5000,
    fishingLootIds: [302],
    picture: images.puddle,
  },
  {
    id: 4,
    name: "Spirit Sea",
    fishingXP: 8,
    fishingXPUnlock: 200,
    fishingDelay: 6000,
    fishingLootIds: [302, 303],
    picture: images.puddle,
  },
  {
    id: 5,
    name: "Abyssal Ocean",
    fishingXP: 16,
    fishingXPUnlock: 300,
    fishingDelay: 7000,
    fishingLootIds: [302, 303, 305],
    picture: images.puddle,
  },
];

export const fishTypes: Item[] = [
  {
    id: 301,
    name: "Sardine",
    description: "Very small fish",
    price: 1,
    quantity: 1,
    picture: images.blueFish,
    value: 1,
    effect: "health",
  },
  {
    id: 302,
    name: "Salmon",
    description: "Popular fish for cooking",
    price: 3,
    quantity: 1,
    picture: images.redFish,
    value: 2,
    effect: "health",
  },
  {
    id: 303,
    name: "Tuna",
    description: "Large and flavorful fish",
    price: 5,
    quantity: 1,
    picture: images.purpleFish,
    value: 3,
    effect: "health",
  },
  {
    id: 304,
    name: "Mackerel",
    description: "Rich in omega-3 fatty acids",
    price: 2,
    quantity: 1,
    picture: images.boneFishSmall,
    value: 2,
    effect: "health",
  },
  {
    id: 305,
    name: "Pufferfish",
    description: "Can be poisonous if not prepared correctly",
    price: 7,
    quantity: 1,
    picture: images.pufferFish,
    value: 5,
    effect: "health",
  },
];
