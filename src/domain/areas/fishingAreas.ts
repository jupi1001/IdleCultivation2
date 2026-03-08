/**
 * Fishing area definitions and FISHING_AREAS_BY_ID registry.
 */
import type FishingAreaI from "../../interfaces/FishingAreaI";
import { totalXpForLevel } from "../../constants/fishingLevel";
import { RING_IDS, AMULET_IDS } from "../../constants/ringsAmulets";

const FISHING_ASSETS = "/assets/fishing";

export const fishingAreaData: FishingAreaI[] = [
  { id: 1, name: "Village Pond", fishingXP: 1, fishingXPUnlock: totalXpForLevel(1), fishingDelay: 3000, fishingLootIds: [301], picture: `${FISHING_ASSETS}/village-pond.webp`, altText: "Village Pond – calm waters" },
  { id: 2, name: "Small Lake", fishingXP: 2, fishingXPUnlock: totalXpForLevel(8), fishingDelay: 3500, fishingLootIds: [301, 304], picture: `${FISHING_ASSETS}/small-lake.webp`, altText: "Small Lake" },
  { id: 3, name: "Spirit River", fishingXP: 4, fishingXPUnlock: totalXpForLevel(16), fishingDelay: 4000, fishingLootIds: [301, 302, 304], picture: `${FISHING_ASSETS}/spirit-river.webp`, altText: "Qi-rich flowing waters" },
  { id: 4, name: "Lotus Sect Lake", fishingXP: 7, fishingXPUnlock: totalXpForLevel(24), fishingDelay: 4500, fishingLootIds: [302, 306], picture: `${FISHING_ASSETS}/lotus-lake.webp`, altText: "Lake filled with spirit lotuses" },
  { id: 5, name: "Spirit Sea", fishingXP: 11, fishingXPUnlock: totalXpForLevel(32), fishingDelay: 5000, fishingLootIds: [302, 303, 306], picture: `${FISHING_ASSETS}/spirit-sea.webp`, altText: "Vast spiritual sea" },
  { id: 6, name: "Cloudfall Pools", fishingXP: 16, fishingXPUnlock: totalXpForLevel(41), fishingDelay: 5500, fishingLootIds: [306, 307, 308], picture: `${FISHING_ASSETS}/cloudfall-pools.webp`, altText: "High mountain spirit pools" },
  { id: 7, name: "Frozen Moon Lake", fishingXP: 22, fishingXPUnlock: totalXpForLevel(50), fishingDelay: 6000, fishingLootIds: [309, 307], picture: `${FISHING_ASSETS}/frozen-lake.webp`, altText: "Icy lake under eternal moonlight" },
  { id: 8, name: "Demon Abyss", fishingXP: 30, fishingXPUnlock: totalXpForLevel(59), fishingDelay: 6500, fishingLootIds: [305, 310], picture: `${FISHING_ASSETS}/demon-abyss.webp`, altText: "Dark waters filled with demonic Qi" },
  { id: 9, name: "Heavenly River", fishingXP: 40, fishingXPUnlock: totalXpForLevel(68), fishingDelay: 7000, fishingLootIds: [311, 308], picture: `${FISHING_ASSETS}/heavenly-river.webp`, altText: "River flowing through the heavens", rareDropChancePercent: 1, rareDropItemIds: [AMULET_IDS.eightMeridian] },
  { id: 10, name: "Dragon Vein Ocean", fishingXP: 55, fishingXPUnlock: totalXpForLevel(76), fishingDelay: 7500, fishingLootIds: [312, 311], picture: `${FISHING_ASSETS}/dragon-ocean.webp`, altText: "Ocean above a dragon vein" },
  { id: 11, name: "Blazing Crater Lake", fishingXP: 65, fishingXPUnlock: totalXpForLevel(83), fishingDelay: 7800, fishingLootIds: [313, 316], picture: `${FISHING_ASSETS}/crater-lake.webp`, altText: "A volcanic lake radiating heat" },
  { id: 12, name: "Moonlit Reflection Pool", fishingXP: 70, fishingXPUnlock: totalXpForLevel(88), fishingDelay: 8000, fishingLootIds: [314, 319], picture: `${FISHING_ASSETS}/moon-pool.webp`, altText: "Still waters reflecting the full moon", rareDropChancePercent: 1, rareDropItemIds: [RING_IDS.moonlitReflection] },
  { id: 13, name: "Falling Star Stream", fishingXP: 75, fishingXPUnlock: totalXpForLevel(92), fishingDelay: 8200, fishingLootIds: [315, 320], picture: `${FISHING_ASSETS}/star-stream.webp`, altText: "A stream where stars are said to fall" },
  { id: 14, name: "Void Rift Waters", fishingXP: 82, fishingXPUnlock: totalXpForLevel(96), fishingDelay: 8500, fishingLootIds: [318, 321], picture: `${FISHING_ASSETS}/void-rift.webp`, altText: "Waters bordering a spatial rift" },
  { id: 15, name: "Primordial Spirit Sea", fishingXP: 95, fishingXPUnlock: totalXpForLevel(99), fishingDelay: 9000, fishingLootIds: [322, 312, 320], picture: `${FISHING_ASSETS}/primordial-sea.webp`, altText: "Ancient sea filled with primordial Qi", rareDropChancePercent: 1, rareDropItemIds: [AMULET_IDS.transcendentDao] },
  { id: 16, name: "Sage Waters", fishingXP: 102, fishingXPUnlock: totalXpForLevel(105), fishingDelay: 9200, fishingLootIds: [323, 322], picture: `${FISHING_ASSETS}/sage-waters.webp`, altText: "Waters where sages once meditated", requiresReincarnation: true },
  { id: 17, name: "Karmic Stream", fishingXP: 110, fishingXPUnlock: totalXpForLevel(110), fishingDelay: 9400, fishingLootIds: [324, 323], picture: `${FISHING_ASSETS}/karmic-stream.webp`, altText: "Stream that reflects one's karma", requiresReincarnation: true },
  { id: 18, name: "Immortal's Basin", fishingXP: 118, fishingXPUnlock: totalXpForLevel(115), fishingDelay: 9600, fishingLootIds: [325, 324], picture: `${FISHING_ASSETS}/immortal-basin.webp`, altText: "A basin said to hold immortal essence", requiresReincarnation: true },
  { id: 19, name: "Dao Origin Sea", fishingXP: 126, fishingXPUnlock: totalXpForLevel(120), fishingDelay: 9800, fishingLootIds: [326, 325, 322], picture: `${FISHING_ASSETS}/dao-origin-sea.webp`, altText: "Where the Dao touches the mortal world", requiresReincarnation: true },
];

export const FISHING_AREAS_BY_ID: Record<number, FishingAreaI> = Object.fromEntries(fishingAreaData.map((a) => [a.id, a])) as Record<number, FishingAreaI>;
export const FISHING_AREA_INDEX_BY_ID: Record<number, number> = Object.fromEntries(fishingAreaData.map((a, i) => [a.id, i])) as Record<number, number>;
