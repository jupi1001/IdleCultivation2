import { CombatArea } from "../enum/CombatArea";
import type { CultivationPath } from "./cultivationPath";
import EnemyI from "../interfaces/EnemyI";
import FishingAreaI from "../interfaces/FishingAreaI";
import MiningAreaI from "../interfaces/MiningAreaI";
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
  { id: 3, name: "Meditation", description: "Cultivate Qi in solitude" },
  { id: 1, name: "Martial Training", description: "Train combat and face trials" },
  { id: 10, name: "Immortals Island", description: "Send expeditions for rewards" },
  { id: 2, name: "Labour", description: "Earn spirit stones" },
  { id: 4, name: "Fishing", description: "Fish in waters for spirit fish" },
  { id: 5, name: "Mining", description: "Mine ores and spirit stones" },
  { id: 6, name: "Gathering", description: "Gather herbs and wood" },
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

/** Base path for fishing area images. Add images under public/assets/fishing/ */
const FISHING_ASSETS = "/assets/fishing";
/** Base path for fish item images. Add images under public/assets/fish/ */
const FISH_ASSETS = "/assets/fish";
/** Base path for mining area images. Add images under public/assets/mining/ */
const MINING_ASSETS = "/assets/mining";

export const fishingAreaData: FishingAreaI[] = [
  {
    id: 1,
    name: "Village Pond",
    fishingXP: 1,
    fishingXPUnlock: 0,
    fishingDelay: 3000,
    fishingLootIds: [301],
    picture: `${FISHING_ASSETS}/village-pond.png`,
    altText: "Village Pond – calm waters",
  },
  {
    id: 2,
    name: "Small Lake",
    fishingXP: 2,
    fishingXPUnlock: 25,
    fishingDelay: 4000,
    fishingLootIds: [301, 304],
    picture: `${FISHING_ASSETS}/small-lake.png`,
    altText: "Small Lake",
  },
  {
    id: 3,
    name: "Spirit River",
    fishingXP: 4,
    fishingXPUnlock: 100,
    fishingDelay: 5000,
    fishingLootIds: [302],
    picture: `${FISHING_ASSETS}/spirit-river.png`,
    altText: "Spirit River – Qi-rich waters",
  },
  {
    id: 4,
    name: "Spirit Sea",
    fishingXP: 8,
    fishingXPUnlock: 200,
    fishingDelay: 6000,
    fishingLootIds: [302, 303],
    picture: `${FISHING_ASSETS}/spirit-sea.png`,
    altText: "Spirit Sea",
  },
  {
    id: 5,
    name: "Abyssal Ocean",
    fishingXP: 16,
    fishingXPUnlock: 300,
    fishingDelay: 7000,
    fishingLootIds: [302, 303, 305],
    picture: `${FISHING_ASSETS}/abyssal-ocean.png`,
    altText: "Abyssal Ocean – deep spirit waters",
  },
];

export const fishTypes: Item[] = [
  {
    id: 301,
    name: "Spirit Minnow",
    description: "A small fish touched by Qi. Can be used in pills. Restores 1 Qi.",
    price: 1,
    quantity: 1,
    picture: `${FISH_ASSETS}/spirit-minnow.png`,
    value: 1,
    effect: "qi",
  },
  {
    id: 302,
    name: "River Carp",
    description: "Common in Spirit River. Good for cooking.",
    price: 3,
    quantity: 1,
    picture: `${FISH_ASSETS}/river-carp.png`,
    value: 2,
    effect: "vitality",
  },
  {
    id: 303,
    name: "Jade Tuna",
    description: "Large spirit fish from the Spirit Sea.",
    price: 5,
    quantity: 1,
    picture: `${FISH_ASSETS}/jade-tuna.png`,
    value: 3,
    effect: "vitality",
  },
  {
    id: 304,
    name: "Silver Mackerel",
    description: "Swift fish rich in spiritual energy.",
    price: 2,
    quantity: 1,
    picture: `${FISH_ASSETS}/silver-mackerel.png`,
    value: 2,
    effect: "vitality",
  },
  {
    id: 305,
    name: "Abyssal Puffer",
    description: "Rare fish from the deep. Handle with care when preparing.",
    price: 7,
    quantity: 1,
    picture: `${FISH_ASSETS}/abyssal-puffer.png`,
    value: 5,
    effect: "vitality",
  },
];

export const miningAreaData: MiningAreaI[] = [
  {
    id: 1,
    name: "Copper Ore",
    miningXP: 1,
    miningXPUnlock: 0,
    miningDelay: 4000,
    miningLootId: 501,
    picture: `${MINING_ASSETS}/copper-ore.png`,
    altText: "Copper ore vein",
  },
  {
    id: 2,
    name: "Iron Ore",
    miningXP: 2,
    miningXPUnlock: 25,
    miningDelay: 5000,
    miningLootId: 502,
    picture: `${MINING_ASSETS}/iron-ore.png`,
    altText: "Iron ore vein",
  },
  {
    id: 3,
    name: "Spirit Vein",
    miningXP: 4,
    miningXPUnlock: 100,
    miningDelay: 6000,
    miningLootId: 503,
    picture: `${MINING_ASSETS}/spirit-vein.png`,
    altText: "Spirit stone vein",
  },
];

export const oreTypes: Item[] = [
  {
    id: 501,
    name: "Copper Ore",
    description: "Raw copper ore. Used in forging.",
    price: 2,
    quantity: 1,
    picture: `${MINING_ASSETS}/item-copper-ore.png`,
    value: 0,
  },
  {
    id: 502,
    name: "Iron Ore",
    description: "Raw iron ore. Used in forging.",
    price: 5,
    quantity: 1,
    picture: `${MINING_ASSETS}/item-iron-ore.png`,
    value: 0,
  },
  {
    id: 503,
    name: "Spirit Stone",
    description: "Condensed spirit energy. Used in cultivation and crafting.",
    price: 3,
    quantity: 1,
    picture: `${MINING_ASSETS}/item-spirit-stone.png`,
    value: 0,
  },
];
