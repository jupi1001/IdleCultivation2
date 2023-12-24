import { CombatArea } from "../enum/CombatArea";
import EnemyI from "../interfaces/EnemyI";
import FishingAreaI from "../interfaces/FishingAreaI";
import Item from "../interfaces/ItemI";
import SkillI from "../interfaces/SkillI";
import images from "./images";

export const existingShopItemUpgrades: Item[] = [
  {
    id: 1,
    name: "Wooden Sword",
    description: "A basic sword",
    price: 500,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
    quantity: 1,
  },
  {
    id: 2,
    name: "Iron Sword",
    description: "An iron sword",
    price: 1000,
    picture: "https://www.pokewiki.de/images/thumb/7/72/Sugimori_386.png/250px-Sugimori_386.png",
    quantity: 1,
  },
  {
    id: 3,
    name: "Gold Sword",
    description: "A gold sword",
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

export const existingSkills: SkillI[] = [
  { id: 1, name: "Combat", description: "Train combat" },
  { id: 2, name: "Money", description: "Make money" },
  { id: 3, name: "Fishing", description: "Fish fish" },
  { id: 4, name: "Woodcutting", description: "Cut wood" },
];

export const enemies: EnemyI[] = [
  {
    id: 1,
    name: "Chicken",
    attack: 1,
    defense: 1,
    health: 10,
    location: CombatArea.FARM,
    picture: images.chicken,
    loot: { items: new Array(existingShopItems[0]), weight: [1] },
  },
  {
    id: 2,
    name: "Cow",
    attack: 3,
    defense: 3,
    health: 20,
    location: CombatArea.FARM,
    picture: images.cow,
    loot: { items: new Array(existingShopItems[0]), weight: [1] },
  },
  {
    id: 3,
    name: "Pig",
    attack: 2,
    defense: 2,
    health: 15,
    location: CombatArea.FARM,
    picture: images.pig,
    loot: { items: new Array(existingShopItems[0]), weight: [1] },
  },
  {
    id: 4,
    name: "Goblin",
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
    name: "Puddle",
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
    fishingLootIds: [301],
    picture: images.puddle,
  },
  {
    id: 3,
    name: "River",
    fishingXP: 4,
    fishingXPUnlock: 100,
    fishingDelay: 5000,
    fishingLootIds: [301],
    picture: images.puddle,
  },
  {
    id: 4,
    name: "Sea",
    fishingXP: 8,
    fishingXPUnlock: 200,
    fishingDelay: 6000,
    fishingLootIds: [301],
    picture: images.puddle,
  },
  {
    id: 5,
    name: "Ocean",
    fishingXP: 16,
    fishingXPUnlock: 300,
    fishingDelay: 7000,
    fishingLootIds: [301],
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
    picture: images.potion1,
    value: 1,
    effect: "health",
  },
];
