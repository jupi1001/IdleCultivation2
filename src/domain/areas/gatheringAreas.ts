/**
 * Gathering area definitions and GATHERING_AREAS_BY_ID registry.
 */
import { totalXpForLevel } from "../../constants/gatheringLevel";
import { RING_IDS, AMULET_IDS } from "../../constants/ringsAmulets";
import type GatheringAreaI from "../../interfaces/GatheringAreaI";
import { parseGatheringAreas } from "../../schemas/areas";

const GATHERING_ASSETS = "/assets/gathering";

export const gatheringAreaData: GatheringAreaI[] = [
  { id: 1, name: "Mortal Oak Grove", xp: 1, xpUnlock: totalXpForLevel(1), delay: 4000, gatheringLootIds: [601], picture: `${GATHERING_ASSETS}/mortal-oak-grove.webp`, altText: "Mortal Oak Grove" },
  { id: 2, name: "Hundred Herb Garden", xp: 1, xpUnlock: totalXpForLevel(1), delay: 4000, gatheringLootIds: [611, 612], picture: `${GATHERING_ASSETS}/hundred-herb-garden.webp`, altText: "Hundred Herb Garden" },
  { id: 3, name: "Iron Bamboo Forest", xp: 2, xpUnlock: totalXpForLevel(8), delay: 4500, gatheringLootIds: [602], picture: `${GATHERING_ASSETS}/iron-bamboo-forest.webp`, altText: "Iron Bamboo Forest" },
  { id: 4, name: "Spirit Grass Valley", xp: 4, xpUnlock: totalXpForLevel(16), delay: 5000, gatheringLootIds: [613, 614], picture: `${GATHERING_ASSETS}/spirit-grass-valley.webp`, altText: "Spirit Grass Valley" },
  { id: 5, name: "Ancient Cypress Peak", xp: 6, xpUnlock: totalXpForLevel(24), delay: 5500, gatheringLootIds: [603], picture: `${GATHERING_ASSETS}/ancient-cypress-peak.webp`, altText: "Ancient Cypress Peak" },
  { id: 6, name: "Heavenly Herb Cliff", xp: 8, xpUnlock: totalXpForLevel(32), delay: 6000, gatheringLootIds: [614, 615, 616], picture: `${GATHERING_ASSETS}/heavenly-herb-cliff.webp`, altText: "Heavenly Herb Cliff" },
  { id: 7, name: "Pine Hollow", xp: 10, xpUnlock: totalXpForLevel(41), delay: 6500, gatheringLootIds: [604], picture: `${GATHERING_ASSETS}/pine-hollow.webp`, altText: "Dense pine grove" },
  { id: 8, name: "Moonlit Herb Patch", xp: 12, xpUnlock: totalXpForLevel(50), delay: 7000, gatheringLootIds: [616, 617], picture: `${GATHERING_ASSETS}/moonlit-herb-patch.webp`, altText: "Herbs that bloom under moonlight" },
  { id: 9, name: "Ebony Grove", xp: 14, xpUnlock: totalXpForLevel(59), delay: 7500, gatheringLootIds: [605], picture: `${GATHERING_ASSETS}/ebony-grove.webp`, altText: "Dark ebony trees" },
  { id: 10, name: "Star Moss Vale", xp: 16, xpUnlock: totalXpForLevel(68), delay: 8000, gatheringLootIds: [617, 618], picture: `${GATHERING_ASSETS}/star-moss-vale.webp`, altText: "Valley of star-catching moss" },
  { id: 11, name: "Void Willow Stand", xp: 20, xpUnlock: totalXpForLevel(76), delay: 8500, gatheringLootIds: [606], picture: `${GATHERING_ASSETS}/void-willow-stand.webp`, altText: "Willows that drink from the void" },
  { id: 12, name: "Dragon Ash Thicket", xp: 24, xpUnlock: totalXpForLevel(83), delay: 9000, gatheringLootIds: [607], picture: `${GATHERING_ASSETS}/dragon-ash-thicket.webp`, altText: "Ashen wood from dragon lands" },
  { id: 13, name: "Primordial Herb Garden", xp: 28, xpUnlock: totalXpForLevel(88), delay: 9500, gatheringLootIds: [618, 619, 620], picture: `${GATHERING_ASSETS}/primordial-herb-garden.webp`, altText: "Ancient herbs from the dawn of Qi", rareDropChancePercent: 1, rareDropItemIds: [AMULET_IDS.spiritHerbCharm] },
  { id: 14, name: "Celestial Bamboo Grove", xp: 34, xpUnlock: totalXpForLevel(92), delay: 10000, gatheringLootIds: [608], picture: `${GATHERING_ASSETS}/celestial-bamboo-grove.webp`, altText: "Bamboo touched by heavenly Qi" },
  { id: 15, name: "Transcendent Spirit Peak", xp: 42, xpUnlock: totalXpForLevel(99), delay: 11000, gatheringLootIds: [620, 621, 622], picture: `${GATHERING_ASSETS}/transcendent-spirit-peak.webp`, altText: "Peak where spirit herbs reach beyond", rareDropChancePercent: 1, rareDropItemIds: [RING_IDS.primordialSeal] },
  { id: 16, name: "Ascendant Herb Sanctum", xp: 50, xpUnlock: totalXpForLevel(105), delay: 11500, gatheringLootIds: [609, 623], picture: `${GATHERING_ASSETS}/ascendant-herb-sanctum.webp`, altText: "Sanctum where herbs transcend. Requires reincarnation.", requiresReincarnation: true },
  { id: 17, name: "Karmic Lotus Pool", xp: 56, xpUnlock: totalXpForLevel(110), delay: 12000, gatheringLootIds: [610, 624], picture: `${GATHERING_ASSETS}/karmic-lotus-pool.webp`, altText: "Lotus pool reflecting karma. Requires reincarnation.", requiresReincarnation: true },
  { id: 18, name: "Immortal Root Grove", xp: 62, xpUnlock: totalXpForLevel(115), delay: 12500, gatheringLootIds: [625], picture: `${GATHERING_ASSETS}/immortal-root-grove.webp`, altText: "Grove of never-withering roots. Requires reincarnation.", requiresReincarnation: true },
  { id: 19, name: "Dao Essence Meadow", xp: 70, xpUnlock: totalXpForLevel(120), delay: 13000, gatheringLootIds: [626], picture: `${GATHERING_ASSETS}/dao-essence-meadow.webp`, altText: "Meadow where the Dao takes form. Requires reincarnation.", requiresReincarnation: true },
];

// Dev/test-only: validate gathering area definitions.
if (import.meta.env.MODE !== "production") {
  parseGatheringAreas(gatheringAreaData);
}

export const GATHERING_AREAS_BY_ID: Record<number, GatheringAreaI> = Object.fromEntries(gatheringAreaData.map((a) => [a.id, a])) as Record<number, GatheringAreaI>;
export const GATHERING_AREA_INDEX_BY_ID: Record<number, number> = Object.fromEntries(gatheringAreaData.map((a, i) => [a.id, i])) as Record<number, number>;
