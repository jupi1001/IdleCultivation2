import { CombatArea } from "../enum/CombatArea";
import type { CultivationPath } from "./cultivationPath";
import EnemyI from "../interfaces/EnemyI";
import FishingAreaI from "../interfaces/FishingAreaI";
import GatheringAreaI from "../interfaces/GatheringAreaI";
import MiningAreaI from "../interfaces/MiningAreaI";
import Item from "../interfaces/ItemI";
import SectI from "../interfaces/SectI";
import SkillI from "../interfaces/SkillI";
import images from "./images";

/** Short descriptions for the Righteous vs Demonic path choice at game start. */
export const pathDescriptions: Record<CultivationPath, { title: string; description: string }> = {
  Righteous:
    { title: "Righteous Path", description: "Walk the path of virtue. Righteous sects and talents will open to you." },
  Demonic:
    { title: "Demonic Path", description: "Embrace the demonic way. Demonic sects and darker talents await." },
};

/** Sect positions/ranks. Order: 0 = Sect Aspirant (Mortal), 1 = Outer (Qi Condensation), 2 = Inner (Foundation), 3 = Core (FE 5+). */
/** requiredStepIndex: from realmProgression.getStepIndex (Mortal=0, QC1=1..QC10=10, FE1=11..FE10=20). */
export const SECT_POSITIONS = [
  { id: 0, name: "Sect Aspirant", requiredStepIndex: 0, requiredRealmLabel: "Mortal" },
  { id: 1, name: "Outer Disciple", requiredStepIndex: 1, requiredRealmLabel: "Qi Condensation" },
  { id: 2, name: "Inner Disciple", requiredStepIndex: 11, requiredRealmLabel: "Foundation Establishment" },
  { id: 3, name: "Core Disciple", requiredStepIndex: 15, requiredRealmLabel: "Foundation Establishment 5" },
] as const;

export type SectPositionId = (typeof SECT_POSITIONS)[number]["id"];

/** One entry in a sect's store: item and minimum rank (0=Outer, 1=Inner, 2=Core) required to see/buy. */
export interface SectStoreEntryI {
  item: Item;
  requiredRankIndex: number;
}

/** Sect store by sect id. requiredRankIndex: 0=Sect Aspirant, 1=Outer, 2=Inner, 3=Core. */
export const sectStoreData: Record<number, SectStoreEntryI[]> = {
  1: [
    { item: { id: 600, name: "Jade Mountain Sword Manual", description: "Basic sword form. Unlocks sect combat technique.", price: 150, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.15 }, requiredRankIndex: 1 },
    { item: { id: 601, name: "Mountain Heart Pill", description: "Sect pill for qi refinement.", price: 80, quantity: 1, picture: images.potion1, value: 5, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 602, name: "Inner Gate Qi Circulation", description: "Inner disciple technique. +0.35 Qi/s when meditating.", price: 400, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.35 }, requiredRankIndex: 2 },
    { item: { id: 603, name: "Jade Severance Recipe", description: "Alchemy recipe: Jade Severance Pill. Unlocks in Alchemy when learned.", price: 600, quantity: 1, picture: images.potion1 }, requiredRankIndex: 3 },
  ],
  2: [
    { item: { id: 610, name: "Valley Healing Herbs", description: "Herbs used in healing and pill recipes.", price: 60, quantity: 1, picture: images.potion1 }, requiredRankIndex: 1 },
    { item: { id: 611, name: "Verdant Qi Method", description: "Valley qi technique. +0.25 Qi/s when meditating.", price: 300, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.25 }, requiredRankIndex: 1 },
    { item: { id: 612, name: "Valley Restoration Recipe", description: "Alchemy recipe: restoration pill. Requires Inner Disciple.", price: 500, quantity: 1, picture: images.potion1 }, requiredRankIndex: 2 },
    { item: { id: 613, name: "Elder's Meditation Scroll", description: "Core disciple only. +0.5 Qi/s when meditating.", price: 800, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.5 }, requiredRankIndex: 3 },
  ],
  3: [
    { item: { id: 620, name: "Sky Pavilion Qi Primer", description: "Basic qi refinement manual.", price: 200, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.2 }, requiredRankIndex: 1 },
    { item: { id: 621, name: "Azure Condensation Pill", description: "Pill that aids qi condensation.", price: 120, quantity: 1, picture: images.potion1, value: 8, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 622, name: "High Peak Technique", description: "Inner disciple technique. +0.4 Qi/s when meditating.", price: 550, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.4 }, requiredRankIndex: 2 },
    { item: { id: 623, name: "Pavilion Core Manual", description: "Core disciple combat and qi manual. Requires Core Disciple.", price: 1000, quantity: 1, picture: images.potion1 }, requiredRankIndex: 3 },
  ],
  4: [
    { item: { id: 630, name: "Crimson Demon Strike", description: "Basic demonic combat technique.", price: 180, quantity: 1, picture: images.potion1 }, requiredRankIndex: 1 },
    { item: { id: 631, name: "Blood Qi Pill", description: "Demonic qi pill.", price: 90, quantity: 1, picture: images.potion1, value: 6, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 632, name: "Inner Demon Circulation", description: "Inner disciple. +0.35 Qi/s when meditating.", price: 450, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.35 }, requiredRankIndex: 2 },
    { item: { id: 633, name: "Core Demon Art", description: "Forbidden technique. Core Disciple only.", price: 900, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.55 }, requiredRankIndex: 3 },
  ],
  5: [
    { item: { id: 640, name: "Serpent Venom Recipe", description: "Basic poison recipe.", price: 100, quantity: 1, picture: images.potion1 }, requiredRankIndex: 1 },
    { item: { id: 641, name: "Shadow Step", description: "Assassin qi technique. +0.3 Qi/s when meditating.", price: 350, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.3 }, requiredRankIndex: 1 },
    { item: { id: 642, name: "Inner Serpent Formula", description: "Poison formula. Requires Inner Disciple.", price: 480, quantity: 1, picture: images.potion1 }, requiredRankIndex: 2 },
    { item: { id: 643, name: "Shadow Serpent Core Manual", description: "Core disciple manual. Requires Core Disciple.", price: 850, quantity: 1, picture: images.potion1 }, requiredRankIndex: 3 },
  ],
  6: [
    { item: { id: 650, name: "Bone Refinement Pill", description: "Sect pill for bone tempering.", price: 110, quantity: 1, picture: images.potion1, value: 7, effect: "attack" }, requiredRankIndex: 1 },
    { item: { id: 651, name: "Abyss Qi Draw", description: "Basic abyss technique. +0.28 Qi/s when meditating.", price: 320, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.28 }, requiredRankIndex: 1 },
    { item: { id: 652, name: "Undead Cultivation Fragment", description: "Inner disciple fragment. Requires Inner Disciple.", price: 520, quantity: 1, picture: images.potion1 }, requiredRankIndex: 2 },
    { item: { id: 653, name: "Bone Abyss Core Scripture", description: "Core disciple forbidden scripture. Requires Core Disciple.", price: 950, quantity: 1, picture: images.potion1, equipmentSlot: "qiTechnique", qiGainBonus: 0.52 }, requiredRankIndex: 3 },
  ],
};

/** Sects on the world map. 3 Righteous, 3 Demonic. positionX/Y are percentage (0–100) for map pin. */
export const sectsData: SectI[] = [
  { id: 1, name: "Jade Mountain Sect", description: "A righteous sect known for sword arts and strict discipline.", path: "Righteous", positionX: 23, positionY: 36 },
  { id: 2, name: "Verdant Valley Sect", description: "Righteous cultivators of the valley, masters of healing and herb lore.", path: "Righteous", positionX: 80, positionY: 75 },
  { id: 3, name: "Azure Sky Pavilion", description: "Righteous sect of the high peaks, focused on qi refinement and meditation.", path: "Righteous", positionX: 72, positionY: 16 },
  { id: 4, name: "Crimson Demon Sect", description: "Demonic sect that prizes strength and conquest above all.", path: "Demonic", positionX: 20, positionY: 65 },
  { id: 5, name: "Shadow Serpent Hall", description: "Demonic sect of assassins and poison masters.", path: "Demonic", positionX: 20, positionY: 85 },
  { id: 6, name: "Bone Abyss Sect", description: "Demonic sect that delves into forbidden arts and undead cultivation.", path: "Demonic", positionX: 77, positionY: 46},
];

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

/** Black market items (e.g. Shadow Bazaar on map) – forbidden or rare wares. */
export const existingBlackMarketItems: Item[] = [
  {
    id: 500,
    name: "Forbidden Qi Pill",
    description: "Unrefined qi from questionable sources. Stronger, riskier.",
    price: 25,
    quantity: 1,
    picture: images.potion1,
    value: 3,
    effect: "attack",
  },
  {
    id: 501,
    name: "Blood Spirit Stone",
    description: "Spirit stone tinged with demonic essence. No questions asked.",
    price: 350,
    quantity: 1,
    picture: images.potion1,
    value: 25,
    effect: "attack",
  },
  {
    id: 502,
    name: "Veiled Meditation Scroll",
    description: "A technique not taught in righteous sects. +0.4 Qi/s when meditating.",
    price: 800,
    quantity: 1,
    picture: images.potion1,
    equipmentSlot: "qiTechnique",
    qiGainBonus: 0.4,
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
