/**
 * Gathering area definitions and GATHERING_AREAS_BY_ID registry.
 */
import type GatheringAreaI from "../../interfaces/GatheringAreaI";
import { totalXpForLevel } from "../../constants/gatheringLevel";
import { RING_IDS, AMULET_IDS } from "../../constants/ringsAmulets";

const GATHERING_ASSETS = "/assets/gathering";

export const gatheringAreaData: GatheringAreaI[] = [
  { id: 1, name: "Mortal Oak Grove", gatheringXP: 1, gatheringXPUnlock: totalXpForLevel(1), gatheringDelay: 4000, gatheringLootIds: [601], picture: `${GATHERING_ASSETS}/mortal-oak-grove.webp`, altText: "Mortal Oak Grove" },
  { id: 2, name: "Hundred Herb Garden", gatheringXP: 1, gatheringXPUnlock: totalXpForLevel(1), gatheringDelay: 4000, gatheringLootIds: [611, 612], picture: `${GATHERING_ASSETS}/hundred-herb-garden.webp`, altText: "Hundred Herb Garden" },
  { id: 3, name: "Iron Bamboo Forest", gatheringXP: 2, gatheringXPUnlock: totalXpForLevel(8), gatheringDelay: 4500, gatheringLootIds: [602], picture: `${GATHERING_ASSETS}/iron-bamboo-forest.webp`, altText: "Iron Bamboo Forest" },
  { id: 4, name: "Spirit Grass Valley", gatheringXP: 4, gatheringXPUnlock: totalXpForLevel(16), gatheringDelay: 5000, gatheringLootIds: [613, 614], picture: `${GATHERING_ASSETS}/spirit-grass-valley.webp`, altText: "Spirit Grass Valley" },
  { id: 5, name: "Ancient Cypress Peak", gatheringXP: 6, gatheringXPUnlock: totalXpForLevel(24), gatheringDelay: 5500, gatheringLootIds: [603], picture: `${GATHERING_ASSETS}/ancient-cypress-peak.webp`, altText: "Ancient Cypress Peak" },
  { id: 6, name: "Heavenly Herb Cliff", gatheringXP: 8, gatheringXPUnlock: totalXpForLevel(32), gatheringDelay: 6000, gatheringLootIds: [614, 615, 616], picture: `${GATHERING_ASSETS}/heavenly-herb-cliff.webp`, altText: "Heavenly Herb Cliff" },
  { id: 7, name: "Pine Hollow", gatheringXP: 10, gatheringXPUnlock: totalXpForLevel(41), gatheringDelay: 6500, gatheringLootIds: [604], picture: `${GATHERING_ASSETS}/pine-hollow.webp`, altText: "Dense pine grove" },
  { id: 8, name: "Moonlit Herb Patch", gatheringXP: 12, gatheringXPUnlock: totalXpForLevel(50), gatheringDelay: 7000, gatheringLootIds: [616, 617], picture: `${GATHERING_ASSETS}/moonlit-herb-patch.webp`, altText: "Herbs that bloom under moonlight" },
  { id: 9, name: "Ebony Grove", gatheringXP: 14, gatheringXPUnlock: totalXpForLevel(59), gatheringDelay: 7500, gatheringLootIds: [605], picture: `${GATHERING_ASSETS}/ebony-grove.webp`, altText: "Dark ebony trees" },
  { id: 10, name: "Star Moss Vale", gatheringXP: 16, gatheringXPUnlock: totalXpForLevel(68), gatheringDelay: 8000, gatheringLootIds: [617, 618], picture: `${GATHERING_ASSETS}/star-moss-vale.webp`, altText: "Valley of star-catching moss" },
  { id: 11, name: "Void Willow Stand", gatheringXP: 20, gatheringXPUnlock: totalXpForLevel(76), gatheringDelay: 8500, gatheringLootIds: [606], picture: `${GATHERING_ASSETS}/void-willow-stand.webp`, altText: "Willows that drink from the void" },
  { id: 12, name: "Dragon Ash Thicket", gatheringXP: 24, gatheringXPUnlock: totalXpForLevel(83), gatheringDelay: 9000, gatheringLootIds: [607], picture: `${GATHERING_ASSETS}/dragon-ash-thicket.webp`, altText: "Ashen wood from dragon lands" },
  { id: 13, name: "Primordial Herb Garden", gatheringXP: 28, gatheringXPUnlock: totalXpForLevel(88), gatheringDelay: 9500, gatheringLootIds: [618, 619, 620], picture: `${GATHERING_ASSETS}/primordial-herb-garden.webp`, altText: "Ancient herbs from the dawn of Qi", rareDropChancePercent: 1, rareDropItemIds: [AMULET_IDS.spiritHerbCharm] },
  { id: 14, name: "Celestial Bamboo Grove", gatheringXP: 34, gatheringXPUnlock: totalXpForLevel(92), gatheringDelay: 10000, gatheringLootIds: [608], picture: `${GATHERING_ASSETS}/celestial-bamboo-grove.webp`, altText: "Bamboo touched by heavenly Qi" },
  { id: 15, name: "Transcendent Spirit Peak", gatheringXP: 42, gatheringXPUnlock: totalXpForLevel(99), gatheringDelay: 11000, gatheringLootIds: [620, 621, 622], picture: `${GATHERING_ASSETS}/transcendent-spirit-peak.webp`, altText: "Peak where spirit herbs reach beyond", rareDropChancePercent: 1, rareDropItemIds: [RING_IDS.primordialSeal] },
  { id: 16, name: "Ascendant Herb Sanctum", gatheringXP: 50, gatheringXPUnlock: totalXpForLevel(105), gatheringDelay: 11500, gatheringLootIds: [609, 623], picture: `${GATHERING_ASSETS}/ascendant-herb-sanctum.webp`, altText: "Sanctum where herbs transcend. Requires reincarnation.", requiresReincarnation: true },
  { id: 17, name: "Karmic Lotus Pool", gatheringXP: 56, gatheringXPUnlock: totalXpForLevel(110), gatheringDelay: 12000, gatheringLootIds: [610, 624], picture: `${GATHERING_ASSETS}/karmic-lotus-pool.webp`, altText: "Lotus pool reflecting karma. Requires reincarnation.", requiresReincarnation: true },
  { id: 18, name: "Immortal Root Grove", gatheringXP: 62, gatheringXPUnlock: totalXpForLevel(115), gatheringDelay: 12500, gatheringLootIds: [625], picture: `${GATHERING_ASSETS}/immortal-root-grove.webp`, altText: "Grove of never-withering roots. Requires reincarnation.", requiresReincarnation: true },
  { id: 19, name: "Dao Essence Meadow", gatheringXP: 70, gatheringXPUnlock: totalXpForLevel(120), gatheringDelay: 13000, gatheringLootIds: [626], picture: `${GATHERING_ASSETS}/dao-essence-meadow.webp`, altText: "Meadow where the Dao takes form. Requires reincarnation.", requiresReincarnation: true },
];

export const GATHERING_AREAS_BY_ID: Record<number, GatheringAreaI> = Object.fromEntries(gatheringAreaData.map((a) => [a.id, a])) as Record<number, GatheringAreaI>;
export const GATHERING_AREA_INDEX_BY_ID: Record<number, number> = Object.fromEntries(gatheringAreaData.map((a, i) => [a.id, i])) as Record<number, number>;
