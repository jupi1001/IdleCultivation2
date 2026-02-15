import { CombatArea } from "../enum/CombatArea";
import type { CultivationPath } from "./cultivationPath";
import EnemyI from "../interfaces/EnemyI";
import FishingAreaI from "../interfaces/FishingAreaI";
import GatheringAreaI from "../interfaces/GatheringAreaI";
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
/** Base path for gathering area images. Add images under public/assets/gathering/ */
const GATHERING_ASSETS = "/assets/gathering";

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

export const gatheringAreaData: GatheringAreaI[] = [
  {
    id: 1,
    name: "Mortal Oak Grove",
    gatheringXP: 1,
    gatheringXPUnlock: 0,
    gatheringDelay: 4000,
    gatheringLootIds: [601],
    picture: `${GATHERING_ASSETS}/mortal-oak-grove.png`,
    altText: "Mortal Oak Grove",
  },
  {
    id: 2,
    name: "Hundred Herb Garden",
    gatheringXP: 1,
    gatheringXPUnlock: 0,
    gatheringDelay: 4000,
    gatheringLootIds: [611, 612],
    picture: `${GATHERING_ASSETS}/hundred-herb-garden.png`,
    altText: "Hundred Herb Garden",
  },
  {
    id: 3,
    name: "Iron Bamboo Forest",
    gatheringXP: 2,
    gatheringXPUnlock: 25,
    gatheringDelay: 5000,
    gatheringLootIds: [602],
    picture: `${GATHERING_ASSETS}/iron-bamboo-forest.png`,
    altText: "Iron Bamboo Forest",
  },
  {
    id: 4,
    name: "Spirit Grass Valley",
    gatheringXP: 4,
    gatheringXPUnlock: 100,
    gatheringDelay: 6000,
    gatheringLootIds: [613, 614],
    picture: `${GATHERING_ASSETS}/spirit-grass-valley.png`,
    altText: "Spirit Grass Valley",
  },
  {
    id: 5,
    name: "Ancient Cypress Peak",
    gatheringXP: 8,
    gatheringXPUnlock: 200,
    gatheringDelay: 7000,
    gatheringLootIds: [603],
    picture: `${GATHERING_ASSETS}/ancient-cypress-peak.png`,
    altText: "Ancient Cypress Peak",
  },
  {
    id: 6,
    name: "Heavenly Herb Cliff",
    gatheringXP: 8,
    gatheringXPUnlock: 300,
    gatheringDelay: 7000,
    gatheringLootIds: [614, 615, 616],
    picture: `${GATHERING_ASSETS}/heavenly-herb-cliff.png`,
    altText: "Heavenly Herb Cliff",
  },
];

export const woodTypes: Item[] = [
  {
    id: 601,
    name: "Oak Wood",
    description: "Common oak. Used for weapons and to light the alchemy forge.",
    price: 2,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-oak-wood.png`,
    value: 0,
  },
  {
    id: 602,
    name: "Iron Bamboo",
    description: "Hard bamboo favoured by cultivators. Used in forging and cooking fires.",
    price: 5,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-iron-bamboo.png`,
    value: 0,
  },
  {
    id: 603,
    name: "Spirit Cypress Wood",
    description: "Wood touched by Qi. Used for spirit weapons and high-grade alchemy.",
    price: 12,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-spirit-cypress.png`,
    value: 0,
  },
];

export const herbTypes: Item[] = [
  {
    id: 611,
    name: "Common Herb",
    description: "A basic herb. Used in pills and alchemy.",
    price: 1,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-common-herb.png`,
    value: 0,
  },
  {
    id: 612,
    name: "Spirit Leaf",
    description: "Leaf imbued with faint Qi. Used in low-grade pills.",
    price: 2,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-spirit-leaf.png`,
    value: 0,
  },
  {
    id: 613,
    name: "Spirit Grass",
    description: "Grass from spirit-rich soil. Used in alchemy pills.",
    price: 4,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-spirit-grass.png`,
    value: 0,
  },
  {
    id: 614,
    name: "Silver Leaf",
    description: "Rare herb with a silvery sheen. Used in refinement pills.",
    price: 6,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-silver-leaf.png`,
    value: 0,
  },
  {
    id: 615,
    name: "Jade Spirit Herb",
    description: "Precious herb favoured in high-level alchemy.",
    price: 10,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-jade-spirit-herb.png`,
    value: 0,
  },
  {
    id: 616,
    name: "Heavenly Ginseng",
    description: "Rare ginseng said to touch the heavens. Used in breakthrough pills.",
    price: 15,
    quantity: 1,
    picture: `${GATHERING_ASSETS}/item-heavenly-ginseng.png`,
    value: 0,
  },
];

/** All gathering loot (wood + herbs) for lookup when completing a gather. */
export const gatheringLootTypes: Item[] = [...woodTypes, ...herbTypes];
