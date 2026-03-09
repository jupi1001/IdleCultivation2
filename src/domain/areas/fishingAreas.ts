/**
 * Fishing area definitions and FISHING_AREAS_BY_ID registry.
 */
import { totalXpForLevel } from "../../constants/fishingLevel";
import { RING_IDS, AMULET_IDS } from "../../constants/ringsAmulets";
import type FishingAreaI from "../../interfaces/FishingAreaI";
import { parseFishingAreas } from "../../schemas/areas";

const FISHING_ASSETS = "/assets/fishing";

export const fishingAreaData: FishingAreaI[] = [
  { id: 1, name: "Village Pond", xp: 1, xpUnlock: totalXpForLevel(1), delay: 3000, fishingLootIds: [301], picture: `${FISHING_ASSETS}/village-pond.webp`, altText: "Village Pond – calm waters" },
  { id: 2, name: "Small Lake", xp: 2, xpUnlock: totalXpForLevel(8), delay: 3500, fishingLootIds: [301, 304], picture: `${FISHING_ASSETS}/small-lake.webp`, altText: "Small Lake" },
  { id: 3, name: "Spirit River", xp: 4, xpUnlock: totalXpForLevel(16), delay: 4000, fishingLootIds: [301, 302, 304], picture: `${FISHING_ASSETS}/spirit-river.webp`, altText: "Qi-rich flowing waters" },
  { id: 4, name: "Lotus Sect Lake", xp: 7, xpUnlock: totalXpForLevel(24), delay: 4500, fishingLootIds: [302, 306], picture: `${FISHING_ASSETS}/lotus-lake.webp`, altText: "Lake filled with spirit lotuses" },
  { id: 5, name: "Spirit Sea", xp: 11, xpUnlock: totalXpForLevel(32), delay: 5000, fishingLootIds: [302, 303, 306], picture: `${FISHING_ASSETS}/spirit-sea.webp`, altText: "Vast spiritual sea" },
  { id: 6, name: "Cloudfall Pools", xp: 16, xpUnlock: totalXpForLevel(41), delay: 5500, fishingLootIds: [306, 307, 308], picture: `${FISHING_ASSETS}/cloudfall-pools.webp`, altText: "High mountain spirit pools" },
  { id: 7, name: "Frozen Moon Lake", xp: 22, xpUnlock: totalXpForLevel(50), delay: 6000, fishingLootIds: [309, 307], picture: `${FISHING_ASSETS}/frozen-lake.webp`, altText: "Icy lake under eternal moonlight" },
  { id: 8, name: "Demon Abyss", xp: 30, xpUnlock: totalXpForLevel(59), delay: 6500, fishingLootIds: [305, 310], picture: `${FISHING_ASSETS}/demon-abyss.webp`, altText: "Dark waters filled with demonic Qi" },
  { id: 9, name: "Heavenly River", xp: 40, xpUnlock: totalXpForLevel(68), delay: 7000, fishingLootIds: [311, 308], picture: `${FISHING_ASSETS}/heavenly-river.webp`, altText: "River flowing through the heavens", rareDropChancePercent: 1, rareDropItemIds: [AMULET_IDS.eightMeridian] },
  { id: 10, name: "Dragon Vein Ocean", xp: 55, xpUnlock: totalXpForLevel(76), delay: 7500, fishingLootIds: [312, 311], picture: `${FISHING_ASSETS}/dragon-ocean.webp`, altText: "Ocean above a dragon vein" },
  { id: 11, name: "Blazing Crater Lake", xp: 65, xpUnlock: totalXpForLevel(83), delay: 7800, fishingLootIds: [313, 316], picture: `${FISHING_ASSETS}/crater-lake.webp`, altText: "A volcanic lake radiating heat" },
  { id: 12, name: "Moonlit Reflection Pool", xp: 70, xpUnlock: totalXpForLevel(88), delay: 8000, fishingLootIds: [314, 319], picture: `${FISHING_ASSETS}/moon-pool.webp`, altText: "Still waters reflecting the full moon", rareDropChancePercent: 1, rareDropItemIds: [RING_IDS.moonlitReflection] },
  { id: 13, name: "Falling Star Stream", xp: 75, xpUnlock: totalXpForLevel(92), delay: 8200, fishingLootIds: [315, 320], picture: `${FISHING_ASSETS}/star-stream.webp`, altText: "A stream where stars are said to fall" },
  { id: 14, name: "Void Rift Waters", xp: 82, xpUnlock: totalXpForLevel(96), delay: 8500, fishingLootIds: [318, 321], picture: `${FISHING_ASSETS}/void-rift.webp`, altText: "Waters bordering a spatial rift" },
  { id: 15, name: "Primordial Spirit Sea", xp: 95, xpUnlock: totalXpForLevel(99), delay: 9000, fishingLootIds: [322, 312, 320], picture: `${FISHING_ASSETS}/primordial-sea.webp`, altText: "Ancient sea filled with primordial Qi", rareDropChancePercent: 1, rareDropItemIds: [AMULET_IDS.transcendentDao] },
  { id: 16, name: "Sage Waters", xp: 102, xpUnlock: totalXpForLevel(105), delay: 9200, fishingLootIds: [323, 322], picture: `${FISHING_ASSETS}/sage-waters.webp`, altText: "Waters where sages once meditated", requiresReincarnation: true },
  { id: 17, name: "Karmic Stream", xp: 110, xpUnlock: totalXpForLevel(110), delay: 9400, fishingLootIds: [324, 323], picture: `${FISHING_ASSETS}/karmic-stream.webp`, altText: "Stream that reflects one's karma", requiresReincarnation: true },
  { id: 18, name: "Immortal's Basin", xp: 118, xpUnlock: totalXpForLevel(115), delay: 9600, fishingLootIds: [325, 324], picture: `${FISHING_ASSETS}/immortal-basin.webp`, altText: "A basin said to hold immortal essence", requiresReincarnation: true },
  { id: 19, name: "Dao Origin Sea", xp: 126, xpUnlock: totalXpForLevel(120), delay: 9800, fishingLootIds: [326, 325, 322], picture: `${FISHING_ASSETS}/dao-origin-sea.webp`, altText: "Where the Dao touches the mortal world", requiresReincarnation: true },
];

// Dev/test-only: validate fishing area definitions.
if (import.meta.env.MODE !== "production") {
  parseFishingAreas(fishingAreaData);
}

export const FISHING_AREAS_BY_ID: Record<number, FishingAreaI> = Object.fromEntries(fishingAreaData.map((a) => [a.id, a])) as Record<number, FishingAreaI>;
export const FISHING_AREA_INDEX_BY_ID: Record<number, number> = Object.fromEntries(fishingAreaData.map((a, i) => [a.id, i])) as Record<number, number>;
